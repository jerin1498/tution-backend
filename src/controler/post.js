const multer = require("multer");
const path = require("path");
const catchAsync = require("../handlers/catchAsync");
const AppError = require("../handlers/appError");
const postService = require("../services/post");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(__dirname, "../", "../", "public", "posts");
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.userName}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  // filtering only images
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images", 400), false);
  }
};

const multerPostHandler = multer({
  storage: storage,
  fileFilter: multerFilter,
});

exports.uploadPost = multerPostHandler.single("file");

exports.CreatePost = catchAsync(async (req, res) => {
  const { discription, title } = req.body;
  if (!discription || !title)
    throw new AppError("title and discription fields needed");
  const user = req.user.id;
  const fileUrl = `/posts/${req.file.filename}`;
  const data = {
    discription,
    title,
    fileUrl,
    user,
  };
  const post = await postService.create(data);

  return res
    .status(201)
    .send({ data: { post }, message: "New post created successfully" });
});

exports.findOnePostById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const post = await postService.findOne({ _id: id });
  return res
    .status(200)
    .send({ data: { post }, message: "post fetch sucessfully" });
});

exports.findAllPosts = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const params = {};
  if (userId) params.user = userId;
  const posts = await postService.findAll(params);
  return res
    .status(200)
    .send({ data: { posts }, message: "post fetch sucessfully" });
});

exports.deletePost = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const post = await postService.findOne({ _id: postId });

  if (post.user.id !== userId)
    throw new AppError("you are not the owner of the post", 401);
  console.log(post);
  const folderpath = path.join(__dirname, "../", "../", "public");
  const filepath = `${folderpath}/${post.fileUrl}`;
  fs.unlinkSync(filepath);
  await post.remove();

  return res.status(200).send({ message: "file deleted successfully" });
});
