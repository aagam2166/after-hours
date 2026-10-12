import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Validate request body against a Zod schema.
 * Usage: router.post('/route', validate(mySchema), controller)
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
        return next(new ApiError(400, 'Validation failed', messages));
      }
      next(err);
    }
  };
}
