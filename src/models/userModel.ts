// src/models/UserModel.ts
import { Document, Schema, model } from 'mongoose';
import slugify from 'slugify';
import validator from "validator";

interface IUser extends Document {
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
      validate: [validator.isEmail, 'A tour must have a valid email'],},
  password: { type: String, required: [true, 'A user must have a password'] },
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
