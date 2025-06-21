"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from "lucide-react"
import useWebRTC from "@/hooks/use-web-rtc"

interface FloatingVideoCallProps {
  isUserA: boolean
  roomId: string
  onEndCall: () => void
}

export default function FloatingVideoCall({ isUserA, roomId, onEndCall }: FloatingVideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const { localStream, remoteStream, isConnected } = useWebRTC({ roomId, isInitiator: isUserA })
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (!isConnected) return
    const durationTimer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(durationTimer)
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => (t.enabled = isMuted))
    }
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => (t.enabled = !isVideoEnabled))
    }
    setIsVideoEnabled(!isVideoEnabled)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div
      className={`absolute top-4 right-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50 transition-all duration-300 ${
        isMinimized ? "w-48 h-32" : "w-80 h-60"
      }`}
    >
      {/* Header */}
      <div className="bg-gray-800 p-2 rounded-t-lg flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}></div>
          <span className="font-medium">{isUserA ? "Prerna" : "Abhinav"}</span>
          {isConnected && <span className="text-xs text-gray-300">{formatDuration(callDuration)}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMinimize}
            className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEndCall}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
          >
            <PhoneOff className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className={`relative bg-black ${isMinimized ? "h-20" : "h-40"} flex items-center justify-center`}>
        {isConnected && remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-white">
            <div
              className={`animate-spin rounded-full border-b-2 border-white mx-auto mb-2 ${
                isMinimized ? "h-6 w-6" : "h-8 w-8"
              }`}
            ></div>
            {!isMinimized && <p className="text-xs">Connecting...</p>}
          </div>
        )}

        {/* Status indicators */}
        {isConnected && (
          <div className="absolute top-2 right-2 flex gap-1">
            {!isMuted && (
              <div className="bg-green-500/80 rounded-full p-1">
                <Mic className="w-2 h-2 text-white" />
              </div>
            )}
            {isVideoEnabled && (
              <div className="bg-blue-500/80 rounded-full p-1">
                <Video className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {!isMinimized && (
        <div className="bg-gray-800 p-2 rounded-b-lg">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 p-0 rounded-full"
            >
              {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="sm"
              onClick={toggleVideo}
              className="h-8 w-8 p-0 rounded-full"
            >
              {isVideoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
