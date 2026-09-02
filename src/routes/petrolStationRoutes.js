import express from "express";

import { createPetrolStation, getPetrolStations, getPetrolStationById } from "../controllers/petrolStationController.js";

const router = express.Router();


router.post("/",createPetrolStation);


router.get("/",getPetrolStations);


router.get("/:id",getPetrolStationById);


export default router;