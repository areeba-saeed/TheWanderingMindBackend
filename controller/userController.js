const User = require("../models/User");
const Cart = require("../models/Cart");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
// Get all Products
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, address, phoneNo } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
      address,
      phoneNo,
    });
    res.status(200).json(user);
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
  await User.findByIdAndDelete(id)
    .then(async (user) => {
      await Cart.findOneAndUpdate({ userId: id }, { items: [] }, { new: true });
      res.json(user);
    })
    .catch((error) => {
      res.json(error);
    });
};

module.exports = {
  updateUser,
  getUser,
  getUsers,
  deleteUser,
};
