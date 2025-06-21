"use client"
import { useEffect, useRef } from "react"

export interface ChannelMessage {
  id: number
  data: any
}

export default function useNetworkChannel(
  roomId: string,
  onMessage: (msg: any) => void,
) {
  const lastIdRef = useRef(0)
  const stopRef = useRef(false)

  useEffect(() => {
    stopRef.current = false
    const poll = async () => {
      while (!stopRef.current) {
        try {
          const res = await fetch(
            `/api/signaling?roomId=${encodeURIComponent(roomId)}&after=${lastIdRef.current}`,
          )
          if (res.ok) {
            const { messages } = await res.json()
            for (const m of messages as ChannelMessage[]) {
              lastIdRef.current = Math.max(lastIdRef.current, m.id)
              onMessage(m.data)
            }
          }
        } catch (err) {
          console.error(err)
        }
        await new Promise((r) => setTimeout(r, 500))
      }
    }
    poll()
    return () => {
      stopRef.current = true
    }
  }, [roomId, onMessage])

  const sendMessage = async (data: any) => {
    try {
      await fetch("/api/signaling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, message: data }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  return { sendMessage }
}
