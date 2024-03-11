import { Response, NextFunction } from 'express';

export class ErrorHandler {
  internalServerError(err: Error, res: Response, next: NextFunction) {
    res.status(500).json({
      errorMessage: ['Internal Server Error'],
      message: err.message,
    });
    next();
  }

  handleVerificationError(err: Error, res: Response, next: NextFunction): void {
    res.status(401).json({
      error: {
        errorMessage: ['Invalid Token'],
      },
    });
    next();
  }

  handleNoAuthTokenError(err: Error, res: Response, next: NextFunction): void {
    res.status(400).json({
      error: {
        errorMessage: ['Please Login First'],
      },
    });
    next();
  }
}
