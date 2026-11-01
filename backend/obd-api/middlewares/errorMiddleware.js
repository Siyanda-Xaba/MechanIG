export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({
      error: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} was not found.`,
      requestId: req.requestId,
    });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || error.statusCode || (error.type === "entity.parse.failed" ? 400 : 500);
  if (status >= 500) {
    console.error("Unhandled OBD API error", {
      name: error.name,
      code: error.code,
      requestId: req.requestId,
    });
  }
  res
    .status(status)
    .json({
      error: status === 400 ? "INVALID_REQUEST" : error.code || "INTERNAL_ERROR",
      message: status >= 500 && process.env.NODE_ENV === "production"
        ? "Unable to process the request."
        : error.message || "Unable to process the request.",
      requestId: req.requestId,
    });
}
