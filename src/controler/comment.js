const path = require("path");
const catchAsync = require("../handlers/catchAsync");
const AppError = require("../handlers/appError");
const commentService = require("../services/comment");

exports.createComment = catchAsync(async (req, res) => {
  const { postId, comment } = req.body;
  if (!postId || !comment)
    throw new AppError("postId and comment are required fields", 400);
  const userId = req.user.id;
  const data = {
    user: userId,
    post: postId,
    comment,
  };
  const newComment = await commentService.create(data);
  return res.status(201).send({
    data: { comment: newComment },
    message: "comment successfully created",
  });
});

exports.getAllComment = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const comments = await commentService.findAll({ post: postId });
  return res
    .status(200)
    .send({ data: { comments }, message: "fetch comment successfully" });
});

exports.deleteComment = catchAsync(async (req, res) => {});

exports.updateComment = catchAsync(async (req, res) => {});
