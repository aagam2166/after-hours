import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error',
    errors: [],
  });
}
