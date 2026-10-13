
import { Router } from "express";
import { produtoController } from "../controllers/produto.controller.js";

const router = Router();

router.get("/", (req, res, next) =>
  produtoController.listar(req, res, next),
);

router.get("/:id", (req, res, next) =>
  produtoController.buscarPorId(req, res, next),
);

router.post("/", (req, res, next) =>
  produtoController.criar(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  produtoController.atualizar(req, res, next),
);

router.patch("/:id/inativar", (req, res, next) =>
  produtoController.inativar(req, res, next),
);

export default router;
