import { Error, model, Schema } from 'mongoose';
import validator from 'validator';

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

export async function createUser(user: Partial<IUser>): Promise<IUser> {
  try {
    return await UserModel.create(user);
  } catch (error) {
    throw new Error(`Error creating tour: ${(error as Error).message}`);
  }
}