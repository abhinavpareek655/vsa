"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Square,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  Fullscreen,
  Minimize,
  Subtitles,
  Languages,
} from "lucide-react"
import FloatingVideoCall from "@/components/floating-video-call"
import useVideoSync from "@/hooks/use-video-sync"

interface VideoViewerProps {
  onStop: () => void
  isInCall?: boolean
  isUserA?: boolean
  roomId?: string
  onEndCall?: () => void
}

export default function VideoViewer({
  onStop,
  isInCall = false,
  isUserA = false,
  roomId = "main-room",
  onEndCall,
}: VideoViewerProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [audioTracks, setAudioTracks] = useState<any[]>([])
  const [selectedAudio, setSelectedAudio] = useState(0)
  const [textTracks, setTextTracks] = useState<TextTrack[]>([])
  const [subtitlesOn, setSubtitlesOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { broadcast, remoteVideoUrl } = useVideoSync(videoRef)

  useEffect(() => {
    if (remoteVideoUrl) {
      setIsConnected(true)
    }
  }, [remoteVideoUrl])

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        broadcast({ type: "pause", currentTime: videoRef.current.currentTime })
      } else {
        videoRef.current.play()
        broadcast({ type: "play", currentTime: videoRef.current.currentTime })
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
      const v = videoRef.current as any
      if (v.audioTracks) {
        const tracks = Array.from(v.audioTracks)
        setAudioTracks(tracks)
        tracks.forEach((t: any, i: number) => (t.enabled = i === selectedAudio))
      }
      const tt = Array.from(videoRef.current.textTracks)
      setTextTracks(tt)
      tt.forEach((t) => (t.mode = subtitlesOn ? "showing" : "disabled"))
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
      broadcast({ type: "seek", currentTime: time })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleAudioSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.value)
    setSelectedAudio(index)
    audioTracks.forEach((t, i) => {
      if (t) (t as any).enabled = i === index
    })
  }

  const toggleSubtitles = () => {
    const enabled = !subtitlesOn
    setSubtitlesOn(enabled)
    textTracks.forEach((t) => (t.mode = enabled ? "showing" : "disabled"))
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
          <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden">
            {!remoteVideoUrl ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Waiting for stream...</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={remoteVideoUrl || undefined}
                  className="w-full h-auto max-h-96"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />

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
                      {audioTracks.length > 1 && (
                        <select
                          value={selectedAudio}
                          onChange={handleAudioSelect}
                          className="bg-transparent text-white text-sm border border-white/30 rounded p-1"
                        >
                          {audioTracks.map((_, i) => (
                            <option key={i} value={i} className="text-black">
                              Audio {i + 1}
                            </option>
                          ))}
                        </select>
                      )}
                      {textTracks.length > 0 && (
                        <Button size="sm" variant="ghost" onClick={toggleSubtitles} className="text-white hover:bg-white/20">
                          <Subtitles className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Fullscreen className="w-4 h-4" />}
                      </Button>
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
          roomId={roomId}
          onEndCall={onEndCall}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <p className="font-medium">Status: {isConnected ? "Connected" : "Waiting"}</p>
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
