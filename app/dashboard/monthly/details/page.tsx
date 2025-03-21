import { TransactionProvider } from "@/contexts/TransactionContext"
import Dashboard from "@/components/Dashboard"

export default function MonthlyDetailsPage() {
  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  )
}

