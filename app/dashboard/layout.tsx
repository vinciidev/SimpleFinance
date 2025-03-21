"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setIsAuth(true)
    }
  }, [router])

  if (!isAuth) {
    return null // Não renderiza nada enquanto verifica a autenticação
  }

  return <>{children}</>
}

