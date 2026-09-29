import express from "express";
import cors from "cors";

import fuelRequestRoutes from "./routes/fuelRequestedRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import petrolStationRoutes from "./routes/petrolStationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import mapsRoutes from "./routes/mapsRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use("/api/tracking", trackingRoutes);
app.use("/api/fuel-requests", fuelRequestRoutes);
app.use("/api/petrol-stations", petrolStationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maps", mapsRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MechanIQ backend is running!",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
