const express = require("express");
const validationRouter = express.Router();
const {
  validationLogin,
  validationRegister,
} = require("../controller/validationController");

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

validationRouter
  .route("/register")
  .post(upload.single("image"), validationRegister);
validationRouter.post("/login", validationLogin);

const imagesDir = path.join(__dirname, "../assets/users");
validationRouter.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imagesDir, imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.send("Image not found");
    }
  });
});

module.exports = validationRouter;
