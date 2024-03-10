import { model, Schema } from 'mongoose';

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
    },
    password: {
      type: String,
      required: [true, 'User password is required.'],
      select: false,
    },
    image: {
      type: String,
      required: [true, 'User image is required.'],
    },
  },
  { timestamps: true }
);
export const UserModel = model<IUser>('user', registerSchema);
