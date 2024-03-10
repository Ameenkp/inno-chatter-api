import { Server, Socket } from 'socket.io';
import http from 'http';
import {User, UserInfo} from "./models/user.model";


export class SocketServer {
     private io: Server;
     private users: User[] = [];

     constructor(private server: http.Server) {
          this.io = new Server(server, {
               cors: {
                    origin: '*',
                    methods: ['GET', 'POST'],
               },
          });

          this.initializeSocketEvents();
     }

     private addUser(userId: string, socketId: string, userInfo: UserInfo): void {
          const checkUser = this.users.some(u => u.userId === userId);

          if (!checkUser) {
               this.users.push({ userId, socketId, userInfo });
          }
     }

     private userRemove(socketId: string): void {
          this.users = this.users.filter(u => u.socketId !== socketId);
     }

     private findFriend(id: string): User | undefined {
          return this.users.find(u => u.userId === id);
     }

     private userLogout(userId: string): void {
          this.users = this.users.filter(u => u.userId !== userId);
     }

     /**
     * This method sets up various event listeners for a socket connection.
     * It listens for events such as adding a user, sending and receiving messages,
     * message delivery and read receipts, typing notifications, user logout, and disconnection.
     * It then performs corresponding actions and emits events to other connected sockets.
     */
     private initializeSocketEvents(): void {
          this.io.on('connection', (socket: Socket) => {
               console.log('Socket is connecting...');

               socket.on('addUser', (userId: string, userInfo: UserInfo) => {
                    this.addUser(userId, socket.id, userInfo);
                    this.io.emit('getUser', this.users);

                    const us = this.users.filter(u => u.userId !== userId);
                    const con = 'new_user_add';
                    for (const user of us) {
                         socket.to(user.socketId).emit('new_user_add', con);
                    }
               });

               socket.on('sendMessage', (data: any) => {
                    const user = this.findFriend(data.reseverId);

                    if (user !== undefined) {
                         socket.to(user.socketId).emit('getMessage', data);
                    }
               });

               socket.on('messageSeen', (msg: any) => {
                    const user = this.findFriend(msg.senderId);

                    if (user !== undefined) {
                         socket.to(user.socketId).emit('msgSeenResponse', msg);
                    }
               });

               socket.on('deliveredMessage', (msg: any) => {
                    const user = this.findFriend(msg.senderId);

                    if (user !== undefined) {
                         socket.to(user.socketId).emit('msgDeliveredResponse', msg);
                    }
               });

               socket.on('seen', (data: any) => {
                    const user = this.findFriend(data.senderId);

                    if (user !== undefined) {
                         socket.to(user.socketId).emit('seenSuccess', data);
                    }
               });

               socket.on('typingMessage', (data: any) => {
                    const user = this.findFriend(data.reseverId);

                    if (user !== undefined) {
                         socket.to(user.socketId).emit('typingMessageGet', {
                              senderId: data.senderId,
                              reseverId: data.reseverId,
                              msg: data.msg,
                         });
                    }
               });

               socket.on('logout', (userId: string) => {
                    this.userLogout(userId);
               });

               socket.on('disconnect', () => {
                    console.log('User is disconnected...');
                    this.userRemove(socket.id);
                    this.io.emit('getUser', this.users);
               });
          });
     }

     public SetupSocket(): void {
          this.initializeSocketEvents();
     }
}