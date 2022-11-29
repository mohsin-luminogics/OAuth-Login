// routes/auth.js
import express from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

var router = express.Router();

// Perform the login, after login Auth0 will redirect to callback
router.post(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/callback", async function (req, res) {
  console.log("i am in callback");
  console.log(await passport.authenticate("auth0"));
  res.redirect("/");
});
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("layout", { title: "Auth0 Webapp sample Nodejs" });
});
export default router;
