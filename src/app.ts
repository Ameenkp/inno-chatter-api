// app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './middlewear/errorHandler';
import * as http from 'http';
import path from 'path';
import { MessengerRouter } from './routes/messengerRoutes';
import { AuthRouter } from './routes/authRouter';
import cookieParser from 'cookie-parser';
import { SocketServer } from './socket';
import { InnoChatterApiError } from './error/innoChatterApiError';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from '../swaggerOptions';
import { Constants } from './config/constants';

export class App {
  public readonly app: Application;
  readonly server: http.Server;
  private readonly errorHandler: ErrorHandler;
  private readonly socketServer: SocketServer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.errorHandler = new ErrorHandler();
    this.appConfig();
    this.socketServer = new SocketServer(this.server);
    this.setupSwagger();
    this.routeMountings();
    this.serveStaticFiles();
    this.errorMiddleware();
  }

  /**
   * A function that configures the app for development environment,
   * adding middleware for logging, CORS, JSON and URL encoding, and cookie parsing.
   *
   * @param {void} - This function does not take any parameters
   * @return {void} - This function does not return any value
   */
  public appConfig(): void {
    if ((process.env.NODE_ENV as string) !== 'production') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  /**
   *  It attaches a route for the root URL that responds with a simple message,
   *  and also mounts two routers under the /api/messenger path.
   */
  public routeMountings(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('This is from backend server');
    });

    this.app.use('/api/messenger', new AuthRouter().getRouter());
    this.app.use('/api/messenger', new MessengerRouter().getRouter());
  }

  public serveStaticFiles(): void {
    const staticFilesDir = path.join(__dirname, '../public');
    this.app.use(express.static(staticFilesDir));
  }

  /**
   * Set up Swagger documentation.
   */
  public setupSwagger(): void {
    const specs = swaggerJSDoc(swaggerOptions);
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        customCssUrl: Constants.CUSTOME_SWAGGER_CSS_URL,
      })
    );
  }

  /**
   * A middleware function to handle errors.
   */
  public errorMiddleware(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof InnoChatterApiError && err.status === 401) {
        return this.errorHandler.handleVerificationError(err, res, next);
      }
      if (err instanceof InnoChatterApiError && err.status === 400) {
        return this.errorHandler.handleNoAuthTokenError(err, res, next);
      }
      return this.errorHandler.internalServerError(err, res, next);
    });
  }
  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
