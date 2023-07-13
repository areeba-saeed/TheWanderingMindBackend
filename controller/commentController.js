const Comments = require("../models/commentModel");
const Blogs = require("../models/blogModel");

const getComments = async (req, res) => {
  const comments = await Comments.find().populate("user").populate("blog");
  res.json(comments);
};
const getCommentsByBlog = async (req, res) => {
  const { blog } = req.params;
  const comments = await Comments.find({ blog: blog }).populate("user");
  res.json(comments);
};
const getCommentsByUser = async (req, res) => {
  const { user } = req.params;
  const comments = await Comments.find({ user: user }).populate("blog");
  res.json(comments);
};

const postComments = async (req, res) => {
  const { blog, user, comment } = req.body;
  try {
    const newComment = new Comments({
      blog,
      user: user,
      comment,
    });

    newComment.save();
    res.json(newComment);
  } catch (error) {
    res.json("Error creating comment");
  }
};
const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await Comments.findByIdAndDelete(id);
    res.json("Comment deleted");
  } catch (error) {
    res.json("Error creating comment");
  }
};

module.exports = {
  getComments,
  getCommentsByBlog,
  getCommentsByUser,
  postComments,
  deleteComment,
};
