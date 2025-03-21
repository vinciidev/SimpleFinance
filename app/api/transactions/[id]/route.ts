import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth-helpers"

// Excluir uma transação
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se a transação pertence ao usuário
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        table: true,
      },
    })

    if (!transaction || transaction.table.userId !== userId) {
      return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 })
    }

    // Excluir a transação
    await prisma.transaction.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Transação excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir transação:", error)
    return NextResponse.json({ error: "Erro ao excluir transação" }, { status: 500 })
  }
}

// Atualizar uma transação
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, type, category, paymentMethod, date, amount } = await request.json()

    // Verificar se a transação pertence ao usuário
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        table: true,
      },
    })

    if (!transaction || transaction.table.userId !== userId) {
      return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 })
    }

    // Atualizar a transação
    const updatedTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        name,
        type,
        category,
        paymentMethod,
        date: new Date(date),
        amount: Number.parseFloat(amount),
      },
    })

    return NextResponse.json(updatedTransaction)
  } catch (error) {
    console.error("Erro ao atualizar transação:", error)
    return NextResponse.json({ error: "Erro ao atualizar transação" }, { status: 500 })
  }
}

