const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    urlName: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", BlogSchema);
