import express, { type Application } from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import { generateSessionKey } from "./utils/helpers";
import passport from "passport";
import session from "express-session";
import { SESSION_EXPIRY_DATE, SESSION_SECRET } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./router";

export default function createApp(): Application {
  const app = express();
  const SESSION_KEY = generateSessionKey();

  app.use(express.json());

  app.use(
    cookieSession({
      name: "session",
      keys: [SESSION_KEY],
      maxAge: SESSION_EXPIRY_DATE,
      secure: true,
      httpOnly: true,
    })
  );

  app.use(cookieParser(SESSION_KEY));

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: SESSION_EXPIRY_DATE,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/api", router());

  app.use(errorHandler);

  return app;
}
