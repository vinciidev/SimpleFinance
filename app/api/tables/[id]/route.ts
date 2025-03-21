import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth-helpers"

// Obter uma tabela específica
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const table = await prisma.table.findUnique({
      where: {
        id: params.id,
        userId,
      },
      include: { transactions: true },
    })

    if (!table) {
      return NextResponse.json({ error: "Tabela não encontrada" }, { status: 404 })
    }

    return NextResponse.json(table)
  } catch (error) {
    console.error("Erro ao buscar tabela:", error)
    return NextResponse.json({ error: "Erro ao buscar tabela" }, { status: 500 })
  }
}

// Excluir uma tabela
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se a tabela pertence ao usuário
    const table = await prisma.table.findUnique({
      where: {
        id: params.id,
        userId,
      },
    })

    if (!table) {
      return NextResponse.json({ error: "Tabela não encontrada" }, { status: 404 })
    }

    // Excluir a tabela
    await prisma.table.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Tabela excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir tabela:", error)
    return NextResponse.json({ error: "Erro ao excluir tabela" }, { status: 500 })
  }
}

