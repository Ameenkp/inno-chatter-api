import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { UserRoutes } from './routes/userRoutes';
import session from 'express-session';
import passport from 'passport';
import { PassportConfig } from './config/passport.mw';
import { ProfileRoutes } from './routes/profileRoutes';
import { Utils } from './utils/utils';
import MongoStore from 'connect-mongo';
import { Constants } from './config/constants';
import {ErrorHandler} from "./middlewear/errorHandler";

export class App {
  private app: Application;

  private errorHandler: ErrorHandler;

  constructor() {
    this.app = express();
    this.errorHandler = new ErrorHandler();
    this.appConfig();
    this.routeMountings();
    PassportConfig.configure();
    this.errorMiddleware();
  }

  private appConfig(): void {
    if ((process.env.NODE_ENV as string) !== 'production') {
      this.app.use(morgan('dev'));
    }
    this.app.use(
      session({
        secret: Utils.uniqueKey(),
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: `${Constants.MONGO_URI_LOCAL}/${Constants.MONGO_DB_NAME}`,
        }),
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routeMountings(): void {
    this.app.use('/api/v1/user', new UserRoutes().getUserRouter());
    this.app.use('/api/v1/profile', new ProfileRoutes().getProfileRoutes());
  }


  private errorMiddleware(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      return this.errorHandler.internalServerError(err, res, next);
    });
  }
  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
