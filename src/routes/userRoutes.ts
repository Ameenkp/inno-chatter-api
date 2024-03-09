// src/routes/UserRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserController } from '../controller/userController';

export class UserRoutes {
  private readonly router: Router;
  private readonly userController: UserController;

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
    this.router.get('/auth' , this.ensureAuthenticated , (req: Request, res: Response) => {
      res.status(200).json({ message: 'Authenticated' , isAuthenticated: true });
    });
    this.router.get('/logout', this.ensureAuthenticated, this.userController.logout.bind(this.userController));
  }

  public ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  public getUserRouter(): Router {
    return this.router;
  }
}
