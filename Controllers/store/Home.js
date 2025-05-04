const Home = require("../../models/Home");
const User = require("../../models/user");
const populate = require("mongoose").populate;
const includes = require("mongoose").includes;

exports.getHome = (req, res, next) => {
  Home.find().then((homeRegistred) => {
    res.render("store/home-list", {
      homeRegistred: homeRegistred,
      pageTitle: "Airbnb Home",
      currentPage: "HomeList",
      isLoggedIn: req.isLoggedIn,
    });
  });
};
exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/store/favourite-list");
};
exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  console.log("user id in favourite list", userId);
  const user = await User.findById(userId).populate("favourites");
  const favouriteHome = user.favourites;

  res.render("store/favourite-list", {
    favouriteHome: favouriteHome,
    pageTitle: "Favourite List",
    currentPage: "Favourite",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came from body", homeId);
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter((home) => home != homeId);
    await user.save();
  }
  res.redirect("/store/favourite-list");
};

exports.getReserve = (req, res, next) => {
  Home.find().then((homeRegistred) => {
    res.render("store/reserve", {
      home: homeRegistred,
      pageTitle: "Reserve",
      currentPage: "Reserve",
      isLoggedIn: req.isLoggedIn,
    });
  });
};
exports.getBooking = (req, res, next) => {
  Home.find().then((homeRegistred) => {
    res.render("store/booking", {
      homeRegistred: homeRegistred,
      pageTitle: "Booking",
      currentPage: "Booking",
      isLoggedIn: req.isLoggedIn,
    });
  });
};
exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;

  Home.findById(homeId).then((home) => {
    console.log("homedetails found : ", home);
    if (!home) {
      res.redirect("/");
      console.log("home not found");
    } else {
      res.render("store/home-details", {
        home: home,

        pageTitle: "Details",
        currentPage: "Details",
        isLoggedIn: req.isLoggedIn,
      });
    }
  });
};
