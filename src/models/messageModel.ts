import { model, Schema } from 'mongoose';
import { IUser } from './authModel';

export interface IMessage {
  senderId: string;
  senderName: string;
  reseverId: string;
  message: {
    text: string;
    image: string;
  };
  status: string;
}

const messageSchema = new Schema(
  {
    senderId: {
      type: String,
      required: [true, 'Please provide a sender id'],
    },
    senderName: {
      type: String,
      required: [true, 'Please provide a sender name'],
    },
    reseverId: {
      type: String,
      required: [true, 'Please provide a receiver id'],
    },
    message: {
      text: {
        type: String,
        default: '',
      },
      image: {
        type: String,
        default: '',
      },
    },
    status: {
      type: String,
      default: 'unseen',
    },
  },
  { timestamps: true }
);
export const MessageModel = model<IMessage>('message', messageSchema);
