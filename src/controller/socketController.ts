// src/controllers/SocketController.ts
import { Server, Socket } from 'socket.io';
import {MessageModel, IMessage, saveMessageToDatabase} from '../models/messageModel';

export class SocketController {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.socketEvents();
    }

    private socketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('User connected:', socket.id);

            socket.on('chat-message', async (data: { user: string; text: string }) => {
                console.log('Received message:', data);

                try {

                    await saveMessageToDatabase(<IMessage>(data));
                    console.log('Message saved to the database');

                    // Broadcast the message to all connected clients
                    this.io.emit('chat-message', data);
                } catch (error) {
                    console.error('Error registering user:', error);
                    throw new Error('Error occurred while receiving the chat message');
                }
            });
        });
    }
}
