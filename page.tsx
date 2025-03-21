"use client"

import { useState, useEffect } from "react"
import { CircleDollarSign, PiggyBank, Wallet, Zap, Moon, Sun, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"

// Tipos para as transações
type TransactionType = "Ganhos" | "Gastos" | "Investimento"

interface Transaction {
  id: string
  name: string
  type: TransactionType
  date: string
  amount: number
}

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExtractExpanded, setIsExtractExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", name: "Trabalho", type: "Ganhos", date: "2023-01-05", amount: 5200 },
    { id: "2", name: "Freelancing", type: "Ganhos", date: "2023-01-07", amount: 2500 },
    { id: "3", name: "Pizza", type: "Gastos", date: "2023-01-09", amount: 139.9 },
    { id: "4", name: "Aluguel", type: "Gastos", date: "2023-01-10", amount: 2190 },
  ])

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    type: "Ganhos" as TransactionType,
    date: "",
    amount: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const totals = transactions.reduce(
    (acc, transaction) => {
      switch (transaction.type) {
        case "Ganhos":
          acc.earnings += transaction.amount
          break
        case "Gastos":
          acc.expenses += transaction.amount
          break
        case "Investimento":
          acc.investments += transaction.amount
          break
      }
      return acc
    },
    { earnings: 0, expenses: 0, investments: 0 },
  )

  const balance = totals.earnings - totals.expenses - totals.investments

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.date || !newTransaction.amount) {
      return
    }

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTransaction.name,
      type: newTransaction.type,
      date: newTransaction.date,
      amount: Number.parseFloat(newTransaction.amount),
    }

    setTransactions((prevTransactions) =>
      [...prevTransactions, transaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )
    setIsModalOpen(false)
    setNewTransaction({
      name: "",
      type: "Ganhos",
      date: "",
      amount: "",
    })
  }

  const totalTransactions = totals.earnings + totals.expenses + totals.investments
  const earningsPercentage = totalTransactions ? (totals.earnings / totalTransactions) * 100 : 0

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-6 h-6 text-primary" />
            <span className="font-semibold">Simple Finance</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm">Olá, Miguel da Silva!</p>
            <Select defaultValue="janeiro">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="janeiro">Janeiro</SelectItem>
                <SelectItem value="fevereiro">Fevereiro</SelectItem>
                <SelectItem value="marco">Março</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ganhos</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(totals.earnings)}</h3>
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
                  <h3 className="text-2xl font-bold">{formatCurrency(totals.expenses)}</h3>
                </div>
                <div className="p-2 bg-red-500/20 rounded-full">
                  <Zap className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(balance)}</h3>
                </div>
                <div className="p-2 bg-gray-500/20 rounded-full">
                  <Wallet className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investimentos</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(totals.investments)}</h3>
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                    + Adicionar
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setIsExtractExpanded(!isExtractExpanded)}
                  >
                    {isExtractExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, isExtractExpanded ? undefined : 4).map((transaction) => (
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
            </Card>

            <Card className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-muted stroke-current"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeDasharray="282.7433388230814"
                      strokeDashoffset={`${282.7433388230814 * (1 - earningsPercentage / 100)}`}
                      className="text-green-500 rotate-[-90deg] origin-[50%_50%]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm text-muted-foreground">Gastos</span>
                    <span className="text-2xl font-bold">{formatCurrency(totals.expenses)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Ganhos</span>
                  <span className="text-sm ml-auto">{Math.round(earningsPercentage)}%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Transação</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da transação</Label>
              <Input
                id="name"
                value={newTransaction.name}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value) =>
                  setNewTransaction({
                    ...newTransaction,
                    type: value as TransactionType,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganhos">Ganhos</SelectItem>
                  <SelectItem value="Gastos">Gastos</SelectItem>
                  <SelectItem value="Investimento">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newTransaction.date}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddTransaction}>Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

