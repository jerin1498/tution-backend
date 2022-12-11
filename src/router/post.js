const express = require("express");
const router = express.Router();
const postController = require("../controler/post");
const { protect } = require("../middlewares/auth");

router.post("/", protect, postController.uploadPost, postController.CreatePost);
router.get("/posts", postController.findAllPosts);
router.get("/:id", postController.findOnePostById);
router.delete("/:id", postController.deletePost);

module.exports = router;
