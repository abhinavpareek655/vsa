"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react"
import useWebRTC from "@/hooks/use-web-rtc"

interface VideoCallProps {
  isUserA: boolean
  onEndCall: () => void
}

export default function VideoCall({ isUserA, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const { localStream, remoteStream, isConnected } = useWebRTC({
    roomId: "main-room",
    isInitiator: isUserA,
  })

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between text-white">
        <div>
          <h2 className="text-lg font-semibold">Video Call - {isUserA ? "Abhinav" : "Prerna"}</h2>
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
          {isConnected && remoteStream ? (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video ref={remoteVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <video ref={localVideoRef} autoPlay playsInline muted className="hidden" />

              {/* Call info overlay */}
              <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-2 text-white text-sm">
                <p>Viewing: {isUserA ? "Prerna" : "Abhinav"}</p>
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
