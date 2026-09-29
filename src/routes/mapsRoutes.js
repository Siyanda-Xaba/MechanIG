import express from "express";
import { getNearbyStations, getRouteSummary } from "../controllers/mapsController.js";

const router = express.Router();
router.get("/nearby-stations", getNearbyStations);
router.post("/route-summary", getRouteSummary);
export default router;
