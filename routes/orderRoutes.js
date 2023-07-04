const express = require("express");
const orderRoutes = express.Router();

const { getOrders, setorder } = require("../controller/orderControllers");

// Orders

orderRoutes.route("/orders/:id").get(getOrders);
orderRoutes.route("/order").post(setorder);

module.exports = orderRoutes;
