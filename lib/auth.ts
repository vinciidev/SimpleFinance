"use client"

// Função para verificar se o usuário está autenticado
export function isAuthenticated() {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("auth_token")
  return !!token
}

// Função para autenticar o usuário
export async function authenticateUser(email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    localStorage.setItem("auth_token", data.token)
    localStorage.setItem("user_id", data.userId)
    localStorage.setItem("user_username", data.username)
    localStorage.setItem("user_type", data.userType)
    localStorage.setItem("trial_expires_at", new Date(data.trialExpiresAt).toISOString())
    return true
  } catch (error) {
    console.error("Erro ao autenticar:", error)
    return false
  }
}

// Função para criar um novo usuário
export async function createUser(email: string, password: string, username: string): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    })

    if (!response.ok) {
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return false
  }
}

// Função para pular a autenticação (apenas para desenvolvimento)
export async function bypassAuth(): Promise<void> {
  localStorage.setItem("auth_token", "dev_token")
  localStorage.setItem("user_id", "dev_user")
  localStorage.setItem("user_username", "Admin")
  localStorage.setItem("user_type", "free")

  // Definir data de expiração para 30 dias a partir de agora
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)
  localStorage.setItem("trial_expires_at", expiresAt.toISOString())
}

// Função para fazer logout
export function logout(): void {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("user_id")
  localStorage.removeItem("user_username")
  localStorage.removeItem("user_type")
  localStorage.removeItem("trial_expires_at")
  localStorage.removeItem("selected_table_id")
}

// Função para obter o ID do usuário atual
export function getCurrentUserId(): string | null {
  return localStorage.getItem("user_id")
}

// Função para verificar se o usuário é premium
export function isPremiumUser(): boolean {
  return localStorage.getItem("user_type") === "premium"
}

// Função para obter os dias restantes do período de teste
export function getTrialDaysRemaining(): number {
  const trialExpiresAt = localStorage.getItem("trial_expires_at")
  if (!trialExpiresAt) return 0

  const expiresAt = new Date(trialExpiresAt)
  const today = new Date()

  // Calcular a diferença em dias
  const diffTime = expiresAt.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

// Função para atualizar o usuário para premium
export async function upgradeToPremium(): Promise<boolean> {
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) return false

    const response = await fetch("/api/auth/upgrade", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return false

    const data = await response.json()
    localStorage.setItem("user_type", data.userType)
    return true
  } catch (error) {
    console.error("Erro ao atualizar para premium:", error)
    return false
  }
}

