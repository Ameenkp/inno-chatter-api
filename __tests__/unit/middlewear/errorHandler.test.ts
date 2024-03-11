import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../src/middlewear/errorHandler';

describe('ErrorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle internal server errors', () => {
    const err = new Error('Something went wrong');
    const errorHandler = new ErrorHandler();

    errorHandler.internalServerError(err, mockResponse as any, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errorMessage: ['Internal Server Error'],
      message: 'Something went wrong',
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle verification errors', () => {
    const err = new Error('Invalid token');
    const errorHandler = new ErrorHandler();

    errorHandler.handleVerificationError(err, mockResponse as any, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        errorMessage: ['Invalid Token'],
      },
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle no auth token errors', () => {
    const err = new Error('Please Login First');
    const errorHandler = new ErrorHandler();

    errorHandler.handleNoAuthTokenError(err, mockResponse as any, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        errorMessage: ['Please Login First'],
      },
    });
    expect(mockNext).toHaveBeenCalled();
  });
});
