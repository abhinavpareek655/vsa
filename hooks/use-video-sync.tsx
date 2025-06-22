import { useEffect, useRef, useState } from "react"
import useNetworkChannel from "./use-network-channel"

export interface VideoSyncMessage {
  type: "file" | "play" | "pause" | "seek"
  dataUrl?: string
  currentTime?: number
  sender?: string
}
export default function useVideoSync(videoRef: React.RefObject<HTMLVideoElement>) {
  const [remoteVideoUrl, setRemoteVideoUrl] = useState<string | null>(null)
  const idRef = useRef<string>("" + Math.random())

  const { sendMessage } = useNetworkChannel("video-sync", (msg: VideoSyncMessage) => {
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
  })

  const broadcast = (msg: Omit<VideoSyncMessage, "sender">) => {
    sendMessage({ ...msg, sender: idRef.current })
  }

  return { broadcast, remoteVideoUrl, setRemoteVideoUrl }
}
