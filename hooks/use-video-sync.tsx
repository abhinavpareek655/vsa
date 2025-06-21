import { useEffect, useRef, useState } from "react"

export interface VideoSyncMessage {
  type: "file" | "play" | "pause" | "seek"
  dataUrl?: string
  currentTime?: number
  sender?: string
}
export default function useVideoSync(videoRef: React.RefObject<HTMLVideoElement>) {
  const [remoteVideoUrl, setRemoteVideoUrl] = useState<string | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const idRef = useRef<string>("" + Math.random())

  useEffect(() => {
    const channel = new BroadcastChannel("video-sync")
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<VideoSyncMessage>) => {
      const msg = event.data
      if (msg.sender === idRef.current) return

      const video = videoRef.current

      switch (msg.type) {
        case "file":
          if (msg.dataUrl) setRemoteVideoUrl(msg.dataUrl)
          break
        case "play":
          if (!video) return
          if (typeof msg.currentTime === "number") video.currentTime = msg.currentTime
          video.play().catch(() => {})
          break
        case "pause":
          if (!video) return
          if (typeof msg.currentTime === "number") video.currentTime = msg.currentTime
          video.pause()
          break
        case "seek":
          if (!video) return
          if (typeof msg.currentTime === "number") video.currentTime = msg.currentTime
          break
      }
    }

    return () => channel.close()
  }, [videoRef])

  const broadcast = (msg: Omit<VideoSyncMessage, "sender">) => {
    channelRef.current?.postMessage({ ...msg, sender: idRef.current })
  }

  return { broadcast, remoteVideoUrl, setRemoteVideoUrl }
}
