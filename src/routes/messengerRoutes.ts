import express, { Router } from 'express';
import { MessengerController } from '../controller/messengerController';
import { AuthMiddleware } from '../middlewear/authMiddleware';

export class MessengerRouter {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  /**
   * Setup routes for handling different messenger functionalities
   *
   * @return {void}
   */
  private setupRoutes(): void {
    this.router.get('/get-friends', AuthMiddleware.authenticate, MessengerController.getFriends);
    this.router.post('/send-message', AuthMiddleware.authenticate, MessengerController.messageUploadDB);
    this.router.get('/get-message/:id', AuthMiddleware.authenticate, MessengerController.messageGet);
    this.router.post('/image-message-send', AuthMiddleware.authenticate, MessengerController.imageMessageSend);
    this.router.post('/seen-message', AuthMiddleware.authenticate, MessengerController.messageSeen);
    this.router.post('/delivered-message', AuthMiddleware.authenticate, MessengerController.deliveredMessage);
  }

  public getRouter(): Router {
    return this.router;
  }
}
