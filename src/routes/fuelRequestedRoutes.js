import express from "express";

import { createFuelRequest,getMyFuelRequests, getFuelRequestById, cancelFuelRequest,} from "../controllers/fuelRequestController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/", authMiddleware, createFuelRequest);


router.get("/my", authMiddleware, getMyFuelRequests);



router.get( "/:id", authMiddleware, getFuelRequestById);



router.patch("/:id/cancel", authMiddleware, cancelFuelRequest);


export default router;