
import { prisma } from "./prisma.js";

async function main(): Promise<void> {
  try {
    // Consulta simples para verificar a comunicação com o banco.
    await prisma.$queryRaw`SELECT 1`;

    console.log("Conexão com o PostgreSQL funcionando!");
  } catch (error) {
    console.error("Erro ao conectar ao PostgreSQL:", error);
    process.exitCode = 1;
  } finally {
    // Encerra as conexões abertas pelo Prisma.
    await prisma.$disconnect();
  }
}

main();
