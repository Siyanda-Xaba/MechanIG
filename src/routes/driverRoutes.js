import express from "express";
import { createDriver, getDrivers, updateMyDriver } from "../controllers/driverController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getDrivers);
router.post("/", authMiddleware, createDriver);
router.patch("/me", authMiddleware, updateMyDriver);
export default router;
