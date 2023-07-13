const express = require("express");
const {
  getCommentsByBlog,
  getCommentsByUser,
  postComments,
  deleteComment,
  getComments,
} = require("../controller/commentController");
const commentRoutes = express.Router();

commentRoutes.route("/blog/:blog").get(getCommentsByBlog);
commentRoutes.route("/user/:user").get(getCommentsByUser);
commentRoutes.route("/").get(getComments).post(postComments);
commentRoutes.route("/:id").delete(deleteComment);

module.exports = commentRoutes;
