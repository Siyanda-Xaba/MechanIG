export function notFoundHandler(req, res) {
  return res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} was not found` });
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ success: false, message: status === 500 ? "Unexpected server error" : error.message });
}
