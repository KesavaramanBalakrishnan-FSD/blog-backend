const express = require("express");
const router = express.Router();

const uploadMiddleware = require("../middlewares/cloudinary");

const {
  createPost,
  getAllPosts,
  getSinglePost,
  editPost,
  deletePost,
} = require("../controllers/post.controllers");

router.post("/createPost", uploadMiddleware.single("file"), createPost);

router.get("/getAllPosts", getAllPosts);

router.get("/getSinglePost/:id", getSinglePost);

router.put("/editPost", uploadMiddleware.single("file"), editPost);

router.put("/deletePost/:id", deletePost);

module.exports = router;
