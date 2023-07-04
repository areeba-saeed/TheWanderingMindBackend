const express = require("express");
const cartRouter = express.Router();
const {
  get_cart_items,
  add_cart_item,
  delete_item,
  delete_all_items,
} = require("../controller/cartControllers");

cartRouter.get("/cart/:id", get_cart_items);
cartRouter.post("/addcart/:id", add_cart_item);
cartRouter.delete("/delete/:userId/:itemId", delete_item);
cartRouter.delete("/delete/:userId", delete_all_items);

module.exports = cartRouter;
