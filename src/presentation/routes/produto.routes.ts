
import { Router } from "express";
import { produtoController } from "../controllers/produto.controller.js";

const router = Router();

/**
 * @openapi
 * /produtos:
 *   get:
 *     tags:
 *       - Produtos Químicos
 *     summary: Listar produtos químicos
 *     description: Retorna a lista de produtos químicos cadastrados.
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/", (req, res, next) =>
  produtoController.listar(req, res, next),
);

/**
 * @openapi
 * /produtos/{id}:
 *   get:
 *     tags:
 *       - Produtos Químicos
 *     summary: Buscar produto por ID
 *     description: Retorna os dados de um produto químico específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador do produto químico.
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get("/:id", (req, res, next) =>
  produtoController.buscarPorId(req, res, next),
);

/**
 * @openapi
 * /produtos:
 *   post:
 *     tags:
 *       - Produtos Químicos
 *     summary: Cadastrar produto químico
 *     description: Realiza o cadastro de um novo produto químico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Dados do produto conforme o schema de validação da aplicação.
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post("/", (req, res, next) =>
  produtoController.criar(req, res, next),
);

/**
 * @openapi
 * /produtos/{id}:
 *   patch:
 *     tags:
 *       - Produtos Químicos
 *     summary: Atualizar produto químico
 *     description: Atualiza informações de um produto químico existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador do produto químico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos que podem ser atualizados conforme o schema da aplicação.
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch("/:id", (req, res, next) =>
  produtoController.atualizar(req, res, next),
);

/**
 * @openapi
 * /produtos/{id}/inativar:
 *   patch:
 *     tags:
 *       - Produtos Químicos
 *     summary: Inativar produto químico
 *     description: Altera o status do produto químico para inativo.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador do produto químico.
 *     responses:
 *       200:
 *         description: Produto inativado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch("/:id/inativar", (req, res, next) =>
  produtoController.inativar(req, res, next),
);

export default router;
