"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/contexts/TransactionContext"
import Navigation from "@/components/Navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MonthlyControl() {
  const { tables, switchTable, addTable, isLoading, error } = useTransactions()
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false)
  const [newTableName, setNewTableName] = useState("")
  const router = useRouter()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleCreateTable = async () => {
    if (newTableName.trim()) {
      await addTable(newTableName.trim())
      setNewTableName("")
      setIsNewTableDialogOpen(false)
    }
  }

  const handleSelectTable = (tableId: string) => {
    switchTable(tableId)
    // Armazenar o ID da tabela selecionada no localStorage para garantir que o redirecionamento seja para a tabela correta
    localStorage.setItem("selected_table_id", tableId)
    router.push("/dashboard/monthly/details")
  }

  // Calcular totais para cada tabela
  const tableTotals = tables.map((table) => {
    const totals = table.transactions.reduce(
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

    return {
      ...table,
      totals,
      balance: totals.earnings - totals.expenses - totals.investments,
    }
  })

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
          <h1 className="text-2xl font-bold">Controle Mensal</h1>
          <Button onClick={() => setIsNewTableDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Planilha
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tableTotals.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>Nenhuma planilha encontrada. Crie uma nova planilha para começar.</p>
              </div>
            ) : (
              tableTotals.map((table) => (
                <Card key={table.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{table.name}</CardTitle>
                    <CardDescription>Criado em {new Date(table.createdAt).toLocaleDateString("pt-BR")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Saldo</span>
                        <span className="font-medium">{formatCurrency(table.balance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Ganhos</span>
                        <span className="text-green-500">{formatCurrency(table.totals.earnings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Gastos</span>
                        <span className="text-red-500">{formatCurrency(table.totals.expenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Investimentos</span>
                        <span className="text-blue-500">{formatCurrency(table.totals.investments)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-2">
                    <Button variant="outline" className="w-full" onClick={() => handleSelectTable(table.id)}>
                      Acessar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={isNewTableDialogOpen} onOpenChange={setIsNewTableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Planilha</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da planilha</Label>
              <Input
                id="name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Ex: Março 2023"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNewTableDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTable}>Criar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

