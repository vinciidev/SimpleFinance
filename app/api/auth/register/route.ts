import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Calcular a data de expiração do teste (30 dias a partir de agora)
    const trialExpiresAt = new Date()
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 30)

    // Criar o usuário
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        userType: "free",
        trialExpiresAt: trialExpiresAt,
      },
    })

    return NextResponse.json({ message: "Usuário criado com sucesso" }, { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}

