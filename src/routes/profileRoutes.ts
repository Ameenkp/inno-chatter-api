// src/routes/ProfileRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ProfileController } from '../controller/profileController';

export class ProfileRoutes {
  public router: Router;
  public profileController: ProfileController;

  constructor() {
    this.router = Router();
    this.profileController = new ProfileController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router
      .route('/')
      .get(this.ensureAuthenticated, this.profileController.getProfile.bind(this))
      .patch(this.ensureAuthenticated, this.profileController.updateProfile.bind(this));
  }

  public getProfileRoutes(): Router {
    return this.router;
  }

  private ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
}
