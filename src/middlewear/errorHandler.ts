import { Response, NextFunction } from 'express';

export class ErrorHandler {
  internalServerError(err: Error, res: Response, next: NextFunction) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
    next();
  }

  unAuthorizedError(err: Error, res: Response, next: NextFunction) {
    res.status(401).json({
      error: err.name,
      message: err.message,
    });
    next();
  }
}
