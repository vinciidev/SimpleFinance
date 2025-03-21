"use client"

import { useState } from "react"
import { Trash2, CreditCard } from "lucide-react"
import { useTransactions } from "@/contexts/TransactionContext"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TransactionListProps {
  isExpanded: boolean
}

export default function TransactionList({ isExpanded }: TransactionListProps) {
  const { transactions, deleteTransaction } = useTransactions()
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleDelete = (transactionId: string) => {
    setTransactionToDelete(transactionId)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete)
      setTransactionToDelete(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {transactions.slice(0, isExpanded ? undefined : 4).map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center">
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
            <span className="text-muted-foreground">{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{transaction.paymentMethod}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-medium">{formatCurrency(transaction.amount)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              onClick={() => handleDelete(transaction.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir transação"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
      />
    </>
  )
}

