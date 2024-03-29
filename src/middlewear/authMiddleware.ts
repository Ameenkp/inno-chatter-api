import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Constants } from '../config/constants';
import { InnoChatterApiError } from '../error/innoChatterApiError';

export class AuthMiddleware {
  /**
   * checks for an "authToken" in the request cookies,
   * verifies it using JWT, and sets "myId" in the request if successful.
   * If there's no token, it handles the error using methods from the "AuthMiddleware"
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves to void
   */
  public static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { authToken } = req.cookies;

    if (authToken) {
      try {
        const decodedToken: any = jwt.verify(authToken, Constants.JWT_SECRET!);
        // @ts-ignore
        req.myId = decodedToken.id;
        next();
      } catch (error) {
        throw new InnoChatterApiError('Invalid Token', 401);
      }
    } else {
      next(new InnoChatterApiError('Please Login First', 400));
    }
  }
}
