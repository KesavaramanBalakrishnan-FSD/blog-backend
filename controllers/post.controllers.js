const jwt = require("jsonwebtoken");
const secret =
  process.env.JWT_SECRET || "feaehhwohiwohe7393957wihrhsfskfhsielaocns8yhf";

const Post = require("../models/Post");

const cloudinary = require("cloudinary").v2;

exports.createPost = async (req, res) => {
  // console.log(req.file);

  try {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized access." });
      }

      const { title, summary, content } = req.body;

      const postDetail = await Post.create({
        title,
        summary,
        content,
        cover: req.file.path || req.file.url,
        author: info.id,
        //graping it from json webtoken
      });

      res.json(postDetail);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({})
      .populate("author", ["username"])
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching posts." });
    console.error(error);
  }
};

exports.getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const postDetail = await Post.findById(id).populate("author", ["username"]);

    if (!postDetail) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json(postDetail);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post." });
    console.error(error);
  }
};

exports.editPost = (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    const { id, title, summary, content } = req.body;

    try {
      const postDetail = await Post.findById(id);
      if (!postDetail) {
        return res.status(404).json({ error: "Post not found." });
      }

      const isAuthor =
        JSON.stringify(postDetail.author) === JSON.stringify(info.id);

      //better approach
      // const isAuthor = postDetail.author.equals(info.id);

      if (!isAuthor) {
        return res.status(403).json({ error: "You are not the author." });
      }

      if (req.file) {
        const publicId = postDetail.cover.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const updatedCover = req.file
        ? req.file.path || req.file.url
        : postDetail.cover;

      await postDetail.updateOne({
        title,
        summary,
        content,
        cover: updatedCover,
      });

      // Return the updated post
      const updatedPost = await Post.findById(id).populate("author", [
        "username",
      ]);
      res.json(updatedPost);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the post." });
      console.error(error);
    }
  });

  // res.json({files: req.file });
};

exports.deletePost = async (req, res) => {
  try {
    const { token } = req.cookies;

    // Verify the token
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized access." });
      }

      const postId = req.params.id;
      const postDetail = await Post.findById(postId);

      if (!postDetail) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if the current user is the author of the post
      const isAuthor =
        JSON.stringify(postDetail.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(400).json("You are not the author");
      }

      // Delete the image from Cloudinary
      const publicId = postDetail.cover.split("/").pop().split(".")[0]; // Extract public_id from the Cloudinary URL
      await cloudinary.uploader.destroy(publicId);

      // Delete the post from the database
      await postDetail.deleteOne();

      res.json({ message: "Post and image deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
