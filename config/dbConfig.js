const mongoose = require("mongoose");

async function dbConnection() {
  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/tution";
  try {
    await mongoose.connect(dbUrl);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = dbConnection;
