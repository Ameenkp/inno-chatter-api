import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/authModel';
import { getAllMessage, getLastMessage, insertMessage, MessageModel } from '../models/messageModel';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'node:util';

export class MessengerController {
  private static copyFileAsync = promisify(fs.copyFile);
  /**
   * A function to retrieve the friends of a user and their last messages.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} returns a promise with void value
   */
  public static async getFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
    // @ts-ignore
    const myId = req.myId;
    let fndMsg: any[] = [];
    try {
      const friendGet: any[] = await UserModel.find({
        _id: {
          $ne: myId,
        },
      });
      for (let i = 0; i < friendGet.length; i++) {
        const fdId: string = friendGet[i].id;

        // @ts-ignore
        const lmsg = await getLastMessage(myId, fdId);
        fndMsg = [
          ...fndMsg,
          {
            fndInfo: friendGet[i],
            msgInfo: lmsg,
          },
        ];
      }
      res.status(200).json({ success: true, friends: fndMsg });
    } catch (error) {
      console.log('failed to retrieve friends', error as Error);
      next(error);
    }
  }

  /**
   * Uploads a message to the database.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves to void
   */
  public static async messageUploadDB(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { senderName, reseverId, message } = req.body;
    // @ts-ignore
    const senderId = req.myId;
    try {
      const insertMessage = await MessageModel.create({
        senderId: senderId,
        senderName: senderName,
        reseverId: reseverId,
        message: {
          text: message,
          image: '',
        },
      });
      res.status(201).json({
        success: true,
        message: insertMessage,
      });
    } catch (error) {
      console.log('failed to insert message into DB ', error as Error);
      next(error);
    }
  }

  /**
   * Get messages based on sender and receiver IDs.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next middleware function
   * @return {Promise<void>} an empty promise
   */
  public static async messageGet(req: Request, res: Response, next: NextFunction): Promise<void> {
    // @ts-ignore
    const myId = req.myId;
    const fdId = req.params.id;
    try {
      const getAllMessages = await getAllMessage(myId, fdId);
      res.status(200).json({
        success: true,
        message: getAllMessages,
      });
    } catch (error) {
      console.log('failed to retrieve messages ', error as Error);
      next(error);
    }
  }

  /**
   * sends an image message using the given request and response objects.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {void} void
   */
  public static imageMessageSend(req: Request, res: Response, next: NextFunction): void {
    // @ts-ignore
    const senderId = req.myId;
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { senderName, reseverId, imageName } = fields;
      try {
        await MessengerController.saveImage(files.image);
        // @ts-ignore
        const insertMessages = await insertMessage(senderId, senderName[0], reseverId[0], imageName[0]);
        res.status(201).json({
          success: true,
          message: insertMessages,
        });
      } catch (error) {
        console.log('failed to insert message into DB ', error as Error);
        next(error);
      }
    });
  }

  /**
   * A function to mark a message as seen.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves to void
   */
  public static async messageSeen(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messageId = req.body._id;
      await MessageModel.findByIdAndUpdate(messageId, {
        status: 'seen',
      });
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error('failed to mark message as seen', error);
      next(error);
    }
  }

  /**
   * A function to mark a message as delivered.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {Promise<void>} a promise that resolves when the message is marked as delivered
   */
  public static async deliveredMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messageId = req.body._id;

      await MessageModel.findByIdAndUpdate(messageId, {
        status: 'delivered',
      });

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error('failed to mark message as delivered', error);
      next(error);
    }
  }

  private static async saveImage(image: any): Promise<void> {
    try {
      const newPath = path.join(__dirname + '../../../public/image/', image[0].newFilename, '.jpeg');
      await this.copyFileAsync(image[0].filepath, newPath);
    } catch (error) {
      console.error('Error saving user image:', error);
      throw error;
    }
  }
}
