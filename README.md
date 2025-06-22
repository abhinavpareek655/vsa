# Video Streaming and Call App

This project is an early prototype of a web based video streaming and calling platform built with **Next.js 15** and **React 19**. It allows two users to share and view videos while optionally participating in a WebRTC call.

## Features

- **User A (Abhinav)** can upload a video file and stream it to others.
- **User B (Prerna)** can watch the stream in real time.
- Peer-to-peer video calls are available using WebRTC. Calls appear as floating overlays so that streaming and calling work together.
- Basic signaling is handled through simple REST endpoints under `app/api/signaling`. Messages are polled by the client.
- UI components are styled with Tailwind CSS and Radix UI primitives.

To run the project locally:

```bash
pnpm install  # or npm install
npm run dev
```

The development server will start on `http://localhost:3000` by default.

## Known Issues / TODOs

- The `use-video-sync` hook now uses the network channel directly without leftover code.
- No authentication or persistence of rooms is implemented. All users join a default `main-room`.
- Linting is not configured yet; running `npm run lint` prompts for setup.
- `use-network-channel` now uses WebSockets instead of polling for improved efficiency.

This repository currently serves as an experiment and reference implementation. Contributions and bug reports are welcome!
