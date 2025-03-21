"use client"

import { useState, useEffect } from "react"
import {
  useTransactions,
  type TransactionType,
  type TransactionCategory,
  type PaymentMethod,
} from "@/contexts/TransactionContext"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

const categoryOptions: Record<TransactionType, TransactionCategory[]> = {
  Ganhos: ["Salario", "Freelancing", "Outros"],
  Gastos: ["Moradia", "Alimentação", "Saude", "Lazer", "Transporte", "Outros"],
  Investimento: ["Bolsa de valores", "Fundos Imobiliarios", "Cursos", "Criptomoedas", "Empresas"],
}

const paymentMethods: PaymentMethod[] = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Pix",
  "Transferência Bancária",
  "Boleto",
  "Outro",
]

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { addTransaction, isLoading, error } = useTransactions()
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    type: "Ganhos" as TransactionType,
    category: "" as TransactionCategory,
    paymentMethod: "Dinheiro" as PaymentMethod,
    date: "",
    amount: "",
  })

  useEffect(() => {
    if (newTransaction.type && categoryOptions[newTransaction.type].length > 0) {
      setNewTransaction((prev) => ({ ...prev, category: categoryOptions[newTransaction.type][0] }))
    }
  }, [newTransaction.type])

  const handleAddTransaction = async () => {
    if (!newTransaction.name || !newTransaction.date || !newTransaction.amount || !newTransaction.category) {
      return
    }

    await addTransaction({
      name: newTransaction.name,
      type: newTransaction.type,
      category: newTransaction.category,
      paymentMethod: newTransaction.paymentMethod,
      date: newTransaction.date,
      amount: Number.parseFloat(newTransaction.amount),
    })

    if (!error) {
      setNewTransaction({
        name: "",
        type: "Ganhos",
        category: "Salario",
        paymentMethod: "Dinheiro",
        date: "",
        amount: "",
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da transação</Label>
            <Input
              id="name"
              value={newTransaction.name}
              onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={newTransaction.type}
              onValueChange={(value: TransactionType) => setNewTransaction({ ...newTransaction, type: value })}
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
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={newTransaction.category}
              onValueChange={(value: TransactionCategory) => setNewTransaction({ ...newTransaction, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions[newTransaction.type].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select
              value={newTransaction.paymentMethod}
              onValueChange={(value: PaymentMethod) => setNewTransaction({ ...newTransaction, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAddTransaction} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              "Adicionar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

