import { useTransactions } from "@/contexts/TransactionContext";
import { Card } from "@/components/ui/card";

export default function ExpenseChart() {
  const { totals } = useTransactions();

  const totalTransactions = totals.earnings + totals.expenses + totals.investments;
  const earningsPercentage = totalTransactions ? (totals.earnings / totalTransactions) * 100 : 0;
  const expensesPercentage = totalTransactions ? (totals.expenses / totalTransactions) * 100 : 0;
  const investmentsPercentage = totalTransactions ? (totals.investments / totalTransactions) * 100 : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value) => {
    return value.toFixed(1) + "%";
  };

  const circumference = 2 * Math.PI * 40;

  const earningsOffset = 0;
  const expensesOffset = earningsOffset + (circumference * earningsPercentage) / 100;
  const investmentsOffset = expensesOffset + (circumference * expensesPercentage) / 100;

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted opacity-20"
            />
            {earningsPercentage > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={earningsOffset}
                className="transition-all duration-300 ease-in-out"
              />
            )}
            {expensesPercentage > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={expensesOffset}
                className="transition-all duration-300 ease-in-out"
              />
            )}
            {investmentsPercentage > 0 && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={investmentsOffset}
                className="transition-all duration-300 ease-in-out"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold">{formatCurrency(totalTransactions)}</span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Ganhos</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium">{formatCurrency(totals.earnings)}</span>
              <span className="text-sm text-muted-foreground">({formatPercentage(earningsPercentage)})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Gastos</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium">{formatCurrency(totals.expenses)}</span>
              <span className="text-sm text-muted-foreground">({formatPercentage(expensesPercentage)})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Investimentos</span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium">{formatCurrency(totals.investments)}</span>
              <span className="text-sm text-muted-foreground">({formatPercentage(investmentsPercentage)})</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

