const { check, validationResult } = require("express-validator");
const user = require("../../models/user");
const bcrypt = require("bcryptjs");

exports.getLoginPage = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    isLoggedIn: false,
    errorMessage: [],
    oldInput: {
      email: "",
      password: "",
    },
  });
};
exports.postLoginPage = async (req, res, next) => {
  const { email, password } = req.body; // destructuring email and password from request body
  const User = await user.findOne({ email: email }); // finding user by email
  if (!User) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: ["Invalid email "],
      oldInput: { email },
    });
  }
  const isMatch = await bcrypt.compare(password, User.password); // comparing password with hashed password
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: ["Invalid email or password"],
      oldInput: { email },
    });
  }
  req.session.isLoggedIn = true; // setting isLoggedIn in session
  req.session.user = User; // setting user in session
  await req.session.save();
  res.redirect("/"); // redirecting to home page after login
};

//signup controllers
exports.getSignupPage = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup Page",
    isLoggedIn: false,
    errorMessage: [], // initializing errorMessage to null

    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
    },
  });
};
exports.postSignupPage = [
  check("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("First name must contain only letters"),

  check("lastName")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Last name must contain only letters"),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Please select a valid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions"),

  (req, res, next) => {
    const errors = validationResult(req); // checking for validation errors
    const [firstName, lastName, email, password, confirmPassword, userType] = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.confirmPassword,
      req.body.userType,
    ];
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        isLoggedIn: false,
        errorMessage: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          userType,
        },
      });
    }

    bcrypt
      .hash(req.body.password, 12)
      .then((hashedPassword) => {
        const User = new user({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword, // storing hashed password in database
          userType: userType,
        });
        return User.save(); // saving user in database
      })
      .then(() => {
        res.redirect("/auth/login"); // redirecting to login page after signup
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          isLoggedIn: false,
          errorMessage: [err.message],
          oldInput: {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            userType,
          },
        });
      });
  },
  // setting isLoggedIn in session
  // redirecting to home page after signup
];

//logout controllers
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });
  req.session = null; // destroying the session
  res.redirect("/auth/login"); // redirecting to login page after logout
};
