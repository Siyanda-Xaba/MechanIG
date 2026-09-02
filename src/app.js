import fuelRequestRoutes from "./routes/fuelRequestedRoutes.js";
const express = require("express");
const cors = require("cors");
const trackingRoutes = require("./routes/trackingRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/tracking", trackingRoutes);
app.use("/api/fuel-requests", fuelRequestRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "MechanIQ backend is running!"
    });
});

module.exports = app;
