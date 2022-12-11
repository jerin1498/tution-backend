const router = require("express").Router();
const commentController = require("../controler/comment");
const { protect } = require("../middlewares/auth");

router.post("/", protect, commentController.createComment);
router.get("/:postId", commentController.getAllComment);

module.exports = router;
