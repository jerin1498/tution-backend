const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is must"],
      trim: true,
    },
    discription: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, "fileUrl is must field"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user field is must"],
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre(/^find/, function (next) {
  const post = this;
  post.populate({
    path: "user",
    select: "userName",
  });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
