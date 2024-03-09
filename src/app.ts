// app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import socketIo, { Server } from 'socket.io';
import morgan from 'morgan';
import { UserRoutes } from './routes/userRoutes';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { PassportConfig } from './config/passport.mw';
import { ProfileRoutes } from './routes/profileRoutes';
import { Utils } from './utils/utils';
import MongoStore from 'connect-mongo';
import { Constants } from './config/constants';
import { ErrorHandler } from './middlewear/errorHandler';
import { SocketRouter } from './routes/socketRoutes';
import * as http from 'http';
import path from "path";

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
    PassportConfig.configure();
    this.serveStaticFiles();
    this.errorMiddleware();
  }

  private appConfig(): void {
    if ((process.env.NODE_ENV as string) !== 'production') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
    this.app.use(
      session({
        secret: Utils.uniqueKey(),
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: `${Constants.MONGO_URI_LOCAL}/${Constants.MONGO_DB_NAME}`,
        }),
        cookie: {
          httpOnly: false,
        }
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routeMountings(): void {
    // Other routes
    this.app.use('/api/v1/socket', new SocketRouter(this.io).getSocketRouter());
    this.app.use('/api/v1/user', new UserRoutes().getUserRouter());
    this.app.use('/api/v1/profile', new ProfileRoutes().getProfileRoutes());
  }

  private serveStaticFiles(): void {
    const staticFilesDir = path.join(__dirname, '../public');
    this.app.use(express.static(staticFilesDir));
  }

  private errorMiddleware(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      return this.errorHandler.internalServerError(err, res, next);
    });
  }
  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
