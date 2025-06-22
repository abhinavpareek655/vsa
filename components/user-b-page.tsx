"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Video, Phone, PhoneOff } from "lucide-react"
import VideoViewer from "@/components/video-viewer"
import FloatingVideoCall from "@/components/floating-video-call"

interface UserBPageProps {
  onBack: () => void
}

export default function UserBPage({ onBack }: UserBPageProps) {
  const [isWatching, setIsWatching] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const ROOM_ID = "main-room"

  const startWatching = () => {
    setIsWatching(true)
  }

  const toggleCall = () => {
    setIsInCall(!isInCall)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Prerna Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              onClick={toggleCall}
              variant={isInCall ? "destructive" : "default"}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {isInCall ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              {isInCall ? "End Call" : "Join Call"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Viewing Section - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isWatching ? (
                  <div className="text-center p-8">
                    <Video className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">Watch videos streamed by Abhinav</p>
                    <Button onClick={startWatching} size="lg" className="w-full bg-green-600 hover:bg-green-700">
                      Start Watching
                    </Button>
                  </div>
                ) : (
                  <VideoViewer onStop={() => setIsWatching(false)} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Call Status Section - Takes 1/3 of the width */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
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
                      ? "Video call is active. Abhinav's video appears in the streaming window."
                      : "Join a call to see Abhinav's video overlay."}
                  </p>
                </div>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>• Your video is sent to Abhinav</p>
                  <p>• Abhinav's video appears as overlay</p>
                  <p>• No local preview shown</p>
                  <p>• Call works alongside streaming</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {isInCall && (
        <FloatingVideoCall
          isUserA={false}
          roomId={ROOM_ID}
          onEndCall={() => setIsInCall(false)}
        />
      )}
    </div>
  )
}
