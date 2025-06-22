import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'next/dist/compiled/ws'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.wss) {
    const wss = new Server({ noServer: true }) as any
    ;(res.socket.server as any).wss = wss

    const channels: Record<string, Set<any>> = {}

    res.socket.server.on('upgrade', (request: any, socket: any, head: any) => {
      if (!request.url?.startsWith('/api/socket')) return
      wss.handleUpgrade(request, socket, head, (ws: any) => {
        wss.emit('connection', ws, request)
      })
    })

    wss.on('connection', (ws: any, request: any) => {
      const { searchParams } = new URL(request.url || '', 'http://localhost')
      const roomId = searchParams.get('roomId') || 'default'
      if (!channels[roomId]) channels[roomId] = new Set()
      channels[roomId].add(ws)

      ws.on('message', (data: any) => {
        for (const client of channels[roomId]) {
          if (client !== ws && client.readyState === client.OPEN) {
            client.send(data)
          }
        }
      })

      ws.on('close', () => {
        channels[roomId].delete(ws)
      })
    })
  }
  res.end()
}
