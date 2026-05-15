exports.errorHandler = (error, req, res, next) => {
  console.error("ERROR:", error);

  const statusCode = res.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      error.message || "Internal Server Error",
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : error.stack,
  });
};