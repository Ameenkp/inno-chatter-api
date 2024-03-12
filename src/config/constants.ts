import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export class Constants {
  public static readonly PORT: number = Number(process.env.PORT || 8000);
  public static readonly MONGO_URI_LOCAL: string = String(process.env.MONGODB_URI_LOCAL);
  public static readonly MONGO_DB_NAME: string = String(process.env.MONGO_DB_NAME);
  public static readonly JWT_SECRET: string = String(process.env.JWT_SECRET);
  public static readonly JWT_EXPIRATION: string = String(process.env.JWT_EXPIRATION);
  public static readonly COOKIE_EXPIRATION: number = Number(process.env.COOKIE_EXPIRATION);
  public static readonly CUSTOME_SWAGGER_CSS_URL: string =
    'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-monokai.css';

  // Add other constants as needed
}
