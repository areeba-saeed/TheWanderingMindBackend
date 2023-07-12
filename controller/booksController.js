const Books = require("../models/bookModel");
const fs = require("fs");
const path = require("path");

// Get Books by id
const getBooksById = async (req, res) => {
  const { id } = req.params;
  try {
    const books = await Books.findById(id)
      .populate("category")
      .populate("author");

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
// Get Books by url
const getBooksByUrlName = async (req, res) => {
  const { urlName } = req.params;
  try {
    const books = await Books.findOne({ urlName })
      .populate("category", "name")
      .populate("author");

    // Replace the populated category object with just the category's name
    const booksWithCategoryName = {
      ...books._doc,
      category: books.category.name,
      categoryId: books.category._id,
    };

    res.json(booksWithCategoryName);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Get all Books
const getBooks = async (req, res) => {
  const books = await Books.find().populate("category").populate("author");
  res.json(books);
};

// Get Books by category name
const getBooksByCategory = async (req, res) => {
  const { category, urlName } = req.params;
  try {
    const books = await Books.find({
      category: category,
      urlName: { $ne: urlName },
    });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Post order
const setBook = async (req, res) => {
  const { category, name, price, description, author } = req.body;
  const image = req.file ? req.file.filename : null;
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  try {
    // Check if product with same name and category already exists
    const existingBook = await Books.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
    });
    if (existingBook) {
      return res.status(404).send("Book already exists");
    }
    if (!image) {
      return res.status(404).send("Must add image");
    }
    const newBook = new Books({
      name,
      category,
      price,
      urlName,
      author,
      description,
      image,
    });
    newBook.save();
    res.json(newBook);
  } catch (error) {
    res.json(error);
  }
};

// Update User
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, author } = req.body;
  const trimmedName = name.trimRight();
  const urlName = `${trimmedName
    .replace(/\s+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  try {
    const book = await Books.findById(id);

    const previousImage = book.image;
    let image;
    // Check if a new image is provided
    if (req.file) {
      // Delete the previous image if it exists
      if (previousImage) {
        const imagePath = path.join(
          __dirname,
          "../assets/books",
          previousImage
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      // Set the new image filename
      image = req.file.filename;
    }
    const updated = await Books.findByIdAndUpdate(
      id,
      { name, description, category, urlName, author, price, image },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Books.findById(id);

    if (book.image != null) {
      const imagePath = path.resolve(__dirname, "../assets/books", book.image);
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
    // Delete the book from the database
    await Books.findByIdAndDelete(id);
    return Books.find();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting book");
  }
};

module.exports = {
  getBooksById,
  getBooksByUrlName,
  getBooks,
  getBooksByCategory,
  setBook,
  updateBook,
  deleteBook,
};
