import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth-helpers"

// Obter todas as transações do usuário
export async function GET(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter todas as transações de todas as tabelas do usuário
    const transactions = await prisma.transaction.findMany({
      where: {
        table: {
          userId,
        },
      },
      include: {
        table: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Erro ao buscar transações:", error)
    return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 })
  }
}

// Criar uma nova transação
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, type, category, paymentMethod, date, amount, tableId } = await request.json()

    // Verificar se a tabela pertence ao usuário
    const table = await prisma.table.findUnique({
      where: {
        id: tableId,
        userId,
      },
    })

    if (!table) {
      return NextResponse.json({ error: "Tabela não encontrada" }, { status: 404 })
    }

    // Criar a transação
    const transaction = await prisma.transaction.create({
      data: {
        name,
        type,
        category,
        paymentMethod,
        date: new Date(date),
        amount: Number.parseFloat(amount),
        tableId,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 })
  }
}

