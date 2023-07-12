const express = require("express");
const cartRouter = express.Router();
const {
  get_cart_items,
  add_cart_item,
  delete_item,
  delete_all_items,
} = require("../controller/cartControllers");

cartRouter.get("/:id", get_cart_items);
cartRouter.patch("/addcart/:id/:productId", add_cart_item);
cartRouter.patch("/delete/:id/:productId", delete_item);
cartRouter.delete("/delete/:id", delete_all_items);

module.exports = cartRouter;
