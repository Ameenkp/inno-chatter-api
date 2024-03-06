import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export class Constants {
    public static PORT: number = Number(process.env.PORT || 3000);
    public static MONGO_URI_LOCAL: string = String(process.env.MONGODB_URI_LOCAL);
    public static MONGO_DB_NAME: string = String(process.env.MONGO_DB_NAME);
    // Add other constants as needed
}