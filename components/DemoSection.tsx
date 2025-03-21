"use client"

import { useState } from "react"
import { CircleDollarSign, PiggyBank, Wallet, Zap, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de demonstração
const demoData = {
  balance: 3500,
  earnings: 5000,
  expenses: 1200,
  investments: 300,
  transactions: [
    { id: "1", name: "Salário", type: "Ganhos", date: "2023-05-05", amount: 5000 },
    { id: "2", name: "Aluguel", type: "Gastos", date: "2023-05-10", amount: 800 },
    { id: "3", name: "Supermercado", type: "Gastos", date: "2023-05-15", amount: 400 },
    { id: "4", name: "Investimento", type: "Investimento", date: "2023-05-20", amount: 300 },
  ],
}

export default function DemoSection() {
  const [isExtractExpanded, setIsExtractExpanded] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Calcular percentagens para o gráfico donut
  const totalTransactions = demoData.earnings + demoData.expenses + demoData.investments
  const earningsPercentage = totalTransactions ? (demoData.earnings / totalTransactions) * 100 : 0
  const expensesPercentage = totalTransactions ? (demoData.expenses / totalTransactions) * 100 : 0
  const investmentsPercentage = totalTransactions ? (demoData.investments / totalTransactions) * 100 : 0

  const formatPercentage = (value: number) => {
    return value.toFixed(1) + "%"
  }

  const circumference = 2 * Math.PI * 40

  const earningsOffset = 0
  const expensesOffset = earningsOffset + (circumference * earningsPercentage) / 100
  const investmentsOffset = expensesOffset + (circumference * expensesPercentage) / 100

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid gap-6">
            <Card className="p-6 relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <h3 className="text-3xl font-bold">{formatCurrency(demoData.balance)}</h3>
                </div>
                <div className="p-2 bg-gray-500/20 rounded-full">
                  <Wallet className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="absolute bottom-4 right-4" disabled>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Transação
              </Button>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/10">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ganhos</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(demoData.earnings)}</h3>
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <CircleDollarSign className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-500/20 to-red-500/10">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gastos</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(demoData.expenses)}</h3>
                  </div>
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <Zap className="w-5 h-5 text-red-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Investimentos</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(demoData.investments)}</h3>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <PiggyBank className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
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
                  >
                    {isExtractExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-4">
                  {demoData.transactions.slice(0, isExtractExpanded ? undefined : 3).map((transaction) => (
                    <div key={transaction.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.type === "Ganhos"
                              ? "bg-green-500"
                              : transaction.type === "Gastos"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <span>{transaction.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" disabled>
                    Versão de demonstração
                  </Button>
                </div>
              </Card>

              {/* Gráfico Donut */}
              <Card className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted opacity-20"
                      />
                      {earningsPercentage > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={earningsOffset}
                          className="transition-all duration-300 ease-in-out"
                        />
                      )}
                      {expensesPercentage > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={expensesOffset}
                          className="transition-all duration-300 ease-in-out"
                        />
                      )}
                      {investmentsPercentage > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={investmentsOffset}
                          className="transition-all duration-300 ease-in-out"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-2xl font-bold">{formatCurrency(totalTransactions)}</span>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm">Ganhos</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium">{formatCurrency(demoData.earnings)}</span>
                        <span className="text-sm text-muted-foreground">({formatPercentage(earningsPercentage)})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm">Gastos</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium">{formatCurrency(demoData.expenses)}</span>
                        <span className="text-sm text-muted-foreground">({formatPercentage(expensesPercentage)})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm">Investimentos</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium">{formatCurrency(demoData.investments)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({formatPercentage(investmentsPercentage)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Todas as Transações</h3>
            <div className="space-y-4">
              {demoData.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-3 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.type === "Ganhos"
                          ? "bg-green-500"
                          : transaction.type === "Gastos"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <span>{transaction.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" disabled>
                Versão de demonstração
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

