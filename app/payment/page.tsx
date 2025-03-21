"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleDollarSign, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isAuthenticated, upgradeToPremium } from "@/lib/auth"
import Script from "next/script"

export default function PaymentPage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated()) {
      router.push("/login")
    }

    // Configurar o callback para quando o pagamento for concluído
    if (typeof window !== "undefined") {
      window.addEventListener("message", async (event) => {
        if (event.data.type === "buy-button:success" && event.origin === "https://js.stripe.com") {
          // Atualizar o usuário para premium
          const success = await upgradeToPremium()
          if (success) {
            // Redirecionar para o dashboard
            router.push("/dashboard?upgraded=true")
          }
        }
      })
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("message", () => {})
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Script async src="https://js.stripe.com/v3/buy-button.js" />

      <div className="w-full max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="flex items-center justify-center mb-8">
          <CircleDollarSign className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-3xl font-bold">Simple Finance</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2 border-muted">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold">R$0</span>
                <span className="ml-1 text-xl text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Acesso básico</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>1 planilha mensal</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-5 w-5 mr-2 flex items-center justify-center">✕</span>
                  <span>Relatórios detalhados</span>
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-5 w-5 mr-2 flex items-center justify-center">✕</span>
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">Você está usando o plano gratuito</p>
                <p className="text-sm text-muted-foreground">Válido por apenas 30 dias</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Plano Premium</CardTitle>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-5xl font-extrabold">R$19,90</span>
                <span className="ml-1 text-xl text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Acesso a todas as funcionalidades</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Planilhas mensais ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Relatórios detalhados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <div className="mt-6">
                <div className="flex justify-center">
                  <stripe-buy-button
                    buy-button-id="buy_btn_1R4l6RPsuje4gYSachMBz7fR"
                    publishable-key="pk_test_51R4kYgPsuje4gYSaRp44xBoHQfAvHJ9Ph8kqyl9Sa1G6PmHrKkgmBvQn2kS2Ee45QTWBf7cw3cwLza8w6zHhH29G00ka3slnJF"
                  ></stripe-buy-button>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">Cancele a qualquer momento</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

