const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const User = require("../models/User");
const Cart = require("../models/Cart");
require("dotenv").config();

// Register

const validationRegister = (req, res) => {
  const { name, email, password, phoneNo } = req.body;
  try {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.status(400).send("User already exists");
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
          phoneNo: phoneNo,
        });

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            const newCart = new Cart({
              userId: newUser._id,
            });
            newCart.save();
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  } catch (error) {
    res.json(error);
  }
};

// Login

const validationLogin = (req, res) => {
  // Form validation
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched

        res.json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
          },
        });
      } else {
        return res.status(400).send("Password incorrect");
      }
    });
  });
};

module.exports = {
  validationLogin,
  validationRegister,
};
