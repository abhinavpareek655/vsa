"use client"

import { useRouter } from "next/navigation"
import UserBPage from "@/components/user-b-page"

export default function PrernaPage() {
  const router = useRouter()
  return <UserBPage onBack={() => router.push("/")} />
}
