// src/models/UserModel.ts
import { Document, Error, model, Schema } from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  slug: string;
  password: string;
  role: string;
  active: boolean;
  photo: string;
  // Add other fields as needed for the user profile
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'A tour must have a email'],
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'A tour must have a valid email'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    validate: [validator.isStrongPassword, 'A user must have a strong password'],
  },
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    slug: { type: String },
    maxlength: [40, 'A user name must have less or equal than 40 characters'],
    minlength: [10, 'A user name must have more or equal than 10 characters'],
  },
  role: { type: String, required: false },
  active: { type: Boolean, default: false },
  photo: { type: String, default: '' },
});

/// DOCUMENT MIDDLEWARE ///////////////////////
userSchema.pre('save', function preSave(this: IUser, next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});
export const UserModel = model<IUser>('User', userSchema);

export async function createUser(data: Partial<IUser>): Promise<IUser> {
  try {
    data.password = await bcrypt.hash(<string>data.password, 10);
    await UserModel.create(data);
    return await UserModel.create(data);
  } catch (error) {
    throw new Error(`Error creating tour: ${(error as Error).message}`);
  }
}

export async function updateUserDetails(
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> {
  try {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  } catch (error) {
    throw new Error(`Error updating profile: ${(error as Error).message}`);
  }
}
