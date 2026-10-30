
import { Router } from "express";
import { cargaController } from "../controllers/carga.controller.js";

const router = Router();

/**
 * @openapi
 * /cargas:
 *   get:
 *     tags:
 *       - Cargas Químicas
 *     summary: Listar cargas químicas
 *     description: Retorna todas as cargas químicas cadastradas no sistema.
 *     responses:
 *       200:
 *         description: Lista de cargas retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", (req, res, next) =>
  cargaController.listar(req, res, next),
);

/**
 * @openapi
 * /cargas/{id}:
 *   get:
 *     tags:
 *       - Cargas Químicas
 *     summary: Buscar carga por ID
 *     description: Retorna os dados de uma carga química específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da carga química
 *     responses:
 *       200:
 *         description: Carga encontrada
 *       404:
 *         description: Carga não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", (req, res, next) =>
  cargaController.buscarPorId(req, res, next),
);

/**
 * @openapi
 * /cargas:
 *   post:
 *     tags:
 *       - Cargas Químicas
 *     summary: Registrar carga química
 *     description: Registra uma nova carga química no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produtoQuimicoId
 *               - quantidade
 *               - unidadeMedida
 *               - origem
 *               - destino
 *               - responsavelTecnico
 *             properties:
 *               produtoQuimicoId:
 *                 type: string
 *                 example: "123"
 *               quantidade:
 *                 type: number
 *                 example: 500
 *               unidadeMedida:
 *                 type: string
 *                 example: KG
 *               origem:
 *                 type: string
 *                 example: Porto de Santos
 *               destino:
 *                 type: string
 *                 example: Terminal de armazenamento
 *               responsavelTecnico:
 *                 type: string
 *                 example: João da Silva
 *     responses:
 *       201:
 *         description: Carga registrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto químico não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", (req, res, next) =>
  cargaController.criar(req, res, next),
);

/**
 * @openapi
 * /cargas/{id}/status:
 *   patch:
 *     tags:
 *       - Cargas Químicas
 *     summary: Atualizar status da carga
 *     description: Atualiza o status de uma carga química conforme as regras de negócio.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da carga
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: EM_ANALISE
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Transição de status inválida
 *       404:
 *         description: Carga não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/status", (req, res, next) =>
  cargaController.atualizarStatus(req, res, next),
);

/**
 * @openapi
 * /cargas/{id}/bloquear:
 *   patch:
 *     tags:
 *       - Cargas Químicas
 *     summary: Bloquear carga química
 *     description: Bloqueia uma carga química para impedir sua movimentação.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da carga
 *     responses:
 *       200:
 *         description: Carga bloqueada com sucesso
 *       400:
 *         description: Não foi possível bloquear a carga
 *       404:
 *         description: Carga não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/bloquear", (req, res, next) =>
  cargaController.bloquear(req, res, next),
);

/**
 * @openapi
 * /cargas/{id}/liberar:
 *   patch:
 *     tags:
 *       - Cargas Químicas
 *     summary: Liberar carga química
 *     description: Libera uma carga química após a verificação dos requisitos necessários, incluindo a documentação.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da carga
 *     responses:
 *       200:
 *         description: Carga liberada com sucesso
 *       400:
 *         description: Carga não pode ser liberada ou documentação pendente
 *       404:
 *         description: Carga não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/liberar", (req, res, next) =>
  cargaController.liberar(req, res, next),
);

/**
 * @openapi
 * /cargas/{id}/cancelar:
 *   patch:
 *     tags:
 *       - Cargas Químicas
 *     summary: Cancelar carga química
 *     description: Cancela uma carga química conforme as regras de negócio.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da carga
 *     responses:
 *       200:
 *         description: Carga cancelada com sucesso
 *       400:
 *         description: Não foi possível cancelar a carga
 *       404:
 *         description: Carga não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/cancelar", (req, res, next) =>
  cargaController.cancelar(req, res, next),
);

/**
 * @openapi
 * /cargas/{id}/documentacao:
 *   patch:
 *     tags:
 *       - Cargas Químicas
 *     summary: Atualizar documentação da carga
 *     description: Registra ou atualiza as informações de documentação obrigatória de uma carga química.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da carga
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               documentacaoObrigatoria: true
 *     responses:
 *       200:
 *         description: Documentação atualizada com sucesso
 *       400:
 *         description: Dados de documentação inválidos
 *       404:
 *         description: Carga não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/documentacao", (req, res, next) =>
  cargaController.atualizarDocumentacao(req, res, next),
);

export default router;
