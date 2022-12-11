const express = require("express");
const router = express.Router();
const userController = require("../controler/user");
const { protect } = require("../middlewares/auth");

router.post("/", userController.signUp);
router.post("/login", userController.logIn);

router.get("/test", protect, (req, res) => {
  return res.status(200).send("you accessed proteceted data");
});

module.exports = router;
