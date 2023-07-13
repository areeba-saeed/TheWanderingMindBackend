const express = require("express");
const PORT = process.env.PORT || 5000;
const { connectDB } = require("./config/db");
const passport = require("passport");
const validationRoutes = require("./routes/validationRoutes");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
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
  res.send("Connect");
});

// Passport middlewares
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", validationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// Define error-handling middleware function
app.use(function (req, res, next) {
  res.status(404).send("Sorry, this route does not exist.");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
