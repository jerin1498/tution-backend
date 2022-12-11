const userService = require("../services/user");
const catchAsync = require("../handlers/catchAsync");
const AppError = require("../handlers/appError");
const jwt = require("jsonwebtoken");

const jwtSectet = process.env.JWT_SECRET || "justTestingSecret123";

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password, userName } = req.body;
  if (!email || !password || !userName)
    throw new AppError("please provide all the required fields", 400);
  const existingUser = await userService.findOne({ email });
  if (existingUser)
    throw new AppError("User already exists with this email", 400);
  const uniqueName = await userService.findOne({ userName });
  if (uniqueName)
    throw new AppError(
      "User name already exists please select other user Name",
      400
    );
  const newUser = await userService.create({ email, password, userName });
  const token = jwt.sign(
    {
      id: newUser._id,
    },
    jwtSectet
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in milliseconds
    httpOnly: true, // do not allow browser to modify the cookie
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // only send https protocol
  res.cookie("jwt", token, cookieOptions);

  return res.status(201).send({
    data: {
      user: newUser,
      token: token,
    },
    message: "new user created successfully",
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError("please provide email and password", 400);
  const user = await userService.findOne({ email }).select("+password");
  if (!user || !(await user.isCorrectPassword(password, user.password)))
    throw new AppError("invalid email or password");

  const token = jwt.sign(
    {
      id: user._id,
    },
    jwtSectet
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in milliseconds
    httpOnly: true, // do not allow browser to modify the cookie
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true; // only send https protocol
  res.cookie("jwt", token, cookieOptions);

  return res.status(200).send({
    data: {
      user: user,
      token: token,
    },
    message: "Login successfully",
  });
});
