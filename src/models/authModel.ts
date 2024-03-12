import { Error, model, Schema } from 'mongoose';
import validator from 'validator';
import path from 'path';

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  image: string;
}

const registerSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, 'User name is required.'],
    },
    email: {
      type: String,
      required: [true, 'User email is required.'],
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'A user must have a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'User password is required.'],
      trim: true,
      select: false,
      minlength: 8,
      validate: [validator.isStrongPassword, 'A user must have a strong password'],
    },
    image: {
      type: String,
      required: [true, 'User image is required.'],
    },
  },
  { timestamps: true }
);
export const UserModel = model<IUser>('user', registerSchema);

/**
 * Creates a new user.
 *
 * @param {Partial<IUser>} user - the user data
 * @return {Promise<IUser>} the newly created user
 */
export async function createUser(user: Partial<IUser>): Promise<IUser> {
  try {
    return await UserModel.create(user);
  } catch (error) {
    throw new Error(`Error creating user: ${(error as Error).message}`);
  }
}

/**
 * Finds a user by their email.
 *
 * @param {String} email - the email of the user
 * @return {Promise<IUser>} the user found by the email
 */
export async function findUserByEmail(email: String): Promise<IUser> {
  try {
    return await UserModel.findOne({ email: email }).select('+password');
  } catch (error) {
    throw new Error(`Email not Found: ${(error as Error).message}`);
  }
}
