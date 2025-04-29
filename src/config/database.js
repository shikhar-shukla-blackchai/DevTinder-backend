const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dbNode:shikharshukla123@namastenode.bktopm2.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
