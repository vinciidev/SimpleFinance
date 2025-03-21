import { TransactionProvider } from "@/contexts/TransactionContext"
import MonthlyControl from "@/components/MonthlyControl"

export default function MonthlyControlPage() {
  return (
    <TransactionProvider>
      <MonthlyControl />
    </TransactionProvider>
  )
}

