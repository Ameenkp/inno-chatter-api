import { IUser, updateUserDetails, UserModel } from '../models/userModel';
import {NextFunction, Request, Response} from 'express';

export class ProfileController {
  getProfile(req: Request, res: Response): void {
    const user: IUser = <IUser>req.user;
    console.log('user profile ' + user);
    res.json({ message: 'Profile retrieved successfully.', user: user });
  }

  async updateProfile(req: Request, res: Response , next: NextFunction) {
    try {
      const updateData: Partial<IUser> = req.body;
      const userData: Partial<IUser> = <IUser>req.user;
      const updatedUser = await updateUserDetails(userData._id, updateData);
      return updatedUser === null
        ? res.status(404).json({ status: 'fail', message: 'Update Failed' })
        : res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error) {
      return next(error);
    }
  }
}
