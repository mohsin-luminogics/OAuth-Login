import express, { NextFunction } from "express";
import { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import authRouter from "./routes/auth";
import indexRouter from "./routes/index";
const Auth0Strategy = require("passport-auth0");

dotenv.config();

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback",
  },
  function (
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
    done: any
  ) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);
// You can use this section to keep a smaller payload
passport.serializeUser(function (user: Express.User, done) {
  done(null, user);
});
passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});
const app = express();
app.get("/test", (req: Request, res: Response) => {
  res.send({ message: "Server is on" });
});
// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// config express-session
var sess: session.SessionOptions = {
  secret: "CHANGE THIS TO A RANDOM SECRET",
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

if (app.get("env") === "production") {
  // Use secure cookies in production (requires SSL/TLS)
  if (sess.cookie) sess.cookie.secure = true;
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", authRouter);
app.use("/", indexRouter);
// Handle auth failure error messages
app.use(function (req, res, next) {
  const err: any = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  res.send({ message: err.message, error: {} });
});
app.listen(3000, () => {
  console.log("Server is runnig on port 3000");
});
module.exports = app;
