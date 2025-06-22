"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Upload, Video, Users } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Streaming &amp; Call App</h1>
          <p className="text-lg text-gray-600">Choose your role to start streaming or calling</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/Abhinav")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Abhinav</CardTitle>
              <CardDescription>Upload videos and start video calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>Upload and stream video files</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Initiate video calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span>See Prerna during calls</span>
                </div>
              </div>
              <Button className="w-full mt-6" size="lg">
                Join as Abhinav
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/Prerna")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Prerna</CardTitle>
              <CardDescription>Watch streams and receive video calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>Watch streamed videos in HD</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Receive video calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                  <span>See Abhinav during calls</span>
                </div>
              </div>
              <Button
                size="lg"
                variant="outline"
                className="w-full mt-6 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                Join as Prerna
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built with WebRTC for efficient peer-to-peer communication</p>
        </div>
      </div>
    </div>
  )
}
