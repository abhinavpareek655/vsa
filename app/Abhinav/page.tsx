"use client"

import { useRouter } from "next/navigation"
import UserAPage from "@/components/user-a-page"

export default function AbhinavPage() {
  const router = useRouter()
  return <UserAPage onBack={() => router.push("/")} />
}
