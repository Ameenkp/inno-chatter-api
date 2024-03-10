import {model, Schema} from 'mongoose';

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


/**
 * This function retrieves the last message between two users based on their IDs using the MessageModel.
 * It uses the $or operator to query for messages where the sender and receiver IDs match the provided IDs,
 * and then sorts the messages by updatedAt in descending order to get the last message. If an error occurs,
 * it throws an error with a descriptive message.
 *
 * @param {string} myId - The ID of the current user
 * @param {string} fdId - The ID of the other user
 * @return {Promise<any>} The last message object
 */
export async function getLastMessage(myId: string, fdId: string): Promise<any> {
  try {
    return await MessageModel.findOne({
      $or: [
        {
          $and: [{senderId: {$eq: myId}}, {reseverId: {$eq: fdId}}],
        },
        {
          $and: [{senderId: {$eq: fdId}}, {reseverId: {$eq: myId}}],
        },
      ],
    }).sort({
      updatedAt: -1,
    });
  } catch (error) {
    throw new Error(`Error getting last message: ${(error as Error).message}`);
  }
}
