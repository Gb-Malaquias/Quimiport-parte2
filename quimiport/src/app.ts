
import express from "express";
import healthRoutes from "./presentation/routes/health.routes.js";
import produtoRoutes from "./presentation/routes/produto.routes.js";
import { errorMiddleware } from "./presentation/middlewares/error.middleware.js";

const app = express();

app.use(express.json());


app.use("/", healthRoutes);
app.use("/produtos", produtoRoutes);

app.use(errorMiddleware);

export default app;
