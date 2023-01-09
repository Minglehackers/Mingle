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
    Post.create(newPost)
        .then((postDetails) => {
            console.log("from post ____" + postDetails);
            
            res.redirect(`/subreddit/${postDetails.subreddit}/post/${postDetails._id}`);


        })
        .catch((err) => {
            console.log("err creating new post to the db", err);
            next();
        });
})





module.exports = router;