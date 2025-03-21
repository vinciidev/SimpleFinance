"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { CircleDollarSign, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { logout } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import PremiumBanner from "./PremiumBanner"

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Obter o nome de usuário do localStorage ou da API
    const storedUsername = localStorage.getItem("user_username")
    if (storedUsername) {
      setUsername(storedUsername)
    } else {
      // Se não estiver no localStorage, buscar da API
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("auth_token")
          if (!token) return

          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setUsername(data.username)
            localStorage.setItem("user_username", data.username)
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error)
        }
      }

      fetchUserData()
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    { name: "Visão Geral", path: "/dashboard" },
    { name: "Controle Mensal", path: "/dashboard/monthly" },
    { name: "Transações", path: "/dashboard/transactions" },
  ]

  return (
    <header className="border-b">
      <div className="container flex flex-wrap items-center justify-between py-4 md:h-16 md:py-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-6 h-6 text-primary" />
            <span className="font-semibold">Simple Finance</span>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm transition-colors hover:text-primary",
                  pathname === item.path ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
          <PremiumBanner />

          <div className="flex items-center gap-4">
            <p className="text-sm">Olá, {username || "Usuário"}!</p>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>

        <nav className="flex md:hidden items-center gap-4 w-full justify-between mt-4 border-t pt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm transition-colors hover:text-primary flex-1 text-center",
                pathname === item.path ? "text-primary font-medium" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

