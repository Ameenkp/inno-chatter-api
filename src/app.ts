import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { UserRoutes } from './routes/userRoutes';
import session from 'express-session';
import passport from 'passport';
import {PassportConfig} from "./config/passport.mw";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.appConfig();
    this.routeMountings();
    PassportConfig.configure();
  }

  private appConfig(): void {
    if ((process.env.NODE_ENV as string) !== 'production') {
      this.app.use(morgan('dev'));
    }
    this.app.use(
      session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(express.json());
  }

  private routeMountings(): void {
    this.app.use('/api/v1/user', new UserRoutes().getUserRouter());
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
