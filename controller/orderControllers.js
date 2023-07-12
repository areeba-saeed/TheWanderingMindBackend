const Orders = require("../models/orderModel");
const Cart = require("../models/Cart");
const User = require("../models/User");

// Get all Orders
const getOrders = async (req, res) => {
  const orders = await Orders.find()
    .populate("userId")
    .populate("items.productId");
  res.json(orders);
};
// Get all Orders
const getOrdersCart = async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findOne({ userId: id }).populate("items.productId");
  const cartItems = cart.items.map((item) => {
    return {
      productId: item.productId._id,
      price: item.productId.price,
      quantity: item.quantity,
    };
  });

  res.json(cartItems);
};
// Get all Orders
const getUserOrders = async (req, res) => {
  const { id } = req.params;
  const orders = await Orders.find({ userId: id });
  res.json(orders);
};

// Post order
const setorder = async (req, res) => {
  const {
    userId,
    items,
    totalPrice,
    name,
    email,
    address,
    address2,
    cvv,
    country,
    state,
    zip,
    nameOnCard,
    creditNumber,
    expiration,
  } = req.body;
  try {
    const newOrder = new Orders({
      userId,
      totalPrice,
      items,
      status: "New Order",
    });
    newOrder.save();

    await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        address,
        address2,
        country,
        state,
        zip,
        cvv,
        nameOnCard,
        creditNumber,
        expiration,
      },
      { new: true }
    );
    console.log("Hello");
    await Cart.findOneAndUpdate(
      { userId: userId },
      { items: [] },
      { new: true }
    );
    res.send(`New Order Added`);
  } catch (error) {
    res.status(400).send("Error placing order");
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await Orders.findByIdAndUpdate(id, { status: status }, { new: true })
    .then((order) => {
      res.json(order);
    })
    .catch((error) => {
      res.status(400).send("Error deleting order");
    });
};
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  await Orders.findByIdAndDelete(id)
    .then((order) => {
      res.json(order);
    })
    .catch((error) => {
      res.status(400).send("Error deleting order");
    });
};

module.exports = {
  getOrders,
  getUserOrders,
  getOrdersCart,
  setorder,
  updateOrder,
  deleteOrder,
};
