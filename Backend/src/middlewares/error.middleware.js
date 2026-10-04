import multer from "multer";
import fs from "node:fs/promises";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export function notFoundHandler(req, res, next) {
  next(new apiError(404, `Route not found: ${req.method} ${req.path}`));
}

export function errorHandler(error, req, res, _next) {
  if (req.file?.path) void fs.unlink(req.file.path).catch(() => {});
  let statusCode = Number(error.statusCode) || 500;
  let message = statusCode >= 500 ? "Internal server error" : error.message;

  if (error instanceof multer.MulterError) {
    statusCode = 400;
    message = error.code === "LIMIT_FILE_SIZE" ? "Uploaded file is too large" : "Invalid uploaded file";
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = "A user with those details already exists";
  } else if (error?.name === "ValidationError" || error?.name === "CastError") {
    statusCode = 400;
    message = error.message;
  }

  if (statusCode >= 500) console.error({ err: error, path: req.originalUrl, method: req.method });
  res.status(statusCode).json(new apiResponse(statusCode, null, message));
}
