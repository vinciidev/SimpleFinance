import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth-helpers"

// Obter todas as tabelas do usuário
export async function GET(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const tables = await prisma.table.findMany({
      where: { userId },
      include: { transactions: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tables)
  } catch (error) {
    console.error("Erro ao buscar tabelas:", error)
    return NextResponse.json({ error: "Erro ao buscar tabelas" }, { status: 500 })
  }
}

// Criar uma nova tabela
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name } = await request.json()

    const table = await prisma.table.create({
      data: {
        name,
        userId,
      },
    })

    return NextResponse.json(table, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar tabela:", error)
    return NextResponse.json({ error: "Erro ao criar tabela" }, { status: 500 })
  }
}

