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
    /**
     * @swagger
     * /api/messenger/get-friends:
     *   get:
     *     summary: Retrieve the list of friends
     *     description: Returns a list of friends along with their information.
     *     tags:
     *       - Messenger
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               friends:
     *                 - fndInfo:
     *                     _id: "sampleId"
     *                     userName: "sampleUsername"
     *                     email: "sampleEmail@example.com"
     *                     image: "sampleImage.jpg"
     *                     createdAt: "2024-03-10T00:00:00.000Z"
     *                     updatedAt: "2024-03-10T00:00:00.000Z"
     *                     __v: 0
     *                   msgInfo: null
     */
    this.router.get('/get-friends', AuthMiddleware.authenticate, MessengerController.getFriends);

    /**
     * @swagger
     * /api/messenger/send-message:
     *   post:
     *     summary: Send a message
     *     description: Send a message to a friend.
     *     tags:
     *       - Messenger
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/MessageSend'
     *     responses:
     *       '201':
     *         description: Message sent successfully
     *       '500':
     *         description: Internal Server Error
     */
    this.router.post('/send-message', AuthMiddleware.authenticate, MessengerController.messageUploadDB);

    /**
     * @swagger
     * /api/messenger/get-message/{id}:
     *   get:
     *     summary: Get a specific message by ID
     *     description: Returns details of a specific message.
     *     tags:
     *       - Messenger
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The ID of the message to retrieve.
     *         schema:
     *           type: string
     *     security:
     *       - cookieAuth: []
     *     responses:
     *       '200':
     *         description: Successful response
     *         content:
     *           application/json:
     *             example:
     *               success: true
     *               message: {
     *                 _id: "sampleId",
     *                 senderId: "sampleSenderId",
     *                 senderName: "sampleSenderName",
     *                 receiverId: "sampleReceiverId",
     *                 message: {
     *                   text: "Hello, this is a sample message.",
     *                   image: "sampleImage.jpg"
     *                 },
     *                 createdAt: "2024-03-10T00:00:00.000Z",
     *                 updatedAt: "2024-03-10T00:00:00.000Z",
     *                 __v: 0
     *               }
     *       '404':
     *         description: Message not found
     */
    this.router.get('/get-message/:id', AuthMiddleware.authenticate, MessengerController.messageGet);
    this.router.post('/image-message-send', AuthMiddleware.authenticate, MessengerController.imageMessageSend);
    this.router.post('/seen-message', AuthMiddleware.authenticate, MessengerController.messageSeen);
    this.router.post('/delivered-message', AuthMiddleware.authenticate, MessengerController.deliveredMessage);
  }

  public getRouter(): Router {
    return this.router;
  }
}
