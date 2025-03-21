export interface DBUser {
  id: string
  email: string
  username: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

export interface DBTable {
  id: string
  user_id: string
  name: string
  created_at: Date
  updated_at: Date
}

export interface DBTransaction {
  id: string
  table_id: string
  name: string
  type: "Ganhos" | "Gastos" | "Investimento"
  date: Date
  amount: number
  created_at: Date
  updated_at: Date
}

