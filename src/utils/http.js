export function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export function notFound(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}

export function forbidden(message = "You do not have permission to perform this action") {
  const error = new Error(message);
  error.status = 403;
  return error;
}
