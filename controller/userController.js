const User = require("../models/User");
const fs = require("fs");
const path = require("path");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
// Get all Products
const updateUser = async (req, res) => {
  const id = req.params.id;

  const { name, email } = req.body;

  try {
    const user = await User.findById(id);
    const previousImage = user.image;
    let image;
    // Check if a new image is provided
    if (req.file) {
      // Delete the previous image if it exists
      if (previousImage) {
        const imagePath = path.join(
          __dirname,
          "../assets/users",
          previousImage
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      // Set the new image filename
      image = req.file.filename;
    }
    const updated = await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
      image,
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user.image != null) {
      const imagePath = path.resolve(__dirname, "../assets/users", user.image);
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
    const deleted = await User.findByIdAndDelete(id);
    res.json(deleted);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  updateUser,
  getUser,
  getUsers,
  deleteUser,
};
