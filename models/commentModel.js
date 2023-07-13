const mongoose = require("mongoose");

const Comments = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blogs",
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model("Comments", Comments);
