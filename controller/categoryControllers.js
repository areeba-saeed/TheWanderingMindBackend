const Categories = require("../models/categoryModel");

// Get all categories
const getCategories = async (req, res) => {
  const categories = await Categories.find();
  res.json(categories);
};

// Post category
const setCategory = async (req, res) => {
  const name = req.body.name;

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

    const newCategory = new Categories({ name, urlName });

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
    const updated = await Categories.findByIdAndUpdate(
      id,
      { name, urlName },
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
  try {
    await Categories.findByIdAndDelete(id);
    return Categories.find();
  } catch (error) {
    res.status(404).json({ error: error });
  }
};
module.exports = { getCategories, setCategory, deleteCategory, updateCategory };
