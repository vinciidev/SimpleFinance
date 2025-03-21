import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Limpar o banco de dados
  await prisma.transaction.deleteMany()
  await prisma.table.deleteMany()
  await prisma.user.deleteMany()

  // Criar um usuário de teste
  const hashedPassword = await bcrypt.hash("password", 10)
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      username: "Usuário Teste",
      password: hashedPassword,
    },
  })

  // Criar uma tabela para o usuário
  const table = await prisma.table.create({
    data: {
      name: "Janeiro 2023",
      userId: user.id,
    },
  })

  // Criar algumas transações de exemplo
  await prisma.transaction.createMany({
    data: [
      {
        name: "Salário",
        type: "Ganhos",
        category: "Salario",
        paymentMethod: "Transferência Bancária",
        date: new Date("2023-01-05"),
        amount: 5000,
        tableId: table.id,
      },
      {
        name: "Aluguel",
        type: "Gastos",
        category: "Moradia",
        paymentMethod: "Transferência Bancária",
        date: new Date("2023-01-10"),
        amount: 1500,
        tableId: table.id,
      },
      {
        name: "Supermercado",
        type: "Gastos",
        category: "Alimentação",
        paymentMethod: "Cartão de Crédito",
        date: new Date("2023-01-15"),
        amount: 600,
        tableId: table.id,
      },
      {
        name: "Investimento em ações",
        type: "Investimento",
        category: "Bolsa de valores",
        paymentMethod: "Transferência Bancária",
        date: new Date("2023-01-20"),
        amount: 1000,
        tableId: table.id,
      },
    ],
  })

  // Criar uma segunda tabela para o usuário
  const table2 = await prisma.table.create({
    data: {
      name: "Fevereiro 2023",
      userId: user.id,
    },
  })

  // Criar algumas transações de exemplo para a segunda tabela
  await prisma.transaction.createMany({
    data: [
      {
        name: "Salário",
        type: "Ganhos",
        category: "Salario",
        paymentMethod: "Transferência Bancária",
        date: new Date("2023-02-05"),
        amount: 5000,
        tableId: table2.id,
      },
      {
        name: "Aluguel",
        type: "Gastos",
        category: "Moradia",
        paymentMethod: "Transferência Bancária",
        date: new Date("2023-02-10"),
        amount: 1500,
        tableId: table2.id,
      },
      {
        name: "Restaurante",
        type: "Gastos",
        category: "Alimentação",
        paymentMethod: "Cartão de Crédito",
        date: new Date("2023-02-18"),
        amount: 200,
        tableId: table2.id,
      },
    ],
  })

  console.log("Banco de dados inicializado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

