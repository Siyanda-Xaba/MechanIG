export function notFound(_request, response) {
  response.status(404).json({ error: 'Route not found.' });
}

export function errorHandler(error, _request, response, _next) {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return response.status(413).json({ error: 'Image must be 8 MB or smaller.' });
  }

  if (error.name === 'MulterError') {
    return response.status(400).json({ error: error.message });
  }

  console.error(error);
  return response.status(error.statusCode || 500).json({ error: error.message || 'Unexpected server error.' });
}
