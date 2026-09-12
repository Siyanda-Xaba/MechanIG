import express from "express";
import cors from "cors";

import fuelRequestRoutes from "./routes/fuelRequestedRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import petrolStationRoutes from "./routes/petrolStationRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use("/api/tracking", trackingRoutes);
app.use("/api/fuel-requests", fuelRequestRoutes);
app.use("/api/petrol-stations", petrolStationRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MechanIQ backend is running!",
  });
});

export default app;