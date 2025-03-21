"use client"
import { CircleDollarSign, PiggyBank, Wallet, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTransactions } from "@/contexts/TransactionContext"
import Navigation from "@/components/Navigation"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function OverviewDashboard() {
  const { overallTotals, allTransactions } = useTransactions()

  const balance = overallTotals.earnings - overallTotals.expenses - overallTotals.investments

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Agrupar transações por mês
  const monthlyData = allTransactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = { earnings: 0, expenses: 0, investments: 0 }
      }

      switch (transaction.type) {
        case "Ganhos":
          acc[monthYear].earnings += transaction.amount
          break
        case "Gastos":
          acc[monthYear].expenses += transaction.amount
          break
        case "Investimento":
          acc[monthYear].investments += transaction.amount
          break
      }

      return acc
    },
    {} as Record<string, { earnings: number; expenses: number; investments: number }>,
  )

  // Ordenar os meses
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.split("/").map(Number)
    const [monthB, yearB] = b.split("/").map(Number)
    return yearA !== yearB ? yearA - yearB : monthA - monthB
  })

  // Dados para o gráfico de linha
  const lineChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Ganhos",
        data: sortedMonths.map((month) => monthlyData[month].earnings),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Gastos",
        data: sortedMonths.map((month) => monthlyData[month].expenses),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Investimentos",
        data: sortedMonths.map((month) => monthlyData[month].investments),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: false,
      },
    ],
  }

  // Dados para o gráfico de área (saldo acumulado)
  const balanceData = sortedMonths.reduce((acc, month, index) => {
    const monthData = monthlyData[month]
    const monthBalance = monthData.earnings - monthData.expenses - monthData.investments
    const previousBalance = index > 0 ? acc[index - 1] : 0
    acc.push(previousBalance + monthBalance)
    return acc
  }, [] as number[])

  const areaChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Saldo Acumulado",
        data: balanceData,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // Calcular estatísticas
  const avgMonthlyEarnings = sortedMonths.length > 0 ? overallTotals.earnings / sortedMonths.length : 0

  const avgMonthlyExpenses = sortedMonths.length > 0 ? overallTotals.expenses / sortedMonths.length : 0

  const savingsRate =
    overallTotals.earnings > 0 ? ((overallTotals.earnings - overallTotals.expenses) / overallTotals.earnings) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-6">
        <div className="grid gap-6">
          <Card className="p-6 relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <h3 className="text-3xl font-bold">{formatCurrency(balance)}</h3>
              </div>
              <div className="p-2 bg-gray-500/20 rounded-full">
                <Wallet className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ganhos Totais</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(overallTotals.earnings)}</h3>
                </div>
                <div className="p-2 bg-green-500/20 rounded-full">
                  <CircleDollarSign className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-500/20 to-red-500/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gastos Totais</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(overallTotals.expenses)}</h3>
                </div>
                <div className="p-2 bg-red-500/20 rounded-full">
                  <Zap className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/10">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investimentos Totais</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(overallTotals.investments)}</h3>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-full">
                  <PiggyBank className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
              <div className="h-[300px]">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => formatCurrency(Number(value)),
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Saldo Acumulado</h3>
              <div className="h-[300px]">
                <Line
                  data={areaChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => formatCurrency(Number(value)),
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Média Mensal de Ganhos</h3>
              <p className="text-2xl font-bold">{formatCurrency(avgMonthlyEarnings)}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Média Mensal de Gastos</h3>
              <p className="text-2xl font-bold">{formatCurrency(avgMonthlyExpenses)}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Taxa de Economia</h3>
              <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">(Ganhos - Gastos) / Ganhos</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

