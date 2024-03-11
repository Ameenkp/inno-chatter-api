import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '../../../src/middlewear/authMiddleware';
import { InnoChatterApiError } from '../../../src/error/innoChatterApiError';

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {
        authToken: 'valid-token',
      },
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should set id in the request if the token is valid', async () => {
    const mockVerify = jest.spyOn(jwt, 'verify');
    mockVerify.mockReturnValue({ id: 'test-user-id' } as any); // Set a valid decoded token
    await AuthMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);
    // @ts-ignore
    expect(mockRequest.myId).toBe('test-user-id');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw an error if the token is invalid', async () => {
    const mockVerify = jest.spyOn(jwt, 'verify');
    mockVerify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    await expect(
      AuthMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext)
    ).rejects.toThrow(InnoChatterApiError);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with an InnoChatterApiError for missing authToken', async () => {
    mockRequest.cookies = {};

    try {
      await AuthMiddleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);
      fail('Expected an error to be thrown');
    } catch (error) {
      // @ts-ignore
      expect(mockRequest.myId).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith(new InnoChatterApiError('Please Login First', 400));
    }
  });
});
