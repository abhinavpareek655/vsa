"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Video, Phone, PhoneOff } from "lucide-react"
import VideoStreamer from "@/components/video-streamer"

interface UserAPageProps {
  onBack: () => void
}

export default function UserAPage({ onBack }: UserAPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
    }
  }

  const startStreaming = () => {
    if (selectedFile) {
      setIsStreaming(true)
    }
  }

  const toggleCall = () => {
    setIsInCall(!isInCall)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Abhinav Dashboard</h1>
          <div className="ml-auto">
            <Button
              onClick={toggleCall}
              variant={isInCall ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isInCall ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              {isInCall ? "End Call" : "Start Call"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Streaming Section - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Video Streaming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isStreaming ? (
                  <>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        {selectedFile ? selectedFile.name : "Select a video file to stream"}
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        Choose Video File
                      </Button>
                    </div>
                    {selectedFile && (
                      <Button onClick={startStreaming} className="w-full" size="lg">
                        Start Streaming
                      </Button>
                    )}
                  </>
                ) : (
                  <VideoStreamer
                    file={selectedFile!}
                    onStop={() => setIsStreaming(false)}
                    isInCall={isInCall}
                    isUserA={true}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Call Status Section - Takes 1/3 of the width */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Call Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6">
                  <div
                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      isInCall ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Phone className={`w-8 h-8 ${isInCall ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                  <p className="font-medium mb-2">{isInCall ? "Call Active" : "No Active Call"}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {isInCall
                      ? "Video call is active. Prerna's video appears in the streaming window."
                      : "Start a call to see Prerna's video overlay."}
                  </p>
                </div>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>• Your video is sent to Prerna</p>
                  <p>• Prerna's video appears as overlay</p>
                  <p>• No local preview shown</p>
                  <p>• Call works alongside streaming</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
