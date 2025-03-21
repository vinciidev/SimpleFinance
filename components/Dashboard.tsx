"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CircleDollarSign, PiggyBank, Wallet, Zap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import TransactionList from "@/components/TransactionList"
import TransactionModal from "@/components/TransactionModal"
import { useTransactions } from "@/contexts/TransactionContext"
import ExpenseChart from "@/components/ExpenseChart"
import CategoryChart from "@/components/CategoryChart"
import Navigation from "@/components/Navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExtractExpanded, setIsExtractExpanded] = useState(false)
  const { totals, currentTable, isLoading, error } = useTransactions()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const upgraded = searchParams.get("upgraded")

  useEffect(() => {
    if (upgraded === "true") {
      toast({
        title: "Upgrade realizado com sucesso!",
        description: "Você agora tem acesso ao plano Premium.",
        variant: "default",
        duration: 5000,
      })
    }
  }, [upgraded, toast])

  const balance = totals.earnings - totals.expenses - totals.investments

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-48" /> : currentTable?.name || "Planilha"}
          </h1>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 relative">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-48" />
              </div>
            ) : (
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <h3 className="text-3xl font-bold">{formatCurrency(balance)}</h3>
                </div>
                <div className="p-2 bg-gray-500/20 rounded-full">
                  <Wallet className="w-8 h-8 text-gray-500" />
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-4 right-4"
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Transação
            </Button>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/10">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ) : (
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ganhos</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(totals.earnings)}</h3>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <CircleDollarSign className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-500/20 to-red-500/10">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ) : (
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gastos</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(totals.expenses)}</h3>
                  </div>
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <Zap className="w-5 h-5 text-red-500" />
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/10">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ) : (
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Investimentos</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(totals.investments)}</h3>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <PiggyBank className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Transações</h3>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setIsExtractExpanded(!isExtractExpanded)}
                  disabled={isLoading}
                >
                  {isExtractExpanded ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </Button>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <TransactionList isExpanded={isExtractExpanded} />
              )}
            </Card>
            <ExpenseChart />
          </div>

          <CategoryChart />
        </div>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

