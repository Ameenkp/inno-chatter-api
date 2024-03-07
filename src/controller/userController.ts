import { Request, Response, NextFunction } from 'express';
import { createUser } from '../models/userModel';
import { IUser } from '../models/userModel'; // Import the UserModel

export class UserController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: Partial<IUser> = req.body;
      const createdUser = await createUser(userData);

      res.status(201).json({ message: 'User registered successfully.', user: createdUser });
    } catch (error) {
      console.error('Error registering user:', error);
      next(error);
    }
  }

  public login(req: Request, res: Response): void {
    const user: IUser = <IUser>req.user;
    res.json({
      message: 'Login successful.',
      user: {
        email: user?.email,
        name: user?.name,
      },
    });
  }
}
