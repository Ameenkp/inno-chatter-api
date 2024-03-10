// app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './middlewear/errorHandler';
import * as http from 'http';
import path from 'path';
import { MessengerRouter } from './routes/messengerRoutes';
import { AuthRouter } from './routes/authRouter';
import cookieParser from 'cookie-parser';

export class App {
  private readonly app: Application;
  private readonly server: http.Server;
  private readonly io: Server;
  private readonly errorHandler: ErrorHandler;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
    this.errorHandler = new ErrorHandler();
    this.appConfig();
    this.routeMountings();
    // PassportConfig.configure();
    this.serveStaticFiles();
    this.errorMiddleware();
  }

  /**
   * A function that configures the app for development environment, adding middleware for logging, CORS, JSON and URL encoding, and cookie parsing.
   *
   * @param {void} - This function does not take any parameters
   * @return {void} - This function does not return any value
   */
  private appConfig(): void {
    if ((process.env.NODE_ENV as string) !== 'production') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  /**
   * A description of the entire function.
   *
   * @param {void} No parameters
   * @return {void} No return value
   */
  private routeMountings(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('THis is from backend server');
    });

    this.app.use('/api/messenger', new AuthRouter().getRouter());
    this.app.use('/api/messenger', new MessengerRouter().getRouter());
  }

  private serveStaticFiles(): void {
    const staticFilesDir = path.join(__dirname, '../public');
    this.app.use(express.static(staticFilesDir));
  }

  /**
   * A middleware function to handle errors.
   *
   * @param {Error} err - The error object
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function
   * @return {void}
   */
  private errorMiddleware(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      return this.errorHandler.internalServerError(err, res, next);
    });
  }

  public getIO(): Server {
    return this.io;
  }
  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
