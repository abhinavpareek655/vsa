"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from "lucide-react"

interface FloatingVideoCallProps {
  isUserA: boolean
  onEndCall: () => void
}

export default function FloatingVideoCall({ isUserA, onEndCall }: FloatingVideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => {
      setIsConnected(true)
    }, 1500)

    // Call duration timer
    const durationTimer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => {
      clearTimeout(connectTimer)
      clearInterval(durationTimer)
    }
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
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
          <span className="font-medium">{isUserA ? "User B" : "User A"}</span>
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
        {isConnected ? (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div
                className={`bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isMinimized ? "w-8 h-8" : "w-12 h-12"
                }`}
              >
                <Video className={isMinimized ? "w-4 h-4" : "w-6 h-6"} />
              </div>
              {!isMinimized && (
                <>
                  <p className="text-sm font-medium">{isUserA ? "User B" : "User A"}</p>
                  <p className="text-xs opacity-75">Remote video</p>
                </>
              )}
            </div>
          </div>
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
