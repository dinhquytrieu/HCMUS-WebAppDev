const app = require("./app");
const database = require("../config/db.config");
require("dotenv").config();

database.connect();
const port = process.env.MAIN_PORT || 3000;
app.listen(port, "127.0.0.1", () => {
  console.log(`Main app is running on port ${port} ...`);
});