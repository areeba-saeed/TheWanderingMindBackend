const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const CartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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
  bill: {
    type: Number,
    default: 0,
  },
});
module.exports = User = mongoose.model("Cart", CartSchema);
