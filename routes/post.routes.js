const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const Subreddit = require("../models/Subreddit.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const fileUploader = require("../config/cloudinary.config");

//get route for displaying create post

router.get("/create", isLoggedIn, (req, res, next) => {
  Subreddit.find()
    .then((allSubreddits) => {
      res.render("posts/new-post", { allSubreddits });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/create", isLoggedIn, fileUploader.single("img"), (req, res, next) => {
    const authorId = req.session.currentUser._id;

    const newPost = {
      title: req.body.title,
      text: req.body.text,
      author: authorId,
      subreddit: req.body.subreddit,
      img: req.file && req.file.path,
    };

    if (req.body.title === "" || req.body.text === "") {
      console.log(newPost);
        res.status(400).render(`posts/new-post`, {
            errorMessage: "Please provide a title and a text.",
            ...newPost,
            _id: authorId,
          });
          return;      
    }
    if (newPost.title.length < 5 || newPost.text.length < 5) {
      console.log(newPost);
      res.status(400).render(`posts/new-post`, {
        errorMessage:
          "The title and the text need to be at least 5 characters long.",
        ...newPost,
        _id: authorId,
      });

      return;
    } else {
      Post.create(newPost)
        .then((postDetails) => {
          console.log("from post ____" + postDetails);
          res.redirect(
            `/subreddit/${postDetails.subreddit}/post/${postDetails._id}`
          );
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            res
              .status(500)
              .render(`posts/new-post`, { errorMessage: err.message });
          } else {
            next(err);
          }
        });
    }
  }
);

module.exports = router;
