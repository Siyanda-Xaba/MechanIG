import express from "express";

import * as trackingController from "../controllers/trackingController.js";

const router = express.Router();



router.post("/",trackingController.start);



router.get(
  "/:requestId",
  trackingController.get
);



router.patch("/:requestId/location", trackingController.updateLocation);



router.patch("/:requestId/status",trackingController.updateStatus);


export default router;