import {NextFunction, Request, Response} from 'express';
import {IUser, UserModel} from '../models/authModel';
import { MessageModel } from '../models/messageModel';
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
  public static async getFriends(req: Request, res: Response , next: NextFunction): Promise<void> {
    // @ts-ignore
    const myId = req.myId;
    let fnd_msg: any[] = [];
    try {
      const friendGet :any[] = await UserModel.find({
        _id: {
          $ne: myId,
        },
      });
      for (let i = 0; i < friendGet.length; i++) {

        const fdId :string = friendGet[i].id;

        // @ts-ignore
        const lmsg = await MessengerController.getLastMessage(myId, fdId);
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
      next(error);
    }
  }

  /**
   * Get the last message for the given user IDs.
   *
   * @param {string} myId - The ID of the current user
   * @param {string} fdId - The ID of the other user
   * @return {Promise<any>} A Promise that resolves with the last message
   */
  public static async getLastMessage(myId: string, fdId: string): Promise<any> {
    console.log('hi')
    const msg: any = await MessageModel.findOne({
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
    }).sort({
      updatedAt: -1,
    });
    return msg;
  }

  /**
   * Uploads a message to the database.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {Promise<void>} a promise that resolves to void
   */
  public static async messageUploadDB(req: Request, res: Response): Promise<void> {
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
      res.status(500).json({
        error: {
          errorMessage: 'Internal Sever Error',
        },
      });
    }
  }

  /**
   * A description of the entire function.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {Promise<void>} a promise that resolves to void
   */
  public static async messageGet(req: Request, res: Response): Promise<void> {
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
      res.status(500).json({
        error: {
          errorMessage: 'Internal Server error',
        },
      });
    }
  }

  /**
   * ImageMessageSend function sends an image message using the given request and response objects.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {void}
   */
  public static ImageMessageSend(req: Request, res: Response): void {
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
        res.status(500).json({
          error: {
            errorMessage: 'Internal Sever Error',
          },
        });
      }
    });
  }

  /**
   * A function to mark a message as seen.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {Promise<void>} a promise that resolves to void
   */
  public static async messageSeen(req: Request, res: Response): Promise<void> {
    const messageId = req.body._id;
    await MessageModel.findByIdAndUpdate(messageId, {
      status: 'seen',
    })
      .then(() => {
        res.status(200).json({
          success: true,
        });
      })
      .catch(() => {
        res.status(500).json({
          error: {
            errorMessage: 'Internal Server Error',
          },
        });
      });
  }

  /**
   * A function to mark a message as delivered.
   *
   * @param {Request} req - the request object
   * @param {Response} res - the response object
   * @return {Promise<void>} a promise that resolves when the message is marked as delivered
   */
  public static async deliveredMessage(req: Request, res: Response): Promise<void> {
    const messageId = req.body._id;
    await MessageModel.findByIdAndUpdate(messageId, {
      status: 'delivered',
    })
      .then(() => {
        res.status(200).json({
          success: true,
        });
      })
      .catch(() => {
        res.status(500).json({
          error: {
            errorMessage: 'Internal Server Error',
          },
        });
      });
  }
}
