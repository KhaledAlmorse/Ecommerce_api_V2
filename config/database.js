const mongoose = require("mongoose");

const dbConnection = () => {
  //connected with db
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`DataBase Connected on ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
