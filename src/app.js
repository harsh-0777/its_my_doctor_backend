import express from "express";
import { loadMiddlewares } from "./loaders/index.js";
import { mountRoutes }    from "./router/index.js";
import { notFound, errorHandler } from "./middlewares/index.js";

const app = express();

loadMiddlewares(app);   // cors, helmet, rate-limit, morgan, body-parser
mountRoutes(app);       // all /api/v1/* routes

app.use(notFound);      // 404
app.use(errorHandler);  // global error handler

export default app;
