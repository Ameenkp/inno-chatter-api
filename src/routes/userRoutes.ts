// src/routes/UserRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { IUser, UserModel } from '../models/userModel';

export class UserRoutes {
  private readonly router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', passport.authenticate('local'), this.login.bind(this));
  }

  private async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ email, password: hashedPassword, name });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error registering user:', error);
      res
        .status(500)
        .json(
          error instanceof Error
            ? { message: error.message }
            : { message: 'Internal server error.' }
        );
    }
  }

  private login(req: Request, res: Response): void {
    const user: IUser = <IUser>req.user;
    res.json({
      message: 'Login successful.',
      user: {
        email: user?.email,
        name: user?.name,
      },
    });
  }

  public getUserRouter(): Router {
    return this.router;
  }
}
