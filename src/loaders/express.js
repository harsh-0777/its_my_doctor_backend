import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import config from "../config/index.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

export const loadMiddlewares = (app) => {
  // Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: config.CLIENT_URL,
      credentials: true,
    }),
  );

  // Rate limiting
  app.use("/api", limiter);

  // Request logger
  if (config.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Body parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
};
