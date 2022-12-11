const express = require("express");
require("express-async-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const router = require("./src/router");
const globalErrorHandler = require("./src/handlers/errorController");
const AppError = require("./src/handlers/appError");
const { currentUser } = require("./src/middlewares/auth");

const app = express();

app.set("trust proxy", true);
app.use(morgan("combined"));

//serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(currentUser);
app.use("/user", router.user);
app.use("/post", router.post);
app.use("/comment", router.comment);

app.all("*", async (req, res, next) => {
  throw new AppError(`can't find ${req.originalUrl} on this server`, 404);
});

app.use(globalErrorHandler);

module.exports = app;
