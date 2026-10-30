
import type { Request, Response, NextFunction } from "express";
import { produtoService } from "../../application/services/produto.service.js";
import {
  criarProdutoSchema,
  atualizarProdutoSchema,
} from "../../application/validators/produto.schema.js";


function parseProdutoId(value: unknown): number | null {
  // Aceita somente uma string contendo um inteiro positivo.
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  // Evita números inteiros fora do limite seguro do JavaScript.
  if (!Number.isSafeInteger(id)) {
    return null;
  }

  return id;
}


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

      const id = parseProdutoId(req.params.id);
      if (id === null) {
        return res.status(400).json({
          mensagem: "O ID deve ser um número inteiro positivo.",
        });
      }

      const produto = await produtoService.buscarPorId(id);
      return res.status(200).json(produto);
    } 
    
    catch (error) {
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

      const id = parseProdutoId(req.params.id);
        if (id === null) {
          return res.status(400).json({
            mensagem: "O ID deve ser um número inteiro positivo.",
          });
        }
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
        id,
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
      const id = parseProdutoId(req.params.id);
      if (id === null) {
        return res.status(400).json({
          mensagem: "O ID deve ser um número inteiro positivo.",
        });
      }
      const produto = await produtoService.inativar(id);
      return res.status(200).json(produto);
    } catch (error) {
      return next(error);
    }
  }
}

export const produtoController = new ProdutoController();
