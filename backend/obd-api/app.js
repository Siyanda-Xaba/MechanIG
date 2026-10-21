import cors from "cors";
import express from "express";
import obdRoutes from "./routes/obdRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";
import { requestId } from "./middlewares/requestIdMiddleware.js";

const app = express();
const development = process.env.NODE_ENV !== "production";
const storageMode = process.env.OBD_STORAGE || (development ? "local" : "firebase");
const authMode = process.env.OBD_AUTH_MODE || (development ? "development" : "firebase");
const allowedOrigins = (process.env.OBD_CORS_ORIGINS || (development ? "*" : ""))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedHeaders = ["Authorization", "Content-Type", "X-Request-Id"];
const requestCounts = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const address = req.ip || req.socket.remoteAddress || "unknown";
  let window = requestCounts.get(address);
  if (!window && requestCounts.size >= 5000) {
    for (const [key, value] of requestCounts) {
      if (now - value.startedAt >= 60_000) requestCounts.delete(key);
    }
    if (requestCounts.size >= 5000) {
      return res.status(429).json({ error: "RATE_LIMITED", message: "Too many requests. Please wait and try again.", requestId: req.requestId });
    }
    window = requestCounts.get(address);
  }
  if (!window || now - window.startedAt >= 60_000) {
    requestCounts.set(address, { startedAt: now, count: 1 });
    return next();
  }
  window.count += 1;
  if (requestCounts.size > 5000) {
    for (const [key, value] of requestCounts) {
      if (now - value.startedAt >= 60_000) requestCounts.delete(key);
    }
  }
  if (window.count > 120) {
    return res.status(429).json({ error: "RATE_LIMITED", message: "Too many requests. Please wait and try again.", requestId: req.requestId });
  }
  return next();
}

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders,
  maxAge: 600,
}));
app.use(express.json({ limit: "100kb", strict: true }));
app.use(requestId);
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Cache-Control", "no-store");
  return next();
});
app.use(rateLimit);
app.get(["/", "/health/live"], (req, res) => res.json({
    message: "MechanIQ diagnostics API is running",
    version: "v1",
    requestId: req.requestId,
    status: "ok",
  }));
app.get("/health/ready", (req, res) => {
  const modesAreValid = ["local", "firebase"].includes(storageMode)
    && ["development", "firebase"].includes(authMode);
  const productionIsSafe = development || (storageMode === "firebase" && authMode === "firebase");
  const ready = modesAreValid && productionIsSafe;
  return res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "misconfigured",
    storage: storageMode,
    authentication: authMode,
    requestId: req.requestId,
  });
});
app.use("/api/v1/diagnostics", obdRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
