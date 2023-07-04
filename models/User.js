const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  addressId: {
    type: Number,
    required: true,
  },
});
// Create Schema
const UserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  addresses: [addressSchema],
  phoneNo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
});
module.exports = User = mongoose.model("Users", UserSchema);
