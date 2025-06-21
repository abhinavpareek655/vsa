"use client"

import { useState, useRef, useEffect } from "react"
import useNetworkChannel from "./use-network-channel"

export interface UseWebRTCOptions {
  roomId: string
  isInitiator: boolean
}

export default function useWebRTC({ roomId, isInitiator }: UseWebRTCOptions) {
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  const { sendMessage } = useNetworkChannel(`webrtc-${roomId}`, async (msg) => {
    if (!peerRef.current) return
    switch (msg.type) {
      case "offer":
        if (!isInitiator) {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(msg.offer))
          const answer = await peerRef.current.createAnswer()
          await peerRef.current.setLocalDescription(answer)
          sendMessage({ type: "answer", answer })
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
  })

  useEffect(() => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
    peerRef.current = peer

    let cancelled = false

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({ type: "candidate", candidate: event.candidate.toJSON() })
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
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        localStreamRef.current = stream
        setLocalStream(stream)
        if (peer.signalingState !== "closed") {
          stream.getTracks().forEach((track) => peer.addTrack(track, stream))
        }
        if (isInitiator) {
          const offer = await peer.createOffer()
          await peer.setLocalDescription(offer)
          sendMessage({ type: "offer", offer })
        }
      } catch (err) {
        console.error("Failed to get user media", err)
      }
    }

    start()

    return () => {
      cancelled = true
      peer.close()
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
      remoteStreamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [roomId, isInitiator])

  return { localStream, remoteStream, isConnected }
}

