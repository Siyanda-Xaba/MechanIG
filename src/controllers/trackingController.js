import trackingService from "../services/trackingService.js";

function sendError(res, error) {
  const status =
    error.message === "Tracking session was not found"
      ? 404
      : 400;

  return res.status(status).json({
    success: false,
    message: error.message,
  });
}

export const start = (req, res) => {
  try {
    const session = trackingService.start(req.body);

    return res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const get = (req, res) => {
  try {
    const session = trackingService.get(
      req.params.requestId
    );

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateLocation = (req, res) => {
  try {
    const session = trackingService.updateLocation(
      req.params.requestId,
      req.body.location
    );

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateStatus = (req, res) => {
  try {
    const session = trackingService.setStatus(
      req.params.requestId,
      req.body.status
    );

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    return sendError(res, error);
  }
};