import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {Constants} from "../config/constants";

export class AuthMiddleware {
  public static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { authToken } = req.cookies;

    if (authToken) {
      try {
        const decodedToken: any = jwt.verify(authToken, Constants.JWT_SECRET!);
        // @ts-ignore
        req.myId = decodedToken.id;
        next();
      } catch (error) {
        AuthMiddleware.handleVerificationError(res);
      }
    } else {
      AuthMiddleware.handleNoAuthTokenError(res);
    }
  }

  private static handleVerificationError(res: Response): void {
    res.status(401).json({
      error: {
        errorMessage: ['Invalid Token'],
      },
    });
  }

  private static handleNoAuthTokenError(res: Response): void {
    res.status(400).json({
      error: {
        errorMessage: ['Please Login First'],
      },
    });
  }
}
