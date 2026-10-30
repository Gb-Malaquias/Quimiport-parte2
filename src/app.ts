
import express from "express";
import swaggerUi from "swagger-ui-express";

import healthRoutes from "./presentation/routes/health.routes.js";
import produtoRoutes from "./presentation/routes/produto.routes.js";
import cargaRoutes from "./presentation/routes/carga.routes.js";

import { errorMiddleware } from "./presentation/middlewares/error.middleware.js";
import swaggerSpec from "./presentation/docs/swagger.js";

const app = express();

// Middlewares
app.use(express.json());

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da aplicação
app.use("/", healthRoutes);
app.use("/produtos", produtoRoutes);
app.use("/cargas", cargaRoutes);

// Middleware de tratamento de erros (deve ficar por último)
app.use(errorMiddleware);

export default app;
