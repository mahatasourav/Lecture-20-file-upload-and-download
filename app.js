const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const { userRouter } = require("./Routes/userRouter");
const { hostRouter } = require("./Routes/hostRouter");

const { authRouter } = require("./Routes/authRouter");
const path = require("path");
const rootdir = require("./utils/pathUtils");

const app = express();
const errorController = require("./Controllers/Error");
require("dotenv").config();

const { default: mongoose } = require("mongoose");
const DB_PATH = process.env.MONGODB_URI || "mongodb://localhost:27017/yourDB";
//telling that we are using ejs in views
app.use(express.static(path.join(rootdir, "public")));
app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  }
  next();
});

app.set("view engine", "ejs");
app.set("views", "views");
const store = new mongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn; // setting isLoggedIn in request object
  next();
});
app.use("/auth", authRouter);

app.use("/", userRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});
app.use("/host", hostRouter);
app.use(express.static(path.join(rootdir, "public")));

app.use(errorController.Error404);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("connected to mongoDB");

    app.listen(PORT, () => {
      console.log(`server running at https://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error while connecting monogoose", err);
  });
