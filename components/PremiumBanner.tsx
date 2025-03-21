"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getTrialDaysRemaining, isPremiumUser } from "@/lib/auth"
import { Crown } from "lucide-react"

export default function PremiumBanner() {
  const [daysRemaining, setDaysRemaining] = useState<number>(0)
  const [isPremium, setIsPremium] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    setDaysRemaining(getTrialDaysRemaining())
    setIsPremium(isPremiumUser())
  }, [])

  if (isPremium) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden md:block text-amber-500 font-medium">
        Faltam <span className="font-bold">{daysRemaining}</span> dias para acabar a demonstração
      </div>
      <Button
        size="sm"
        variant="outline"
        className="bg-amber-500 text-white hover:bg-amber-600 border-amber-500 hover:border-amber-600"
        onClick={() => router.push("/payment")}
      >
        <Crown className="mr-1 h-4 w-4" />
        <span className="hidden md:inline">Torne-se Premium</span>
        <span className="md:hidden">Premium</span>
      </Button>
    </div>
  )
}

