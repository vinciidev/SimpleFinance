import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

// Chave secreta para JWT (em produção, use variáveis de ambiente)
const JWT_SECRET = "seu_segredo_jwt_super_secreto"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar a senha
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    return NextResponse.json({
      token,
      userId: user.id,
      username: user.username,
      userType: user.userType,
      trialExpiresAt: user.trialExpiresAt,
    })
  } catch (error) {
    console.error("Erro ao autenticar:", error)
    return NextResponse.json({ error: "Erro ao autenticar" }, { status: 500 })
  }
}

