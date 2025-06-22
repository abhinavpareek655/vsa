"use client"
import { useEffect, useRef } from "react"

export default function useNetworkChannel(
  roomId: string,
  onMessage: (msg: any) => void,
) {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss" : "ws"
    const ws = new WebSocket(
      `${protocol}://${location.host}/api/socket?roomId=${encodeURIComponent(roomId)}`,
    )
    wsRef.current = ws
    ws.onmessage = (e) => {
      try {
        onMessage(JSON.parse(e.data))
      } catch {
        onMessage(e.data)
      }
    }
    return () => {
      ws.close()
    }
  }, [roomId, onMessage])

  const sendMessage = (data: any) => {
    const msg = JSON.stringify(data)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg)
    }
  }

  return { sendMessage }
}
