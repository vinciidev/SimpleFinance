import { TransactionProvider } from "@/contexts/TransactionContext"
import TransactionsPage from "@/components/TransactionsPage"

export default function AllTransactionsPage() {
  return (
    <TransactionProvider>
      <TransactionsPage />
    </TransactionProvider>
  )
}

