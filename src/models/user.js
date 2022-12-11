const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is must"],
    unique: [true, "email must be unique"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password is must"],
    select: false,
  },
  userName: {
    type: String,
    required: [true, "userName is must"],
    unique: [true, "userName must be unique"],
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  // only run the function if the password is change
  if (!this.isModified("password")) return next();
  //hashing the password of strength 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isCorrectPassword = async function (
  rawPassword,
  hashedPassword
) {
  return await bcrypt.compare(rawPassword, hashedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
