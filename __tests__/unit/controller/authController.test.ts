import { NextFunction, Request, Response } from 'express';
import { IUser, UserModel } from '../../../src/models/authModel';
import { AuthController } from '../../../src/controller/authController';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Error} from "mongoose";

describe('authController tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockUser: Partial<IUser>;

  const user = new UserModel({
    userName: 'test_user_1',
    email: 'john.doe@example.com',
    password: 'StrongPassword123@',
    image: 'profile.jpg',
  });

  beforeEach(() => {
    mockRequest = {
      // @ts-ignore
      myId: '65ed7fac57bdfe7745df1ec9',
      params: {
        id: '65ed71ac9a9321491c85ac79',
      },
      body: {
        password: 'ilan',
        email: 'ilan_hi@gmail.com',
      },
      cookies: {
        authToken: 'valid-token',
      },
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    const mockUser: Partial<IUser> = {
      userName: 'nooh',
      email: 'test_user@gmail.com',
      password: '$2b$10$3bkEL/AI9sBLfdblvDKiY.ErJK/YlfISvuyV9xzS/Xdg691Ieao3u',
      image: '62096background-123.jpeg',
    };
  });

  test('should validate user password up on login', async () => {
    mockRequest.body.password = '';
    await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { errorMessage: ['Please provide your Password'] } });
  });
  test('should validate user email details up on login', async () => {
    mockRequest.body.email = '';
    await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { errorMessage: ['Please provide your Email'] } });
    mockRequest.body.email = 'amen@gm';
    await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { errorMessage: ['Please provide your Valid Email'] } });
  });
  test('should send 400 if the user not found for the provided email', async () => {
    UserModel.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(mockUser) }));

    await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { errorMessage: ['Your Email was Not Found'] } });
  });

  test('should authenticate valid users', async () => {
    UserModel.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(user) }));
    const mockBcryptCompare = jest.spyOn(bcrypt, 'compare');
    const mockJwtSign = jest.spyOn(jwt, 'sign');

    mockBcryptCompare.mockReturnValue(true as any);
    mockJwtSign.mockReturnValue('signed-token' as any);

    await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.cookie).toHaveBeenCalledWith('authToken', 'signed-token' ,  expect.any(Object));
    expect(mockResponse.json).toHaveBeenCalledWith({
      successMessage: 'Your Register Successful',
      token: 'signed-token',
    });
  });

  test('should authenticate valid users with hashed password', async () => {
    UserModel.findOne = jest.fn().mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValueOnce(user) }));
    const mockBcryptCompare = jest.spyOn(bcrypt, 'compare');
    const mockJwtSign = jest.spyOn(jwt, 'sign');

    mockBcryptCompare.mockReturnValue(false as any);
    mockJwtSign.mockReturnValue('signed-token' as any);

    await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { errorMessage: ['Your Password is not Valid'] } });
  });

  test('should go to error middleware up on error', async () => {
    const mockError = new Error('Mocked error');
    try {
      UserModel.findOne = jest
          .fn()
          .mockImplementationOnce(() => ({ select: jest.fn().mockRejectedValueOnce(mockError) }));
      await AuthController.userLogin(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(mockNext).toHaveBeenCalled()
    }
  });
});
