export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message = 'Server Error' } = err;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    statusCode = 400;
    const key = Object.keys(err.keyValue || {})[0];
    message = `${key} already exists`;
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};
