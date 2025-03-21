"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode, useEffect } from "react"

export type TransactionType = "Ganhos" | "Gastos" | "Investimento"

export type TransactionCategory =
  | "Salario"
  | "Freelancing"
  | "Outros" // Ganhos
  | "Moradia"
  | "Alimentação"
  | "Saude"
  | "Lazer"
  | "Transporte"
  | "Outros" // Gastos
  | "Bolsa de valores"
  | "Fundos Imobiliarios"
  | "Cursos"
  | "Criptomoedas"
  | "Empresas" // Investimentos

export type PaymentMethod =
  | "Dinheiro"
  | "Cartão de Crédito"
  | "Cartão de Débito"
  | "Pix"
  | "Transferência Bancária"
  | "Boleto"
  | "Outro"

export interface Transaction {
  id: string
  name: string
  type: TransactionType
  category: TransactionCategory
  paymentMethod: PaymentMethod
  date: string
  amount: number
  tableId: string
}

export interface Table {
  id: string
  name: string
  createdAt: string
  transactions: Transaction[]
}

interface TransactionContextType {
  tables: Table[]
  currentTable: Table | null
  transactions: Transaction[]
  allTransactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "tableId">) => Promise<void>
  deleteTransaction: (transactionId: string) => Promise<void>
  editTransaction: (transactionId: string, transaction: Omit<Transaction, "id" | "tableId">) => Promise<void>
  addTable: (name: string) => Promise<void>
  switchTable: (tableId: string) => void
  totals: { earnings: number; expenses: number; investments: number }
  overallTotals: { earnings: number; expenses: number; investments: number }
  getFilteredTransactions: (filters: TransactionFilters) => Transaction[]
  isLoading: boolean
  error: string | null
}

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  type?: TransactionType | "all"
  paymentMethod?: PaymentMethod | "all"
  category?: TransactionCategory | "all"
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([])
  const [currentTableId, setCurrentTableId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar tabelas e transações do banco de dados
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const token = localStorage.getItem("auth_token")
        if (!token) {
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/tables", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar tabelas")
        }

        const data = await response.json()

        // Formatar as datas para o formato esperado pela aplicação
        const formattedTables = data.map((table: any) => ({
          ...table,
          createdAt: new Date(table.createdAt).toISOString(),
          transactions: table.transactions.map((transaction: any) => ({
            ...transaction,
            date: new Date(transaction.date).toISOString().split("T")[0],
          })),
        }))

        setTables(formattedTables)

        // Verificar se há um ID de tabela selecionado no localStorage
        const selectedTableId = localStorage.getItem("selected_table_id")

        // Definir a tabela atual com base no localStorage ou usar a primeira tabela
        if (selectedTableId && formattedTables.some((table) => table.id === selectedTableId)) {
          setCurrentTableId(selectedTableId)
        } else if (formattedTables.length > 0 && !currentTableId) {
          setCurrentTableId(formattedTables[0].id)
        }
      } catch (err) {
        console.error("Erro ao carregar tabelas:", err)
        setError("Falha ao carregar dados. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTables()
  }, [])

  const currentTable = tables.find((t) => t.id === currentTableId) || tables[0] || null
  const transactions = currentTable?.transactions || []

  // Todas as transações de todas as tabelas
  const allTransactions = tables.flatMap((table) => table.transactions)

  const addTransaction = async (newTransaction: Omit<Transaction, "id" | "tableId">) => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token || !currentTableId) {
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTransaction,
          tableId: currentTableId,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao adicionar transação")
      }

      const data = await response.json()

      // Atualizar o estado local
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (table.id === currentTableId) {
            return {
              ...table,
              transactions: [
                ...table.transactions,
                {
                  ...data,
                  date: new Date(data.date).toISOString().split("T")[0],
                },
              ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            }
          }
          return table
        }),
      )
    } catch (err) {
      console.error("Erro ao adicionar transação:", err)
      setError("Falha ao adicionar transação. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTransaction = async (transactionId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir transação")
      }

      // Atualizar o estado local
      setTables((prevTables) =>
        prevTables.map((table) => ({
          ...table,
          transactions: table.transactions.filter((t) => t.id !== transactionId),
        })),
      )
    } catch (err) {
      console.error("Erro ao excluir transação:", err)
      setError("Falha ao excluir transação. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const editTransaction = async (transactionId: string, updatedTransaction: Omit<Transaction, "id" | "tableId">) => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransaction),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar transação")
      }

      const data = await response.json()

      // Atualizar o estado local
      setTables((prevTables) =>
        prevTables.map((table) => ({
          ...table,
          transactions: table.transactions
            .map((t) =>
              t.id === transactionId
                ? {
                    ...data,
                    date: new Date(data.date).toISOString().split("T")[0],
                    tableId: t.tableId,
                  }
                : t,
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        })),
      )
    } catch (err) {
      console.error("Erro ao atualizar transação:", err)
      setError("Falha ao atualizar transação. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const addTable = async (name: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error("Falha ao adicionar tabela")
      }

      const data = await response.json()

      // Formatar a data para o formato esperado pela aplicação
      const newTable = {
        ...data,
        createdAt: new Date(data.createdAt).toISOString(),
        transactions: [],
      }

      // Atualizar o estado local
      setTables((prev) => [...prev, newTable])
      setCurrentTableId(newTable.id)
    } catch (err) {
      console.error("Erro ao adicionar tabela:", err)
      setError("Falha ao adicionar tabela. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const switchTable = (tableId: string) => {
    localStorage.setItem("selected_table_id", tableId)
    setCurrentTableId(tableId)
  }

  const calculateTotals = (transactionList: Transaction[]) => {
    return transactionList.reduce(
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
  }

  const totals = calculateTotals(transactions)
  const overallTotals = calculateTotals(allTransactions)

  const getFilteredTransactions = (filters: TransactionFilters) => {
    return allTransactions
      .filter((transaction) => {
        // Filtro por data
        if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
          return false
        }
        if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
          return false
        }

        // Filtro por tipo
        if (filters.type && filters.type !== "all" && transaction.type !== filters.type) {
          return false
        }

        // Filtro por método de pagamento
        if (
          filters.paymentMethod &&
          filters.paymentMethod !== "all" &&
          transaction.paymentMethod !== filters.paymentMethod
        ) {
          return false
        }

        // Filtro por categoria
        if (filters.category && filters.category !== "all" && transaction.category !== filters.category) {
          return false
        }

        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <TransactionContext.Provider
      value={{
        tables,
        currentTable,
        transactions,
        allTransactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        addTable,
        switchTable,
        totals,
        overallTotals,
        getFilteredTransactions,
        isLoading,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

