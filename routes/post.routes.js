const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const Subreddit = require("../models/Subreddit.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

//get route for displaying create post


router.get("/create", (req, res, next) => {
    
    Subreddit
        .find()
        .then((allSubreddits) => {
            console.log(allSubreddits)
            res.render("posts/new-post", {allSubreddits});
        })
        .catch((err) => { next(err); });
});


router.post("/create", (req, res, next) => {
    
    const authorID = req.session.currentUser._id

    const newPost = {
        title: req.body.title,
        text: req.body.text,
        author: authorID,
        subreddit: req.body.subreddit,
    }

    if (req.body.title === "" || req.body.text === "") {
        res.status(400).render(`posts/new-post`, {
          errorMessage:
            "All fields are mandatory. Please provide a title and a text.",
        });
        return;
      }
      if (newPost.title.length < 5 || newPost.text.length < 5) {
        res.status(400).render(`posts/new-post`, {
          errorMessage: "The title and the text need to be at least 5 characters long.",
        });
    
        return;
      }

    Post.create(newPost)
        .then((postDetails) => {
            console.log("from post ____" + postDetails);
            
            res.redirect(`/subreddit/${postDetails.subreddit}/post/${postDetails._id}`);


        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                res.status(500).render(`posts/new-post`, { errorMessage: err.message });
              } else {
                next(err);
              }
        });
})





module.exports = router;