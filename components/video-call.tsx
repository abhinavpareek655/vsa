"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react"

interface VideoCallProps {
  isUserA: boolean
  onEndCall: () => void
}

export default function VideoCall({ isUserA, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => {
      setIsConnected(true)
    }, 2000)

    // Call duration timer
    const durationTimer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    // Simulate getting user media (for demonstration)
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        // Note: In real implementation, local video would be sent to peer
        // but not displayed locally as per requirements

        // For demo purposes, we'll show a placeholder for remote video
      } catch (error) {
        console.error("Error accessing media devices:", error)
      }
    }

    initializeMedia()

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between text-white">
        <div>
          <h2 className="text-lg font-semibold">Video Call - {isUserA ? "User A" : "User B"}</h2>
          <p className="text-sm text-gray-300">
            {isConnected ? `Connected • ${formatDuration(callDuration)}` : "Connecting..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}></div>
          <span className="text-sm">{isConnected ? "Connected" : "Connecting"}</span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {isConnected ? (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {/* Remote video (what the user sees) */}
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-12 h-12" />
                  </div>
                  <p className="text-xl font-medium">{isUserA ? "User B" : "User A"}</p>
                  <p className="text-sm opacity-75">Remote video stream</p>
                </div>
              </div>

              {/* Call info overlay */}
              <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-2 text-white text-sm">
                <p>Viewing: {isUserA ? "User B" : "User A"}</p>
                <p className="text-xs opacity-75">Your video is being sent</p>
              </div>

              {/* Status indicators */}
              <div className="absolute top-4 right-4 flex gap-2">
                {!isMuted && (
                  <div className="bg-green-500/80 rounded-full p-2">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                )}
                {isVideoEnabled && (
                  <div className="bg-blue-500/80 rounded-full p-2">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Establishing connection...</p>
                <p className="text-sm text-gray-300">Setting up WebRTC peer connection</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full w-14 h-14"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button variant="destructive" size="lg" onClick={onEndCall} className="rounded-full w-16 h-16">
            <PhoneOff className="w-8 h-8" />
          </Button>

          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-14 h-14"
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>
        </div>

        <div className="text-center mt-4 text-gray-300 text-sm">
          <p>Note: Your local video is not shown but is being transmitted</p>
        </div>
      </div>
    </div>
  )
}
