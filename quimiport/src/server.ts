import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`QuimiPort API disponível em http://localhost:${PORT}`);
});

// Trata falhas inesperadas do servidor HTTP.
server.on("error", (error) => {
  console.error("Erro ao iniciar o servidor:", error);
  process.exitCode = 1;
});