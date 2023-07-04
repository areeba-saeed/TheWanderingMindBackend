const express = require("express");
const bookRoutes = express.Router();
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
    cb(null, "assets/books");
  },
  filename: function (req, file, cb) {
    cb(null, generateUniqueFilename(file));
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};
let upload = multer({ storage, fileFilter });

const {
  getBooksById,
  getBooks,
  getBooksByCategory,
  setBook,
  updateBook,
  deleteBook,
  uploadImage,
  deleteBookImage,
} = require("../controller/booksController");

// Books
bookRoutes.route("/:id").get(getBooksById).patch(updateBook).delete(deleteBook);
bookRoutes.route("/").get(getBooks).post(setBook);
bookRoutes.route("/byCategory/:category").get(getBooksByCategory);
bookRoutes.route("/bookImage/:id").patch(upload.single("image"), uploadImage);
bookRoutes.route("/bookImage/:id/:index").delete(deleteBookImage);

const imagesDir = path.join(__dirname, "../assets/books");
bookRoutes.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imagesDir, imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.send("Image not found");
    }
  });
});

module.exports = bookRoutes;
