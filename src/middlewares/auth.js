const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../handlers/catchAsync");
const AppError = require("../handlers/appError");
const userService = require("../services/user");

const jwtSecret = process.env.JWT_SECRET || "justTestingSecret123";

exports.currentUser = catchAsync(async (req, res, next) => {
  //1) getting token and check is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token || token === "logout") {
    return next();
  }
  //2) verification token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, jwtSecret);
  } catch (err) {
    return next();
  }
  //3) checking if user still exists
  const currentUser = await userService.findOne({ _id: decoded.id });
  if (currentUser) {
    // authenticated success
    req.user = currentUser;
    res.locals.user = currentUser; // getting data in template 'pug'
  }

  return next();
});

exports.protect = (req, res, next) => {
  if (!req.user) {
    throw new AppError(
      "you are not authenticated please login to use this resource",
      401
    );
  }
  return next();
};
