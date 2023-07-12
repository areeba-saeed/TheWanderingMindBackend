const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    totalPrice: {
      type: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Books",
        },

        quantity: {
          type: Number,
        },
      },
    ],
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
