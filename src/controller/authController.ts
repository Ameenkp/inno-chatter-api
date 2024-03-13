import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {createUser, findUserByEmail, IUser, UserModel} from '../models/authModel';
import { Constants } from '../config/constants';
import { Utils } from '../utils/utils';

export class AuthController {
  /**
   * Handle user registration.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {void}
   */
  public static userRegister(req: Request, res: Response, next: NextFunction): void {
    const form = formidable();
    form.parse(req, async (err, fields: any, files) => {
      const { userName, email, password, confirmPassword } = fields;

      const error = AuthController.validateRegistrationData(
        userName[0],
        email[0],
        password[0],
        confirmPassword[0],
        files
      );

      if (error.length > 0) {
        res.status(400).json({ error: { errorMessage: error } });
      } else {
        try {
          const newImageName = await Utils.saveUserImage(files.image);

          const newUserDetails = {
            userName: userName[0],
            email: email[0],
            password: await bcrypt.hash(password[0], 10),
            image: newImageName,
          };
          const userCreate = await createUser(newUserDetails);
          const token = AuthController.generateAuthToken(userCreate);
          AuthController.sendAuthToken(res, token);
        } catch (error) {
          console.log('Failed to register user', error as Error);
          next(error);
        }
      }
    });
  }

  /**
   * Handle user login.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {void}
   */
  public static async userLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    const error = AuthController.validateLoginData(email, password);

    if (error.length > 0) {
      res.status(400).json({ error: { errorMessage: error } });
    } else {
      await AuthController.authenticateUser(email, password, res, next);
    }
  }

  /**
   * A function that updates a user.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} Promise that resolves to void
   */
  public static async userUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const { userId } = req.params;
      const userDataToUpdate:Partial<IUser> = req.body;
      if (userDataToUpdate.password) {
        throw new Error('Password cannot be updated at the moment');
      }
      const updatedUser:IUser | null = await UserModel.findByIdAndUpdate(userId, userDataToUpdate, { new: true });
      if (updatedUser) {
        res.status(200).json({ success: true, user:{userName : updatedUser.userName , email: updatedUser.email} });
      } else {
        res.status(404).json({ error: { errorMessage: 'Update failed' } });
      }
    } catch (error) {
      console.log('Failed to update user', error as Error);
      next(error);
    }
  }


  /**
   * Logs out the user.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {void}
   */
  public static userLogout(req: Request, res: Response): void {
    AuthController.clearAuthToken(res);
  }

  /**
   * A function to validate registration data.
   *
   * @param {string} userName - the user's name
   * @param {string} email - the user's email
   * @param {string} password - the user's password
   * @param {string} confirmPassword - the user's confirmed password
   * @param {any} files - image file
   * @return {string[]} array of error messages
   */
  private static validateRegistrationData(
    userName: string,
    email: string,
    password: string,
    confirmPassword: string,
    files: any
  ): string[] {
    const error = [];
    if (!userName) {
      error.push('Please provide your user name');
    }
    if (!email) {
      error.push('Please provide your Email');
    }
    if (email && !validator.isEmail(email)) {
      error.push('Please provide your Valid Email');
    }
    if (!password) {
      error.push('Please provide your Password');
    }
    if (!confirmPassword) {
      error.push('Please provide your confirm Password');
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push('Your Password and Confirm Password not same');
    }
    if (password && password.length < 6) {
      error.push('Please provide password mush be 6 character');
    }
    if (Object.keys(files).length === 0) {
      error.push('Please provide user image');
    }

    return error;
  }

  /**
   * Generates an authentication token for the given user.
   *
   * @param {any} user - the user object for which the token is being generated
   * @return {string} the generated authentication token
   */
  private static generateAuthToken(user: any): string {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        userName: user.userName,
        image: user.image,
        registerTime: user.createdAt,
      },
      Constants.JWT_SECRET,
      {
        expiresIn: Constants.JWT_EXPIRATION,
      }
    );
  }

  /**
   * Sends an authentication token in the response.
   *
   * @param {Response} res - the response object
   * @param {string} token - the authentication token to be sent
   * @return {void}
   */
  private static sendAuthToken(res: Response, token: string): void {
    const options = {
      expires: new Date(Date.now() + Constants.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
    };
    res.status(201).cookie('authToken', token, options).json({
      successMessage: 'Your Register Successful',
      token,
    });
  }

  /**
   * Validate login data.
   *
   * @param {string} email - the email to validate
   * @param {string} password - the password to validate
   * @return {string[]} array of error messages
   */
  private static validateLoginData(email: string, password: string): string[] {
    const error = [];

    if (!email) {
      error.push('Please provide your Email');
    }
    if (!password) {
      error.push('Please provide your Password');
    }
    if (email && !validator.isEmail(email)) {
      error.push('Please provide your Valid Email');
    }

    return error;
  }

  /**
   * Authenticates a user.
   *
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} promise that resolves when the authentication is complete
   */
  private static async authenticateUser(
    email: string,
    password: string,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const checkUser = await findUserByEmail(email);

      if (checkUser) {
        const matchPassword = await bcrypt.compare(password, checkUser.password);

        if (matchPassword) {
          const token = AuthController.generateAuthToken(checkUser);
          AuthController.sendAuthToken(res, token);
        } else {
          res.status(400).json({
            error: {
              errorMessage: ['Your Password is not Valid'],
            },
          });
        }
      } else {
        res.status(400).json({
          error: {
            errorMessage: ['Your Email was Not Found'],
          },
        });
      }
    } catch (error) {
      console.log('Authentication Failed', error as Error);
      next(error);
    }
  }

  /**
   * Clears the authentication token in the response.
   *
   * @param {Response} res - the response object
   * @return {void}
   */
  private static clearAuthToken(res: Response): void {
    res.status(200).cookie('authToken', '').json({
      success: true,
    });
  }
}
