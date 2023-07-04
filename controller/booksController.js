const Books = require("../models/bookModel");
const fs = require("fs");
const path = require("path");

// Get Books by id
const getBooksById = async (req, res) => {
  const { id } = req.params;
  try {
    const books = await Books.findById(id).populate("category");

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Get all Books
const getBooks = async (req, res) => {
  const books = await Books.find().populate("category");
  res.json(books);
};

// Get Books by category name
const getBooksByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const books = await Books.find({ category: category });
    if (!books) {
      return res.status(404).send("No books found for this category");
    }
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Post order
const setBook = async (req, res) => {
  const { category, name, price, description } = req.body;

  try {
    // Check if product with same name and category already exists
    const existingBook = await Books.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
    });
    if (existingBook) {
      return res.status(404).send("Book already exists");
    }
    const newBook = new Books({
      name,
      category,
      price,
      description,
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
  const { name, description, category, price } = req.body;
  try {
    await Books.findByIdAndUpdate(
      id,
      { name, description, category, price },
      { new: true }
    );
  } catch (error) {
    res.json(error);
  }
};

const uploadImage = async (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;
  try {
    const book = await Books.findById(id);

    // If a file is present, add the image to the images array
    if (image) {
      book.images.push(image);
      await book.save();
    }

    res.status(200).send("Image uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading image");
  }
};

const deleteBookImage = async (req, res) => {
  const { id, index } = req.params;
  try {
    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    // Get the image filename at the specified index
    const imageToDelete = book.images[index];

    if (!imageToDelete) {
      return res.status(404).send("Image not found");
    }

    // Delete the image from the images array
    book.images.splice(index, 1);
    await book.save();

    // Delete the image file from the books folder
    const imagePath = path.join(__dirname, "../assets/books", imageToDelete);
    try {
      // Check if the file exists
      if (fs.existsSync(imagePath)) {
        // Delete the file
        fs.unlinkSync(imagePath);
        console.log("Image deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting image", error);
    }

    res.status(200).send("Image deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting image");
  }
};
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    // Delete the book images from the folder
    const imagePaths = book.images.map((image) =>
      path.join(__dirname, "../assets/books", image)
    );

    // Delete the images from the folder
    for (const imagePath of imagePaths) {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Image ${imagePath} deleted successfully`);
      }
    }

    // Delete the book from the database
    await book.remove();

    // Fetch the remaining books
    const books = await Books.find();

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting book");
  }
};

module.exports = {
  getBooksById,
  getBooks,
  getBooksByCategory,
  setBook,
  updateBook,
  uploadImage,
  deleteBookImage,
  deleteBook,
};
