import { Router } from 'express';
import { AuthController } from '../controller/authController';

export class AuthRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  /**
   * Set up routes for user login, register, and logout.
   */
  private setupRoutes() {
    this.router.post('/user-login', AuthController.userLogin);
    this.router.post('/user-register', AuthController.userRegister);
    this.router.post('/user-logout', AuthController.userLogout);
  }

  public getRouter() {
    return this.router;
  }
}
