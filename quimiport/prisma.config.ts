// Carrega as variáveis definidas no arquivo .env.
import "dotenv/config";

// Importa as ferramentas de configuração do Prisma.
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Localização do modelo de dados.
  schema: "prisma/schema.prisma",

  // Localização das migrations que serão criadas.
  migrations: {
    path: "prisma/migrations",
  },

  // URL usada pelo Prisma CLI para acessar o banco.
  datasource: {
    url: env("DATABASE_URL"),
  },
});