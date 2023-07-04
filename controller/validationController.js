const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const User = require("../models/User");
const validateRegisterInput = require("../validation/Register");
const validateLoginInput = require("../validation/Login");

require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

// Register

const validationRegister = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).send("Email already exists");
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires after 10 minutes
      const newUser = new User({
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        addresses: req.body.addresses,
        phoneNo: req.body.phoneNo,
        otp,
        otpExpiresAt,
        isVerified: true,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          const msg = {
            to: newUser.email,
            from: `areebamuhammadsaeed@gmail.com`,
            subject: "Email Verification OTP",
            text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
          };

          sgMail.send(msg);

          setTimeout(() => {
            newUser.otp = null;

            newUser.save();
          }, 10 * 60 * 1000);
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

// Login

const validationLogin = (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).send("Please fill all the fields");
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).send("Email not found");
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).send("User not verified");
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          userId: user.userId, // Add user ID to payload
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            if (err) {
              console.log(err);
            } else {
              // Add headers to the response
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE"
              );
              res.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
              );
              res.json({
                success: true,
                token: "Bearer " + token,
                user: {
                  userId: user.userId,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          }
        );
      } else {
        return res.status(400).send("Password incorrect");
      }
    });
  });
};

// Get user
const getUserValidation = (req, res) => {
  const email = req.query.email;

  // Find the user data that matches the userId
  User.find({ email: email }, function (err, userData) {
    if (err) throw err;

    // Pass the user data to the response object
    res.json(userData);
  });
};
const getUserValidationByEmail = async (req, res) => {
  const userId = req.params.id;

  // Find the user data that matches the userId
  User.find({ userId: userId }, function (err, userData) {
    if (err) throw err;

    // Pass the user data to the response object
    res.json(userData);
  });
};

const verifyEmail = async (req, res) => {
  const { id } = req.params;

  const otp = req.body.otp;
  try {
    const user = await User.find({ userId: id });
    if (user[0].otp !== otp && user[0].otp !== null) {
      return res.status(404).send("Otp invalid");
    }
    if (user[0].otp !== otp && user[0].otp === null) {
      return res.status(404).send("Otp expired");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

  // try {
  //   res.send("Successful");
  // } catch (error) {
  //   console.log(error);
  // }
};
const resendEmail = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires after 10 minutes
  const email = req.body.email;
  const userId = req.params.id;
  try {
    const user = await User.findOneAndUpdate(
      { userId: userId },
      {
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
      { new: true }
    );
    const msg = {
      to: email,
      from: `areebamuhammadsaeed@gmail.com`,
      subject: "Email Verification OTP",
      text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
    };
    sgMail.send(msg);
    setTimeout(() => {
      user.otp = null;
      user.save();
    }, 60 * 10 * 1000);
    res.json(user.otp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  validationLogin,
  validationRegister,
  getUserValidation,
  verifyEmail,
  resendEmail,
  getUserValidationByEmail,
};
