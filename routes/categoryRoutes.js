const express = require("express");
const categoryRoutes = express.Router();

const {
  getCategories,
  setCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryControllers");

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
    cb(null, "assets/category");
  },
  filename: function (req, file, cb) {
    cb(null, generateUniqueFilename(file));
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};
let upload = multer({ storage, fileFilter });

// Categories
categoryRoutes
  .route("/")
  .get(getCategories)
  .post(upload.single("image"), setCategory);
categoryRoutes
  .route("/:id")
  .patch(upload.single("image"), updateCategory)
  .delete(deleteCategory);

const imagesDir = path.join(__dirname, "../assets/category");
categoryRoutes.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imagesDir, imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.send("Image not found");
    }
  });
});

module.exports = categoryRoutes;
