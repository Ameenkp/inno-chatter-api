import { Response, NextFunction } from 'express';

export class ErrorHandler {
  internalServerError(err: Error, res: Response, next: NextFunction) {
    res.status(500).json({
      errorMessage: 'Internal Server Error',
      message: err.message,
    });
    next();
  }

  unAuthorizedError(err: Error, res: Response, next: NextFunction) {
    res.status(401).json({
      errorMessage: err.name,
      message: err.message,
    });
    next();
  }
}
