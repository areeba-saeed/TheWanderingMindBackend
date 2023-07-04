const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: Number,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
          default: 1,
        },
        price: Number,
      },
    ],
    lotteryCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
