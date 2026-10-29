
const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { formatPredictions } = require("../services/responseFormatter");
const { detectWarningLights } = require("../services/roboflowService");

const router = express.Router();

router.post("/scan", (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a dashboard image."
      });
    }

    const roboflowResponse = await detectWarningLights(req.file.buffer);
    const formattedResponse = formatPredictions(roboflowResponse);

    return res.status(200).json(formattedResponse);

    return res.status(200).json({
      success: true,
      message: "Dashboard image analysed successfully.",
      predictions
    });
  } catch (error) {
    console.error("Dashboard scan failed:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to analyse the image right now. Please try again."
    });
  }
});

module.exports = router;
