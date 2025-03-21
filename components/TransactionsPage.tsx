"use client"

import { useState } from "react"
import {
  useTransactions,
  type TransactionType,
  type PaymentMethod,
  type TransactionCategory,
  type TransactionFilters,
  type Transaction,
} from "@/contexts/TransactionContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/Navigation"
import { CreditCard, Calendar, Filter, Trash2, Edit, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsPage() {
  const { getFilteredTransactions, deleteTransaction, editTransaction, isLoading, error } = useTransactions()
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: "",
    endDate: "",
    type: "all",
    paymentMethod: "all",
    category: "all",
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [editedTransaction, setEditedTransaction] = useState({
    name: "",
    type: "Ganhos" as TransactionType,
    category: "" as TransactionCategory,
    paymentMethod: "Dinheiro" as PaymentMethod,
    date: "",
    amount: "",
  })

  const transactions = getFilteredTransactions(filters)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      type: "all",
      paymentMethod: "all",
      category: "all",
    })
  }

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction)
    setEditedTransaction({
      name: transaction.name,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      date: transaction.date,
      amount: transaction.amount.toString(),
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (transactionId: string) => {
    setTransactionToDelete(transactionId)
  }

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteTransaction(transactionToDelete)
      setTransactionToDelete(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!transactionToEdit) return

    await editTransaction(transactionToEdit.id, {
      name: editedTransaction.name,
      type: editedTransaction.type,
      category: editedTransaction.category,
      paymentMethod: editedTransaction.paymentMethod,
      date: editedTransaction.date,
      amount: Number.parseFloat(editedTransaction.amount),
    })

    if (!error) {
      setIsEditModalOpen(false)
      setTransactionToEdit(null)
    }
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

  const transactionTypes: TransactionType[] = ["Ganhos", "Gastos", "Investimento"]

  const categories: TransactionCategory[] = [
    "Salario",
    "Freelancing",
    "Outros",
    "Moradia",
    "Alimentação",
    "Saude",
    "Lazer",
    "Transporte",
    "Outros",
    "Bolsa de valores",
    "Fundos Imobiliarios",
    "Cursos",
    "Criptomoedas",
    "Empresas",
  ]

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
          <h1 className="text-2xl font-bold">Todas as Transações</h1>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtrar Transações</SheetTitle>
                <SheetDescription>Defina os filtros para encontrar transações específicas</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={filters.type as string} onValueChange={(value) => handleFilterChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                  <Select
                    value={filters.paymentMethod as string}
                    onValueChange={(value) => handleFilterChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as formas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as formas</SelectItem>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={filters.category as string}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={resetFilters} variant="outline" className="mt-2">
                  Limpar Filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            transaction.type === "Ganhos"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : transaction.type === "Gastos"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(transaction.date).toLocaleDateString("pt-BR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          {transaction.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span
                          className={
                            transaction.type === "Ganhos"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Modal de edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome da transação</Label>
              <Input
                id="edit-name"
                value={editedTransaction.name}
                onChange={(e) => setEditedTransaction({ ...editedTransaction, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Tipo</Label>
              <Select
                value={editedTransaction.type}
                onValueChange={(value: TransactionType) => setEditedTransaction({ ...editedTransaction, type: value })}
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
              <Label htmlFor="edit-category">Categoria</Label>
              <Select
                value={editedTransaction.category}
                onValueChange={(value: TransactionCategory) =>
                  setEditedTransaction({ ...editedTransaction, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions[editedTransaction.type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-paymentMethod">Forma de Pagamento</Label>
              <Select
                value={editedTransaction.paymentMethod}
                onValueChange={(value: PaymentMethod) =>
                  setEditedTransaction({ ...editedTransaction, paymentMethod: value })
                }
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
              <Label htmlFor="edit-date">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={editedTransaction.date}
                onChange={(e) => setEditedTransaction({ ...editedTransaction, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Valor</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editedTransaction.amount}
                onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
      <ConfirmDialog
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
        title="Excluir transação"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
      />
    </div>
  )
}

