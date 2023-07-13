const express = require("express");
const categoryRoutes = express.Router();

const {
  getCategories,
  setCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryControllers");

// Categories
categoryRoutes.route("/").get(getCategories).post(setCategory);
categoryRoutes.route("/:id").patch(updateCategory).delete(deleteCategory);

module.exports = categoryRoutes;
