
import type { Request, Response, NextFunction } from "express";
import { produtoService } from "../../application/services/produto.service.js";
import {
  criarProdutoSchema,
  atualizarProdutoSchema,
} from "../../application/validators/produto.schema.js";

class ProdutoController {
  async listar(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const produtos = await produtoService.listar();
      return res.status(200).json(produtos);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const produto = await produtoService.buscarPorId(String(req.params.id));
      return res.status(200).json(produto);
    } catch (error) {
      return next(error);
    }
  }

  async criar(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validacao = criarProdutoSchema.safeParse(req.body);

      if (!validacao.success) {
        return res.status(400).json({
          mensagem: "Dados inválidos.",
          erros: validacao.error.issues.map((erro) => ({
            campo: erro.path.join("."),
            mensagem: erro.message,
          })),
        });
      }

      const produto = await produtoService.criar(validacao.data);

      return res.status(201).json(produto);
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validacao = atualizarProdutoSchema.safeParse(req.body);

      if (!validacao.success) {
        return res.status(400).json({
          mensagem: "Dados inválidos.",
          erros: validacao.error.issues.map((erro) => ({
            campo: erro.path.join("."),
            mensagem: erro.message,
          })),
        });
      }

      const produto = await produtoService.atualizar(
        String(req.params.id),
        validacao.data,
      );

      return res.status(200).json(produto);
    } catch (error) {
      return next(error);
    }
  }

  async inativar(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const produto = await produtoService.inativar(String(req.params.id));
      return res.status(200).json(produto);
    } catch (error) {
      return next(error);
    }
  }
}

export const produtoController = new ProdutoController();
