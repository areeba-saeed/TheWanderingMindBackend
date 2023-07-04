const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log(`Mongoose Connected`);
  } catch (error) {
    console.log(`Failed`, error);
  }
};

module.exports = {
  connectDB,
  secretOrKey: process.env.secretOrKey,
};
