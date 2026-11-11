
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import chatRoutes from "./routes/chat.routes.js";
import {
  errorHandler,
  notFound,
} from "./middleware/error-handler.js";

export const app = express();

// CORS

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Security
app.use(helmet());

// Body parser
app.use(express.json({ limit: "50kb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rate limiter
const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please slow down.",
  },
});

app.use("/api/chat", chatLimiter, chatRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;