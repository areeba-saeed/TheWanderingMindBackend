const Blogs = require("../models/blogModel");
const fs = require("fs");
const path = require("path");
const Commnets = require("../models/commentModel");
const Categories = require("../models/categoryModel");

// Get all Blogs
const getBlogs = async (req, res) => {
  const blogs = await Blogs.find().populate("category").populate("user");
  res.json(blogs);
};

// Get Blogs by id
const getBlogsById = async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blogs.findById(id)
      .populate("category")
      .populate("user");

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
// Get Blogs by url
const getBlogsByUrlName = async (req, res) => {
  const { urlName } = req.params;
  try {
    const blogs = await Blogs.findOne({ urlName })
      .populate("category")
      .populate("user");

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Get Blogs by category name
const getSimilarBlogs = async (req, res) => {
  const { category, urlName } = req.params;
  try {
    const blogs = await Blogs.find({
      category: category,
      urlName: { $ne: urlName },
    }).populate("user");
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
// Get Blogs by category name
const getBlogsByCategory = async (req, res) => {
  const { urlName } = req.params;
  try {
    const category = await Categories.findOne({ urlName: urlName });
    const blogs = await Blogs.find({
      category: category._id,
    })
      .populate("user")
      .populate("category");
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
// Get Blogs by category name
const getBlogsByUser = async (req, res) => {
  const { user } = req.params;
  try {
    const blogs = await Blogs.find({
      user: user,
    }).populate("user");
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Post order
const setBlog = async (req, res) => {
  const { category, name, description, user } = req.body;
  const image = req.file ? req.file.filename : null;
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  try {
    // Check if product with same name and category already exists
    const existingBlog = await Blogs.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
    });
    if (existingBlog) {
      return res.status(404).send("Blog already exists");
    }
    if (!image) {
      return res.status(404).send("Must add image");
    }
    const newBlog = new Blogs({
      name,
      category,
      user,
      urlName,
      description,
      image,
    });
    newBlog.save();
    res.json(newBlog);
  } catch (error) {
    res.json(error);
  }
};

// Update User
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { name, description, category } = req.body;
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  try {
    const blog = await Blogs.findById(id);

    const previousImage = blog.image;
    let image;
    // Check if a new image is provided
    if (req.file) {
      // Delete the previous image if it exists
      if (previousImage) {
        const imagePath = path.join(
          __dirname,
          "../assets/blogs",
          previousImage
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      // Set the new image filename
      image = req.file.filename;
    }
    const updated = await Blogs.findByIdAndUpdate(
      id,
      { name, description, category, urlName, image },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blogs.findById(id);

    if (blog.image != null) {
      const imagePath = path.resolve(__dirname, "../assets/blogs", blog.image);
      await new Promise((resolve, reject) => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image file:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    await Commnets.deleteMany({ blog: id });
    // Delete the blog from the database
    await Blogs.findByIdAndDelete(id);
    return Blogs.find();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting blog");
  }
};

module.exports = {
  getBlogsById,
  getBlogsByUrlName,
  getBlogs,
  getBlogsByCategory,
  getSimilarBlogs,
  getBlogsByUser,
  setBlog,
  updateBlog,
  deleteBlog,
};
