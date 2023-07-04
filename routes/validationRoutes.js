const express = require("express");
const validationRouter = express.Router();
const {
  validationLogin,
  validationRegister,
  getUserValidation,
  verifyEmail,
  resendEmail,
  getUserValidationByEmail,
} = require("../controller/validationController");

// @route POST api/users/register
// @desc Register user
// @access Public
validationRouter.post("/register", validationRegister);
validationRouter.post("/verify/:id", verifyEmail);
validationRouter.route("/resend/:id").put(resendEmail);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
validationRouter.post("/login", validationLogin);

validationRouter.get("/:id", getUserValidation);
validationRouter.get("/byEmail", getUserValidationByEmail);

module.exports = validationRouter;
