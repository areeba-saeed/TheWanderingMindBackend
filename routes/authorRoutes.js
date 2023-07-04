const express = require("express");
const {
  getAuthors,
  setAuthor,
  deleteAuthor,
  updateAuthor,
} = require("../controller/authorController");
const authorRoutes = express.Router();

authorRoutes.route("/").get(getAuthors).post(setAuthor);
authorRoutes.route("/:id").patch(updateAuthor).delete(deleteAuthor);

module.exports = authorRoutes;
