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
      index: true,
    },
    senderName: {
      type: String,
      required: [true, 'Please provide a sender name'],
    },
    reseverId: {
      type: String,
      required: [true, 'Please provide a receiver id'],
      index: true,
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
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true, // Adding an index to the updatedAt field
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
          $and: [{ senderId: { $eq: myId } }, { reseverId: { $eq: fdId } }],
        },
        {
          $and: [{ senderId: { $eq: fdId } }, { reseverId: { $eq: myId } }],
        },
      ],
    }).sort({
      updatedAt: -1,
    });
  } catch (error) {
    throw new Error(`Error getting last message: ${(error as Error).message}`);
  }
}

/**
 * retrieves all messages for the given user IDs using the MessageModel.
 * It uses the find method to search for messages where the senderId and receiverId match the provided user IDs.
 * If an error occurs, it throws an error message.
 *
 * @param {string} myId - The ID of the user making the request
 * @param {string} fdId - The ID of the user whose messages are being retrieved
 * @return {Promise<any>} A promise that resolves to an array of messages
 */
export async function getAllMessage(myId: string, fdId: string): Promise<any> {
  try {
    return await MessageModel.find({
      $or: [
        {
          $and: [{ senderId: { $eq: myId } }, { reseverId: { $eq: fdId } }],
        },
        {
          $and: [{ senderId: { $eq: fdId } }, { reseverId: { $eq: myId } }],
        },
      ],
    });
  } catch (error) {
    throw new Error(`Error getting all messages: ${(error as Error).message}`);
  }
}

/**
 * Inserts a new message into the database.
 *
 * @param {string} senderId - The ID of the message sender
 * @param {string} senderName - The name of the message sender
 * @param {string} reseverId - The ID of the message receiver
 * @param {string} newImageName - The name of the new image to be inserted
 * @return {Promise<IMessage>} A promise that resolves to the inserted message
 */

export async function insertMessage(
  senderId: string,
  senderName: string,
  reseverId: string,
  newImageName: string
): Promise<IMessage> {
  try {
    return await MessageModel.create({
      senderId: senderId,
      senderName: senderName,
      reseverId: reseverId,
      message: {
        text: '',
        // @ts-ignore
        newImageName,
      },
    });
  } catch (error) {
    throw new Error(`Error inserting message: ${(error as Error).message}`);
  }
}
