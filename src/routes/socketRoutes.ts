// socketRouter.ts
import { Server, Socket } from 'socket.io';
import { ChatController } from '../controller/chatController';
import {Router} from "express";

export class SocketRouter {
  private readonly router: Router;
  private chatController: ChatController;

  constructor(io: Server) {
    this.router = Router();
    this.chatController = new ChatController();
  }

  getSocketRouter() {
    return this.router;
  }
}
