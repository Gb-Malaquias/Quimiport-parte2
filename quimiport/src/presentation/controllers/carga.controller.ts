
import type { Request, Response, NextFunction } from "express";
import { cargaService } from "../../application/services/carga.service.js";
import {
  criarCargaSchema,
  atualizarStatusCargaSchema,
  atualizarDocumentacaoSchema,
} from "../../application/validators/carga.schema.js";

class CargaController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const cargas = await cargaService.listar();
      return res.status(200).json(cargas);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          mensagem: "O ID da carga é obrigatório.",
        });
      }

      const carga = await cargaService.buscarPorId(id);
      return res.status(200).json(carga);
    } catch (error) {
      return next(error);
    }
  }

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const validacao = criarCargaSchema.safeParse(req.body);

      if (!validacao.success) {
        return res.status(400).json({
          mensagem: "Dados inválidos.",
          erros: validacao.error.issues.map((erro) => ({
            campo: erro.path.join("."),
            mensagem: erro.message,
          })),
        });
      }

      const carga = await cargaService.criar(validacao.data);
      return res.status(201).json(carga);
    } catch (error) {
      return next(error);
    }
  }

  async atualizarStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          mensagem: "O ID da carga é obrigatório.",
        });
      }

      const validacao = atualizarStatusCargaSchema.safeParse(req.body);

      if (!validacao.success) {
        return res.status(400).json({
          mensagem: "Dados inválidos.",
          erros: validacao.error.issues.map((erro) => ({
            campo: erro.path.join("."),
            mensagem: erro.message,
          })),
        });
      }

      const carga = await cargaService.atualizarStatus(
        id,
        validacao.data.status,
      );

      return res.status(200).json(carga);
    } catch (error) {
      return next(error);
    }
  }

  async bloquear(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          mensagem: "O ID da carga é obrigatório.",
        });
      }

      const carga = await cargaService.bloquear(id);
      return res.status(200).json(carga);
    } catch (error) {
      return next(error);
    }
  }

  async liberar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          mensagem: "O ID da carga é obrigatório.",
        });
      }

      const carga = await cargaService.liberar(id);
      return res.status(200).json(carga);
    } catch (error) {
      return next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          mensagem: "O ID da carga é obrigatório.",
        });
      }

      const carga = await cargaService.cancelar(id);
      return res.status(200).json(carga);
    } catch (error) {
      return next(error);
    }
  }

  async atualizarDocumentacao(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          mensagem: "O ID da carga é obrigatório.",
        });
      }

      const validacao = atualizarDocumentacaoSchema.safeParse(req.body);

      if (!validacao.success) {
        return res.status(400).json({
          mensagem: "Dados inválidos.",
          erros: validacao.error.issues.map((erro) => ({
            campo: erro.path.join("."),
            mensagem: erro.message,
          })),
        });
      }

      const carga = await cargaService.atualizarDocumentacao(
        id,
        validacao.data.temDocumentacao,
      );

      return res.status(200).json(carga);
    } catch (error) {
      return next(error);
    }
  }
}

export const cargaController = new CargaController();
