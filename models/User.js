const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  nameOnCard: {
    type: String,
  },
  cvv: {
    type: String,
  },
  creditNumber: {
    type: String,
  },
  expiration: {
    type: String,
  },
  address2: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = User = mongoose.model("Users", UserSchema);
