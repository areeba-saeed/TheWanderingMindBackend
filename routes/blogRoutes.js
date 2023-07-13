const express = require("express");
const blogRoutes = express.Router();
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
    cb(null, "assets/blogs");
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
  getBlogsById,
  getBlogs,
  getBlogsByCategory,
  setBlog,
  updateBlog,
  deleteBlog,
  getBlogsByUrlName,
  getSimilarBlogs,
  getBlogsByUser,
} = require("../controller/blogController");

// Blogs
blogRoutes
  .route("/:id")
  .get(getBlogsById)
  .patch(upload.single("image"), updateBlog)
  .delete(deleteBlog);
blogRoutes.route("/").get(getBlogs).post(upload.single("image"), setBlog);
blogRoutes.route("/byCategory/:urlName").get(getBlogsByCategory);
blogRoutes.route("/byCategory/:category/:urlName").get(getSimilarBlogs);
blogRoutes.route("/byUser/:user").get(getBlogsByUser);
blogRoutes.route("/find/:urlName").get(getBlogsByUrlName);

const imagesDir = path.join(__dirname, "../assets/blogs");
blogRoutes.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imagesDir, imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.send("Image not found");
    }
  });
});

module.exports = blogRoutes;
