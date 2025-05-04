const Home = require("../../models/Home");
exports.getAddHome = (req, res, next) => {
  res.render("host/editAddHome", {
    pageTitle: "Add Home page",
    currentPage: "AddHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
  });
};

exports.postAddHome = (req, res, next) => {
  const { homename, price, location, image, Rating, description } = req.body;
  if (!price || isNaN(price)) {
    return res.status(400).json({ error: "Price must be a valid number" });
  }
  console.log("coming hereeeeeeeeeeeeeeeeeeee");
  const home = new Home({
    homename,
    price,
    location,
    image,
    Rating,
    description,
  });

  home
    .save()
    .then(() => {
      console.log("Home Saved sucessfully");
      res.redirect("/host");
    })
    .catch((error) => {
      console.log("error", error);
      res.redirect("/host");
    });
};
exports.getHostHomeList = (req, res, next) => {
  Home.find().then((homeRegistred) => {
    res.render("host/host-home-list", {
      homeRegistred: homeRegistred,
      pageTitle: "Airbnb Home",
      currentPage: "HostHomeList",
      isLoggedIn: req.isLoggedIn,
    });
  });
};
exports.getEditHome = (req, res, next) => {
  Home.find().then((homeRegistred) => {
    res.render("host/edit-home", {
      homeRegistred: homeRegistred,
      pageTitle: "Edit Home",
      currentPage: "EditHome",
      isLoggedIn: req.isLoggedIn,
    });
  });
};

exports.getEditHomeDeatils = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing");
      return res.redirect("host/edit-home");
    }
    console.log(homeId, editing, home);
    res.render("host/editAddHome", {
      pageTitle: "Edit Your Home",
      currentPage: "EditHome",
      editing: editing,
      home: home,
      isLoggedIn: req.isLoggedIn,
    });
  });
};

exports.postEditHome = (req, res, next) => {
  const { id, homename, price, location, image, Rating, description } =
    req.body;

  Home.findById(id)
    .then((home) => {
      home.homename = homename;
      home.price = price;
      home.location = location;
      home.image = image;
      home.Rating = Rating;
      home.description = description;
      home
        .save()
        .then((result) => {
          console.log("Home Updated successfuly :", result);

          res.redirect("/host/edit-home");
        })
        .catch((error) => {
          console.log("error while updating home", error);
          res.redirect("/host/edit-home");
        });
    })
    .catch((error) => {
      console.log("error while updating home", error);
      res.redirect("/host/edit-home");
    });
};
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("came to delete........... ", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/edit-home");
    })
    .catch((error) => {
      if (error) {
        console.log("error while deleting home id :", homeId);
      }
    });
};
