// src/routes/ProfileRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

export class ProfileRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/profile', passport.authenticate('local'), this.getProfile.bind(this));
    this.router.put('/profile', passport.authenticate('local'), this.updateProfile.bind(this));
  }

  private getProfile(req: Request, res: Response): void {
    res.json({ message: 'Profile retrieved successfully.', user: req.user });
  }

  private updateProfile(req: Request, res: Response): void {
    // Update user profile logic here
    res.json({ message: 'Profile updated successfully.' });
  }

  public getProfileRoutes(): Router {
    return this.router;
  }
}
