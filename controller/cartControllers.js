const Cart = require("../models/Cart");
const Books = require("../models/bookModel");

const get_cart_items = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findOne({ userId: id }).populate(
      "items.productId",
      "name price image"
    );
    res.json(cart.items);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const add_cart_item = async (req, res) => {
  const { id, productId } = req.params;

  console.log(id, productId);

  try {
    let cart = await Cart.findOne({ userId: id });

    // if cart exists for the user
    let existingItem = cart.items.find((p) => p.productId == productId);

    // Check if product exists or not
    if (existingItem) {
      // If the item exists, increase its quantity by 1
      existingItem.quantity += 1;
    } else {
      // If the item doesn't exist, create a new item object with quantity 1
      const newItem = {
        productId: productId,
        quantity: 1,
      };

      // Add the new item to the items array
      cart.items.push(newItem);
    }
    // Save the updated cart
    await cart.save();

    await get_cart_items(req, res);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const delete_item = async (req, res) => {
  const { id, productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: id });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex !== -1) {
      const item = cart.items[itemIndex];

      // Decrease the quantity by 1
      item.quantity -= 1;

      if (item.quantity <= 0) {
        // If quantity becomes zero or less, remove the item from the items array
        cart.items.splice(itemIndex, 1);
      }

      // Save the updated cart
      await cart.save();

      await get_cart_items(req, res);
    } else {
      res.status(404).send("Item not found in cart");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

const delete_all_items = async (req, res) => {
  const { id } = req.params;
  try {
    let cart = await Cart.findOneAndUpdate(
      { userId: id },
      { items: [] },
      { new: true }
    );
    return res.status(201).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  add_cart_item,
  get_cart_items,
  delete_item,
  delete_all_items,
};
