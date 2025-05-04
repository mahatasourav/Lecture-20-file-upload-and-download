const express = require("express");
const userRouter = express.Router();

const homeController = require("../Controllers/store/Home");

userRouter.get("/", homeController.getHome);
userRouter.get("/store/favourite-list", homeController.getFavouriteList);
userRouter.get("/store/reserve", homeController.getReserve);
userRouter.get("/store/booking", homeController.getBooking);
userRouter.get("/store/home-details/:homeId", homeController.getHomeDetails);
userRouter.get("/store/favourite-list", homeController.getFavouriteList);
userRouter.post("/store/favourite", homeController.postAddToFavourite);
userRouter.post(
  "/store/favourite-list/delete/:homeId",
  homeController.postRemoveFromFavourite
);

exports.userRouter = userRouter;
