// src/config/Mongoose.test.ts
import mongoose from 'mongoose';
import { MongooseConfig } from '../../../src/config/mongoose.mw';
import {Constants} from "../../../src/config/constants";

jest.mock('mongoose');

describe('MongooseConfig', () => {
  it('should connect to the local database successfully', async () => {
    const mockConnectionString = 'mongodb://localhost:27017';
    const mockDbName = Constants.MONGO_DB_NAME
    const mockConnectionResult = 'mockedConnectionResult';

    (mongoose.connect as jest.Mock).mockResolvedValue(mockConnectionResult);
    const result = await MongooseConfig.connectToLocalDB();
    expect(mongoose.connect).toHaveBeenCalledWith(mockConnectionString,{"dbName": mockDbName});
    expect(result).toBe(mockConnectionResult);
  });

  it('should handle DB connection failure', async () => {
    const mockError = new Error('Mocked DB connection error');
    (mongoose.connect as jest.Mock).mockRejectedValue(mockError);
    await expect(MongooseConfig.connectToLocalDB()).rejects.toThrow('Internal Server Error');
  });
});
