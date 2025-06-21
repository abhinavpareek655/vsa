"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Square, Wifi, WifiOff } from "lucide-react"
import FloatingVideoCall from "@/components/floating-video-call"

interface VideoViewerProps {
  onStop: () => void
  isInCall?: boolean
  isUserA?: boolean
}

export default function VideoViewer({ onStop, isInCall = false, isUserA = false }: VideoViewerProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isBuffering, setIsBuffering] = useState(true)

  useEffect(() => {
    // Simulate connection and buffering
    const connectTimer = setTimeout(() => {
      setIsConnected(true)
      setIsBuffering(false)
    }, 2000)

    return () => clearTimeout(connectTimer)
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {isBuffering ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connecting to stream...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Simulated video stream */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-lg font-medium">Live Stream Active</p>
                    <p className="text-sm opacity-75">Receiving HD video from User A</p>
                  </div>
                </div>

                {/* Stream info overlay */}
                <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-2 text-white text-sm">
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <span>HD • Live</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isInCall && (
        <FloatingVideoCall
          isUserA={isUserA}
          onEndCall={() => {}} // This will be handled by parent component
        />
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <p className="font-medium">
            Status: {isBuffering ? "Connecting..." : isConnected ? "Connected" : "Disconnected"}
          </p>
          <p>Quality: HD • Latency: Low</p>
        </div>
        <Button onClick={onStop} variant="destructive" className="flex items-center gap-2">
          <Square className="w-4 h-4" />
          Stop Watching
        </Button>
      </div>
    </div>
  )
}
