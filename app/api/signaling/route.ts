interface StoredMessage {
  id: number
  data: any
}

const channels: Record<string, StoredMessage[]> = (globalThis as any).channels || {}
;(globalThis as any).channels = channels

export async function POST(req: Request) {
  const { roomId, message } = await req.json()
  if (!roomId) {
    return new Response("roomId required", { status: 400 })
  }
  if (!channels[roomId]) channels[roomId] = []
  const msg = { id: Date.now() + Math.random(), data: message }
  channels[roomId].push(msg)
  return Response.json({ id: msg.id })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId")
  const after = parseFloat(searchParams.get("after") || "0")
  if (!roomId) return new Response("roomId required", { status: 400 })
  const msgs = channels[roomId] || []
  const resMsgs = msgs.filter((m) => m.id > after)
  return Response.json({ messages: resMsgs })
}
