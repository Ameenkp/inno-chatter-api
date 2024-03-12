import { UserModel } from '../../../src/models/authModel';
import { IMessage, MessageModel } from '../../../src/models/messageModel';
import { MessengerController } from '../../../src/controller/messengerController';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

describe('messageController tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockFormidableParse: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      // @ts-ignore
      myId: '65ed7fac57bdfe7745df1ec9',
      params: {
        id: '65ed71ac9a9321491c85ac79',
      },
      body: {
        senderId: '65ed71ac9a9321491c85ac79',
        senderName: 'minnu kp minnu',
        reseverId: '65ed7fac57bdfe7745df1ec9',
        message: { text: 'Hello!', image: '' },
        status: 'seen',
      },
      cookies: {
        authToken: 'valid-token',
      },
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // jest
    //   .spyOn(MessengerController, 'messageUploadDB')
    //   .mockImplementation(() => Promise.resolve());
    // jest
    //   .spyOn(MessengerController, 'messageGet')
    //   .mockImplementation(() => Promise.resolve());
    // jest
    //   .spyOn(MessengerController, 'deliveredMessage')
    //   .mockImplementation(() => Promise.resolve());
    // jest
    //   .spyOn(MessengerController, 'messageSeen')
    //   .mockImplementation(() => Promise.resolve());
  });
  const mockMessage: IMessage = {
    senderId: '65ed71ac9a9321491c85ac79',
    senderName: 'minnu kp minnu',
    reseverId: '65ed7fac57bdfe7745df1ec9',
    message: { text: 'Hello!', image: '' },
    status: 'unseen',
  };
  test('should return all friends for an user', async () => {
    UserModel.find = jest.fn().mockResolvedValueOnce(mockMessage);
    // @ts-ignore
    await MessengerController.getFriends(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // expect(mockNext).toHaveBeenCalled();
  });

  test('should return 200', async () => {
    UserModel.find = jest.fn().mockResolvedValueOnce(mockMultipleFriendsResponse()[0]);
    // @ts-ignore
    await MessengerController.getFriends(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });
  test('should return 200 for multiple users with last message', async () => {
    MessageModel.findOne = jest
      .fn()
      .mockImplementation(() => ({ sort: jest.fn().mockResolvedValueOnce(mockLastMessageResponse()) }));
    UserModel.find = jest.fn().mockResolvedValueOnce(mockMultipleFriendsResponse());

    // @ts-ignore
    await MessengerController.getFriends(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  test('should throw an error if an error occurs while retrieving all the friends/ last messages', async () => {
    UserModel.find = jest.fn().mockRejectedValue(mockError);

    try {
      await MessengerController.getFriends(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockNext).toHaveBeenCalledWith(mockError);
    }
  });

  test('should Uploads a message to the database', async () => {
    MessageModel.create = jest.fn().mockResolvedValueOnce(mockMessage);

    // @ts-ignore
    await MessengerController.messageUploadDB(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  test('should throw an error if an error occurs while uploading the messages to DB', async () => {
    MessageModel.create = jest.fn().mockRejectedValueOnce(mockError);

    try {
      await MessengerController.messageUploadDB(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockNext).toHaveBeenCalledWith(mockError);
    }
  });

  test('should return messages based on sender and receiver IDs', async () => {
    MessageModel.find = jest.fn().mockResolvedValueOnce(mockMessage);
    // @ts-ignore
    await MessengerController.messageGet(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  test('should throw an error if an error occurs while retrieving messages based on sender and receiver IDs', async () => {
    MessageModel.find = jest.fn().mockRejectedValueOnce(mockError());
    try {
      await MessengerController.messageGet(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockNext).toHaveBeenCalledWith(mockErrorWithMessage('Error getting all messages: Mocked error'));
    }
  });

  test('should mark a message as seen', async () => {
    MessageModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockMessage);
    // @ts-ignore
    await MessengerController.messageSeen(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
  });

  test('should throw an error while marking a message as seen', async () => {
    MessageModel.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(mockError());
    try {
      await MessengerController.messageSeen(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockNext).toHaveBeenCalledWith(mockError());
    }
  });

  test('should mark a message as delivered', async () => {
    mockMessage.status = 'delivered';
    MessageModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(mockMessage);
    // @ts-ignore
    await MessengerController.deliveredMessage(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
  });

  test('should throw an error while marking a message as delivered', async () => {
    MessageModel.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(mockError());
    try {
      await MessengerController.deliveredMessage(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockNext).toHaveBeenCalledWith(mockError());
    }
  });

  function mockError() {
    return new Error('Mocked error');
  }
  function mockErrorWithMessage(message: string) {
    return new Error(message);
  }

  function mockMultipleFriendsResponse() {
    return [
      {
        id: '65ed71ac9a9321491c85ac79',
        userName: 'minnu kp minnu',
        email: 'manoj@gmail.com',
        image: '57926img123.jpeg',
        createdAt: '2024-03-10T08:39:08.580Z',
        updatedAt: '2024-03-10T08:39:08.580Z',
        __v: 0,
      },
      {
        id: '65ed88dd628563e7526c4b2a',
        userName: 'ameen',
        email: 'alameenkp9068@gmail.com',
        image: '64100_425e5192-b7bd-4e83-b160-2e622f6991f1.jpeg',
        createdAt: '2024-03-10T10:18:05.639Z',
        updatedAt: '2024-03-10T10:18:05.639Z',
        __v: 0,
      },
      {
        id: '65eda29a6577795c8b36e8df',
        userName: 'ilan',
        email: 'ilan_hi@gmail.com',
        image: '17911img123.jpeg',
        createdAt: '2024-03-10T12:07:54.292Z',
        updatedAt: '2024-03-10T12:07:54.292Z',
        __v: 0,
      },
    ];
  }

  function mockLastMessageResponse() {
    return {
      message: {
        text: 'hi all',
        image: 'img.jpg',
      },
      id: '65edb5ecdb5514886d445f23',
      senderId: '65ed71ac9a9321491c85ac79',
      senderName: 'minnu kp minnu',
      reseverId: '65ed7fac57bdfe7745df1ec9',
      status: 'unseen',
      createdAt: '2024-03-10T13:30:20.733Z',
      updatedAt: '2024-03-10T13:30:20.733Z',
      __v: 0,
    };
  }
});
