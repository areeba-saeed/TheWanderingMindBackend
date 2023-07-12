const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authors",
    },

    description: {
      type: String,
    },
    price: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Books", BookSchema);
