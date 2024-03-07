// src/config/Passport.ts
import passport, { Strategy } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { UserModel } from '../models/userModel';
import { NextFunction } from 'express';

export class PassportConfig {
  public static configure(): void {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      })
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await UserModel.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });
  }
}
