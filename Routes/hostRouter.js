const express = require("express");
const hostRouter = express.Router();

const homeController = require("../Controllers/host/HostHome");

hostRouter.get("/add-home", homeController.getAddHome);
hostRouter.post("/add-home", homeController.postAddHome);
hostRouter.get("/", homeController.getHostHomeList);
hostRouter.get("/edit-home", homeController.getEditHome);
hostRouter.get("/editAddHome/:homeId", homeController.getEditHomeDeatils);
hostRouter.post("/edit-home", homeController.postEditHome);
hostRouter.post("/delete-home/:homeId", homeController.postDeleteHome);
exports.hostRouter = hostRouter;
