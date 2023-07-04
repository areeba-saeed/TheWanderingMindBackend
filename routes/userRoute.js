const express = require("express");
const userRoutes = express.Router();

const {
  updateUser,
  getUser,
  addAddress,
  deleteAddress,
  updateAddress,
} = require("../controller/userController");

// Users
userRoutes.route("/:id").get(getUser).put(updateUser);
userRoutes.route("/addresses/:id").post(addAddress);
userRoutes
  .route("/addresses/:id/:addressId")
  .delete(deleteAddress)
  .put(updateAddress);

module.exports = userRoutes;
