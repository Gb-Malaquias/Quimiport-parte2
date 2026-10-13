
import { Router } from "express";

const healthRoutes = Router();

//verificar está respondendo.
healthRoutes.get("/", (_req, res) => {
  res.status(200).json({
    message: "QuimiPort API funcionando!",
  });
});

export default healthRoutes;
