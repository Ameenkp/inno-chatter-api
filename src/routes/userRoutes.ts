// src/routes/UserRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserController } from '../controller/userController';

export class UserRoutes {
  private readonly router: Router;

  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/register', this.userController.register.bind(this.userController));
    this.router.post(
      '/login',
      passport.authenticate('local'),
      this.userController.login.bind(this.userController)
    );
  }

  public getUserRouter(): Router {
    return this.router;
  }
}
