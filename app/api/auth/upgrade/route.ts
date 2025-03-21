import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromRequest } from "@/lib/auth-helpers"

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Atualizar o usuário para premium
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        userType: "premium",
      },
    })

    return NextResponse.json({
      message: "Usuário atualizado para premium com sucesso",
      userType: user.userType,
    })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

