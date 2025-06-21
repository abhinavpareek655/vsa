"use client"

import { useState, useRef, useEffect } from "react"

export interface UseWebRTCOptions {
  roomId: string
  isInitiator: boolean
}

export default function useWebRTC({ roomId, isInitiator }: UseWebRTCOptions) {
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const channel = new BroadcastChannel(`webrtc-${roomId}`)
    channelRef.current = channel

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
    peerRef.current = peer

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        channel.postMessage({ type: "candidate", candidate: event.candidate })
      }
    }

    peer.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream()
      }
      remoteStreamRef.current.addTrack(event.track)
      setRemoteStream(new MediaStream(remoteStreamRef.current.getTracks()))
      setIsConnected(true)
    }

    channel.onmessage = async (ev) => {
      const msg = ev.data
      if (!peerRef.current) return
      switch (msg.type) {
        case "offer":
          if (!isInitiator) {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(msg.offer))
            const answer = await peerRef.current.createAnswer()
            await peerRef.current.setLocalDescription(answer)
            channel.postMessage({ type: "answer", answer })
          }
          break
        case "answer":
          if (isInitiator) {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(msg.answer))
          }
          break
        case "candidate":
          try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate))
          } catch (err) {
            console.error(err)
          }
          break
      }
    }

    const start = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideo = devices.some((d) => d.kind === "videoinput")
        const hasAudio = devices.some((d) => d.kind === "audioinput")

        const constraints: MediaStreamConstraints = {}
        if (hasVideo) constraints.video = true
        if (hasAudio) constraints.audio = true

        if (!hasVideo && !hasAudio) {
          console.warn("No media devices available")
          return
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        localStreamRef.current = stream
        setLocalStream(stream)
        stream.getTracks().forEach((track) => peer.addTrack(track, stream))
        if (isInitiator) {
          const offer = await peer.createOffer()
          await peer.setLocalDescription(offer)
          channel.postMessage({ type: "offer", offer })
        }
      } catch (err) {
        console.error("Failed to get user media", err)
      }
    }

    start()

    return () => {
      channel.close()
      peer.close()
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      remoteStreamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [roomId, isInitiator])

  return { localStream, remoteStream, isConnected }
}

