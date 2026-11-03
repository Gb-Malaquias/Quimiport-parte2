
import type { ErrorRequestHandler } from "express";
import { AppError } from "../../application/errors/app-error.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  next,
) => {
  //  delega o erro ao Express.
  if (res.headersSent) {
    return next(error);
  }

  // Erros conhecidos.
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      mensagem: error.message,
    });
  }

  // Erros inesperados
  console.error("Erro interno da API:", error);

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor.",
  });
};
