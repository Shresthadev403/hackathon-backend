const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.set('strictQuery',true);
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
      console.log("connected to database");
    });
};

module.exports = connectDatabase;