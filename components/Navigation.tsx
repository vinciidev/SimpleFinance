"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { CircleDollarSign, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { logout } from "@/lib/auth"
import { cn } from "@/lib/utils"

// Função para abrir o modal do Stripe
const openStripeCheckout = () => {
  // Verifica se o Stripe está carregado
  if (typeof window !== "undefined" && window.Stripe) {
    // Cria um elemento invisível do botão do Stripe
    const stripeButton = document.createElement("stripe-buy-button")
    stripeButton.setAttribute("buy-button-id", "buy_btn_1R54KCLW4QSUgIBP4Isp82KO")
    stripeButton.setAttribute(
      "publishable-key",
      "pk_live_51R4kYWLW4QSUgIBPdDUAE1TdAly8BfSHbLcUQLOSLtT0qcFDInwrbiLoptXXmEwFbCXU390O8MZ1TDOKSY1kEWVx00UWjmcxxw",
    )
    stripeButton.style.display = "none"
    document.body.appendChild(stripeButton)

    // Simula um clique no botão
    setTimeout(() => {
      stripeButton.shadowRoot?.querySelector("button")?.click()
    }, 100)
  }
}

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

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
      <div className="container flex items-center justify-between h-16">
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
        <div className="flex items-center gap-4">
          <p className="text-sm">Olá, Vinci!</p>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>

          {/* Adicione um botão para o Stripe mantendo a estilização */}
          <Button variant="outline" onClick={openStripeCheckout}>
            Assinar
          </Button>

          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </header>
  )
}

