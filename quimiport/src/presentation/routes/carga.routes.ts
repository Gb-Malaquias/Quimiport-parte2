
import { Router } from "express";
import { cargaController } from "../controllers/carga.controller.js";

const router = Router();

router.get("/", (req, res, next) =>
  cargaController.listar(req, res, next),
);

router.get("/:id", (req, res, next) =>
  cargaController.buscarPorId(req, res, next),
);

router.post("/", (req, res, next) =>
  cargaController.criar(req, res, next),
);

router.patch("/:id/status", (req, res, next) =>
  cargaController.atualizarStatus(req, res, next),
);

router.patch("/:id/bloquear", (req, res, next) =>
  cargaController.bloquear(req, res, next),
);

router.patch("/:id/liberar", (req, res, next) =>
  cargaController.liberar(req, res, next),
);

router.patch("/:id/cancelar", (req, res, next) =>
  cargaController.cancelar(req, res, next),
);

// Endpoint para registrar recebimento da documentação.
router.patch("/:id/documentacao", (req, res, next) =>
  cargaController.atualizarDocumentacao(req, res, next),
);

export default router;
