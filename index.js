const app = require("./app");
const dotenv = require("dotenv");
const error=require('./middlewares/error');
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/connectDatabase");

dotenv.config({ path: "./config/.env" });
port = process.env.PORT || 8000;

//connecting to database
connectDatabase();
// app.use(error);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//handling uncaught exception (console.log(you);)
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("shutting down the server due to uncaught exception");
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

// handling unhandeled promise rejection/mongodb parse error
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("shutting down the server due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});