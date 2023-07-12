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
  getBooksByUrlName,
} = require("../controller/booksController");

// Books
bookRoutes
  .route("/:id")
  .get(getBooksById)
  .patch(upload.single("image"), updateBook)
  .delete(deleteBook);
bookRoutes.route("/").get(getBooks).post(upload.single("image"), setBook);
bookRoutes.route("/byCategory/:category/:urlName").get(getBooksByCategory);
bookRoutes.route("/find/:urlName").get(getBooksByUrlName);

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
