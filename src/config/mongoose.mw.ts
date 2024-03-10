// src/config/Mongoose.ts
import mongoose, { ConnectOptions } from 'mongoose';
import { Constants } from './constants';

export class MongooseConfig {

  /**
   * Connects to the local database.
   *
   * @return {Promise} Promise that resolves with the connection to the local database.
   */
  static async connectToLocalDB(): Promise<any> {
    const connectionString = `${Constants.MONGO_URI_LOCAL}`;
    try {
      return await mongoose.connect(connectionString, {
        dbName: Constants.MONGO_DB_NAME,
      });
    } catch (error) {
      console.log(connectionString)
      console.log(error);
      throw new Error('Failed to connect to DB , check your connection string');
    }
  }
}
