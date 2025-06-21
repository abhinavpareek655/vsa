"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Square, Volume2 } from "lucide-react"
import FloatingVideoCall from "@/components/floating-video-call"

interface VideoStreamerProps {
  file: File
  onStop: () => void
  isInCall?: boolean
  isUserA?: boolean
}

export default function VideoStreamer({ file, onStop, isInCall = false, isUserA = true }: VideoStreamerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto max-h-96"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4 text-white">
                <Button size="sm" variant="ghost" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>

                <Volume2 className="w-4 h-4" />
              </div>
            </div>
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
          <p className="font-medium">Now Streaming: {file.name}</p>
          <p>Status: {isPlaying ? "Playing" : "Paused"} • Quality: HD</p>
        </div>
        <Button onClick={onStop} variant="destructive" className="flex items-center gap-2">
          <Square className="w-4 h-4" />
          Stop Streaming
        </Button>
      </div>
    </div>
  )
}
