const express = require("express");
const authRouter = express.Router();

const authController = require("../Controllers/auth/auth");

//login router
authRouter.get("/login", authController.getLoginPage);
authRouter.post("/login", authController.postLoginPage);

//signup router
authRouter.get("/signup", authController.getSignupPage);
authRouter.post("/signup", authController.postSignupPage);

//logout router
authRouter.post("/logout", authController.postLogout);

exports.authRouter = authRouter;
