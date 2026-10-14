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
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(requestId);
app.get("/", (req, res) =>
  res.json({
    message: "MechanIQ diagnostics API is running",
    version: "v1",
    requestId: req.requestId,
  }),
);
app.use("/api/v1/diagnostics", obdRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
