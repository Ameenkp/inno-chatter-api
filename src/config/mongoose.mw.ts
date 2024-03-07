// src/config/Mongoose.ts
import mongoose, { ConnectOptions } from 'mongoose';
import { Constants } from './constants';

export class MongooseConfig {
  static async connectToLocalDB() {
    try {
      const connectionString = `${Constants.MONGO_URI_LOCAL}`;
      return await mongoose.connect(connectionString, {
        dbName: Constants.MONGO_DB_NAME,
      });
    } catch (error) {
      throw new Error('Failed to connect to DB , check your connection string');
    }
  }
}
