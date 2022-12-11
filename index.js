const app = require("./app");
const dbConnection = require("./config/dbConfig");
const port = process.env.PORT || 3091;

async function connect() {
  try {
    await dbConnection();
    app.listen(port, () => console.log(`app is running at --> ${port}`));
  } catch (err) {
    console.log(err);
    throw err;
  }
}

connect();
