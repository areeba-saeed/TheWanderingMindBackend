const express = require("express");
const PORT = process.env.PORT || 5000;
const { connectDB } = require("./config/db");
const passport = require("passport");
const users = require("./routes/validationRoutes");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRouter = require("./routes/cartRoutes");
const bookRoutes = require("./routes/booksRoute");
const authorRoutes = require("./routes/authorRoutes");
const contactRoutes = require("./routes/contactRoutes");
require("dotenv").config();

const app = express();
connectDB();
const corsOptions = {
  origin: "http://localhost:3001", // Replace with your React app's domain
};

app.use(cors());

app.use(express.static(path.join(__dirname, "assets")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

// Passport middlewares
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/contact", contactRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRouter);

// Define error-handling middleware function
app.use(function (req, res, next) {
  res.status(404).send("Sorry, this route does not exist.");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
