const express = require("express");
const userRoutes = express.Router();

const {
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} = require("../controller/userController");

const multer = require("multer");
const path = require("path");

function generateUniqueFilename(file) {
  const timestamp = Date.now();
  const originalName = file.originalname;
  const ext = path.extname(originalName);
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}${ext}`;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/users");
  },
  filename: function (req, file, cb) {
    cb(null, generateUniqueFilename(file));
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};
let upload = multer({ storage, fileFilter });

// Users
userRoutes.route("/").get(getUsers);
userRoutes.route("/:id").get(getUser).put(upload.single("image"), updateUser);
userRoutes.route("/delete/:id").delete(deleteUser);

module.exports = userRoutes;
