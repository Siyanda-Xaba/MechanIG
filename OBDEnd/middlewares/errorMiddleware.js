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
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res
    .status(status)
    .json({
      error: error.code || "INTERNAL_ERROR",
      message: error.message || "Unable to process the request.",
      requestId: req.requestId,
    });
}
