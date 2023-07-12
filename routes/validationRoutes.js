const express = require("express");
const validationRouter = express.Router();
const {
  validationLogin,
  validationRegister,
} = require("../controller/validationController");

validationRouter.post("/register", validationRegister);
validationRouter.post("/login", validationLogin);

module.exports = validationRouter;
