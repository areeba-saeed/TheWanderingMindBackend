const User = require("../models/User");

// Get all Products
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, addresses, phoneNo, isVerified } = req.body;

  try {
    const user = await User.updateOne(
      { userId: userId },
      { name, email, password, addresses, phoneNo, isVerified }
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.find({ userId: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const addAddress = async (req, res) => {
  const userId = req.params.id;
  const { name, address, addressId } = req.body;

  try {
    // Check if an address with the same name and address already exists
    const existingAddress = await User.findOne({
      userId: userId,
      "addresses.name": { $regex: new RegExp(`^${name}$`, "i") },
      "addresses.address": { $regex: new RegExp(`^${address}$`, "i") },
    });

    if (existingAddress) {
      return res.status(400).json({ message: "Address already exists" });
    }

    // Add the new address
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { $push: { addresses: { name, address, addressId } } },
      { new: true } // return the modified document instead of the original
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAddress = async (req, res) => {
  const userId = req.params.id;
  const addressId = req.params.addressId;

  try {
    const user = await User.findOneAndUpdate(
      { userId: userId },
      { $pull: { addresses: { addressId: addressId } } },
      { new: true } // return the updated user object
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Filter out the deleted address from the response
    const filteredAddresses = user.addresses.filter(
      (address) => address.addressId !== addressId
    );
    const updatedUser = { ...user.toObject(), addresses: filteredAddresses };

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAddress = async (req, res) => {
  const userId = req.params.id;
  const addressId = req.params.addressId;
  const { name, address } = req.body;

  try {
    // Check if an address with the same name and address already exists
    const existingAddress = await User.findOne({
      userId: userId,
      "addresses.name": { $regex: new RegExp(`^${name}$`, "i") },
      "addresses.address": { $regex: new RegExp(`^${address}$`, "i") },
    });

    if (existingAddress) {
      return res.status(400).json({ message: "Address already exists" });
    }

    const user = await User.findOneAndUpdate(
      { userId: userId, "addresses.addressId": addressId },
      { $set: { "addresses.$.name": name, "addresses.$.address": address } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateUser,
  getUser,
  addAddress,
  deleteAddress,
  updateAddress,
};
