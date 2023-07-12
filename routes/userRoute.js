const express = require("express");
const userRoutes = express.Router();

const {
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} = require("../controller/userController");

// Users
userRoutes.route("/").get(getUsers);
userRoutes.route("/:id").get(getUser).put(updateUser);
userRoutes.route("/delete/:id").delete(deleteUser);

module.exports = userRoutes;
