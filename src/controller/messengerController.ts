import { NextFunction, Request, Response } from 'express';
import {UserModel } from '../models/authModel';
import { getLastMessage, MessageModel } from '../models/messageModel';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export class MessengerController {
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
    let fnd_msg: any[] = [];
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
        fnd_msg = [
          ...fnd_msg,
          {
            fndInfo: friendGet[i],
            msgInfo: lmsg,
          },
        ];
      }
      res.status(200).json({ success: true, friends: fnd_msg });
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
      let getAllMessage = await MessageModel.find({
        $or: [
          {
            $and: [
              {
                senderId: {
                  $eq: myId,
                },
              },
              {
                reseverId: {
                  $eq: fdId,
                },
              },
            ],
          },
          {
            $and: [
              {
                senderId: {
                  $eq: fdId,
                },
              },
              {
                reseverId: {
                  $eq: myId,
                },
              },
            ],
          },
        ],
      });
      res.status(200).json({
        success: true,
        message: getAllMessage,
      });
    } catch (error) {
      console.log('failed to retrieve messages ', error as Error);
      next(error);
    }
  }

  /**
   * ImageMessageSend function sends an image message using the given request and response objects.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @param {NextFunction} next - the next function
   * @return {void} void
   */
  public static ImageMessageSend(req: Request, res: Response, next: NextFunction): void {
    // @ts-ignore
    const senderId = req.myId;
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      const { senderName, reseverId, imageName } = fields;
      const newPath = path.join(__dirname + `../../../frontend/public/image/${imageName}`);

      // @ts-ignore
      files.image.originalFilename = imageName;
      try {
        // @ts-ignore
        fs.copyFile(files?.image?.filepath, newPath, async (err) => {
          if (err) {
            res.status(500).json({
              error: {
                errorMessage: 'Image upload fail',
              },
            });
          } else {
            const insertMessage = await MessageModel.create({
              senderId: senderId,
              senderName: senderName,
              reseverId: reseverId,
              message: {
                text: '',
                // @ts-ignore
                image: files?.image?.originalFilename,
              },
            });
            res.status(201).json({
              success: true,
              message: insertMessage,
            });
          }
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
}
