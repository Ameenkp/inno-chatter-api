// src/models/MessageModel.ts
import {Document, Error, model, Schema} from 'mongoose';

export interface IMessage extends Document {
    user: string;
    text: string;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    user: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const MessageModel = model<IMessage>('Message', messageSchema);


export async function saveMessageToDatabase(data : Partial<IMessage>): Promise<void> {
    try {
        await MessageModel.create(data);
        console.log('Message saved to the database');
} catch (error) {
    console.error('Error saving message to db:', (error as Error).message);
    throw new Error('Error occurred while saving the chat message to the database');
}
}