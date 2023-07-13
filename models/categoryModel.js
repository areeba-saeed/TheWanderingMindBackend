const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    urlName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
