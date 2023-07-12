const express = require("express");
const {
  getContacts,
  postContact,
  deleteContact,
  updateContact,
} = require("../controller/contactController");
const contactRoutes = express.Router();

contactRoutes.route("/").get(getContacts).post(postContact);
contactRoutes.route("/:id").patch(updateContact).delete(deleteContact);

module.exports = contactRoutes;
