import express from "express";
import { Request, Response, NextFunction } from "express";
var router = express.Router();
/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("layout", { title: "Auth0 Webapp sample Nodejs" });
});
export default router;
