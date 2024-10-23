const mongoose = require("mongoose");

const connectDB = async function () {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `The server is connected to the DB name ${conn.connection.name} at host ${conn.connection.host}.`
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
