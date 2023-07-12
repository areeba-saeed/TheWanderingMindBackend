const mongoose = require("mongoose");

const Contact = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("Contact", Contact);
