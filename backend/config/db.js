const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => {
      console.log(`monogdb connect to ${con.connection.host} successfully`);
    })
    .catch((err) => {
      console.log(`Error while connecting mongodb ${err}`);
    });
};
