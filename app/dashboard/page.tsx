import { TransactionProvider } from "@/contexts/TransactionContext"
import OverviewDashboard from "@/components/OverviewDashboard"

export default function DashboardPage() {
  return (
    <TransactionProvider>
      <OverviewDashboard />
    </TransactionProvider>
  )
}

