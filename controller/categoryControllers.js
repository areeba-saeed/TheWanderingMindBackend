const Categories = require("../models/categoryModel");
const fs = require("fs");
const path = require("path");

// Get all categories
const getCategories = async (req, res) => {
  const categories = await Categories.find();
  res.json(categories);
};

// Post category
const setCategory = async (req, res) => {
  const name = req.body.name;
  const image = req.file ? req.file.filename : null;
  const regex = new RegExp(name, "i");
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
  try {
    const existingCategory = await Categories.findOne({ name: regex });

    if (existingCategory) {
      return res.status(404).send("Category already exists");
    }

    if (!image) {
      return res.status(404).send("Must add image");
    }

    const newCategory = new Categories({ name, image, urlName });

    await newCategory.save();

    const categories = await Categories.find();

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(404).send("Internal server error");
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  try {
    const category = await Categories.findById(id);

    const previousImage = category.image;
    let image;
    // Check if a new image is provided
    if (req.file) {
      // Delete the previous image if it exists
      if (previousImage) {
        const imagePath = path.join(
          __dirname,
          "../assets/category",
          previousImage
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      // Set the new image filename
      image = req.file.filename;
    }
    const updated = await Categories.findByIdAndUpdate(
      id,
      { name, image, urlName },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Categories.findById(id);
  try {
    // Delete the image file
    if (category.image != null) {
      const imagePath = path.resolve(
        __dirname,
        "../assets/category",
        category.image
      );
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
    await Categories.findByIdAndDelete(id);
    return Categories.find();
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
module.exports = { getCategories, setCategory, deleteCategory, updateCategory };
