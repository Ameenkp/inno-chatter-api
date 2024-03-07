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
    this.router.get('/show', this.ensureAuthenticated, this.getProfile.bind(this));
    this.router.put('/update', this.ensureAuthenticated, this.updateProfile.bind(this));
  }

  private getProfile(req: Request, res: Response): void {
    console.log(req.user);
    res.json({ message: 'Profile retrieved successfully.', user: req.user });
  }

  private updateProfile(req: Request, res: Response): void {
    res.json({ message: 'Profile updated successfully.' });
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
