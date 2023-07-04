const Orders = require("../models/orderModel");

// Get all Orders
const getOrders = async (req, res) => {
  const { id } = req.params;
  const orders = await Orders.find({ userId: id });
  res.json(orders);
};

// Post order
const setorder = (req, res) => {
  const orderId = req.body.orderId;
  const userId = req.body.userId;
  const totalPrice = req.body.totalPrice;
  const lotteryCode = req.body.lotteryCode;
  const items = req.body.items;
  const status = req.body.status;
  const newOrder = new Orders({
    orderId,
    userId,
    totalPrice,
    lotteryCode,
    items,
    status,
  });
  newOrder
    .save()
    .then(() => {
      res.send(`New Order Added`);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

module.exports = { getOrders, setorder };
