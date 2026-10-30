
const { getWarningLight } = require("../data/warningLights");

function formatPredictions(roboflowResponse) {
  const predictions = roboflowResponse?.predictions;

  if (!Array.isArray(predictions)) {
    throw new Error("Invalid prediction response from Roboflow.");
  }

  const formattedPredictions = predictions.map((prediction) => {
    const warningLight = getWarningLight(prediction.class);

    // Keep unknown classes visible without inventing explanations.
    if (!warningLight) {
      return {
        detectedLabel: prediction.class || "Unknown warning light",
        confidence: prediction.confidence ?? null,
        explanationAvailable: false,
        message:
          "We detected a possible dashboard symbol, but its meaning has not yet been verified. Check your vehicle manual or consult a qualified mechanic."
      };
    }

    return {
      detectedLabel: prediction.class,
      title: warningLight.title,
      meaning: warningLight.meaning,
      possibleCauses: warningLight.possibleCauses,
      recommendedAction: warningLight.action,
      urgency: warningLight.urgency,
      safetyAdvice: warningLight.safetyAdvice,
      confidence: prediction.confidence ?? null,
      explanationAvailable: true
    };
  });

  return {
    success: true,
    message:
      formattedPredictions.length > 0
        ? "Dashboard image analysed successfully."
        : "No warning lights were detected. If a warning is visible, try taking a clearer photo.",
    totalDetections: formattedPredictions.length,
    detections: formattedPredictions
  };
}

module.exports = { formatPredictions };
