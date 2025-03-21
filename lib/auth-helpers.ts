import jwt from "jsonwebtoken"

// Chave secreta para JWT (em produção, use variáveis de ambiente)
const JWT_SECRET = "seu_segredo_jwt_super_secreto"

// Função para extrair o ID do usuário do token JWT
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    return decoded.userId
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return null
  }
}

