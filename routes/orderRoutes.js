const express = require("express");
const orderRoutes = express.Router();

const {
  getOrders,
  getUserOrders,
  setorder,
  getOrdersCart,
  updateOrder,
  deleteOrder,
} = require("../controller/orderControllers");

// Orders

orderRoutes.route("/").get(getOrders).post(setorder);
orderRoutes.route("/checkout/:id").get(getOrdersCart);
orderRoutes
  .route("/:id")
  .get(getUserOrders)
  .patch(updateOrder)
  .delete(deleteOrder);

module.exports = orderRoutes;
