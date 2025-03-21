"use client"

import { useTransactions } from "@/contexts/TransactionContext"
import { Card } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function CategoryChart() {
  const { transactions } = useTransactions()

  // Filtrar apenas gastos e investimentos
  const filteredTransactions = transactions.filter((t) => t.type === "Gastos" || t.type === "Investimento")

  // Agrupar por categoria
  const categoryTotals = filteredTransactions.reduce(
    (acc, transaction) => {
      if (!acc[transaction.type]) {
        acc[transaction.type] = {}
      }
      if (!acc[transaction.type][transaction.category]) {
        acc[transaction.type][transaction.category] = 0
      }
      acc[transaction.type][transaction.category] += transaction.amount
      return acc
    },
    {} as Record<string, Record<string, number>>,
  )

  // Obter categorias únicas
  const gastosCategories = Object.keys(categoryTotals["Gastos"] || {})
  const investimentoCategories = Object.keys(categoryTotals["Investimento"] || {})

  // Formatar valores para moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
        ticks: {
          callback: (value) => formatCurrency(Number(value)),
          font: {
            size: 11,
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
      },
    },
  }

  // Dados para o gráfico de Gastos
  const gastosData = {
    labels: gastosCategories,
    datasets: [
      {
        label: "Gastos",
        data: gastosCategories.map((category) => categoryTotals["Gastos"]?.[category] || 0),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Dados para o gráfico de Investimentos
  const investimentosData = {
    labels: investimentoCategories,
    datasets: [
      {
        label: "Investimentos",
        data: investimentoCategories.map((category) => categoryTotals["Investimento"]?.[category] || 0),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Gastos e Investimentos por Categoria</h3>

      <div className="grid gap-8 md:grid-cols-2">
        {gastosCategories.length > 0 && (
          <div className="h-[300px]">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Gastos</h4>
            <Bar options={options} data={gastosData} />
          </div>
        )}

        {investimentoCategories.length > 0 && (
          <div className="h-[300px]">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Investimentos</h4>
            <Bar options={options} data={investimentosData} />
          </div>
        )}
      </div>

      {gastosCategories.length === 0 && investimentoCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível. Adicione transações para visualizar o gráfico.
        </div>
      )}
    </Card>
  )
}

