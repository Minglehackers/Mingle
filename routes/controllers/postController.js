const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Comment = require("../../models/Comment.model");
const Subreddit = require("../../models/Subreddit.model");
const mongoose = require("mongoose");

exports.getCreateForm = (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    Subreddit.findById(id)
        .then((subreddit) => {
            res.render("posts/post-create", subreddit);
        })
        .catch((err) => {
            next(err);
        });
};

exports.postPost = (req, res, next) => {
    let postId;
    const id = req.params.id;

    const authorID = req.session.currentUser._id;

    const newPost = {
        title: req.body.title,
        text: req.body.text,
        author: authorID,
        subreddit: id,
        img: req.file.path
    };

    if (req.body.title === "" || req.body.text === "") {
        res.status(400).render(`posts/post-create`, {
            errorMessage: "All fields are mandatory. Please provide a title and a text.",
        });
        return;
    }
    if (newPost.title.length < 5 || newPost.text.length < 5) {
        res.status(400).render(`posts/post-create`, {
            errorMessage: "The title and the text need to be at least 5 characters long.",
        });

        return;
    }
    Post.create(newPost)
        .then((postDetails) => {
            console.log("from post ____" + postDetails);
            res.redirect(`/subreddit/${id}`);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                res.status(500).render(`posts/post-create`, { errorMessage: err.message });
            } else {
                next(err);
            }
        });
};

exports.displayView = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;
    let commentArr;

    Comment.find({
        originalPost: pid,
    })
        .populate("originalPost author")
        .then((postdetails) => {
            commentArr = postdetails;
            return Post.findById(pid).populate("author");
        })
        .then((details) => {
            if (`${req.session.currentUser._id}` !== `${details.author._id}`) {
                res.locals.samePerson = false;
            } else {
                res.locals.samePerson = true;
            }

            console.log(res.locals);

            const data = {
                comments: commentArr,
                postDetails: details,
            };
            res.render("posts/post-details", data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.postNew = (req, res, next) => {
    const subreddit = req.params.id;
    const postID = req.params.pid;
    const authorID = req.session.currentUser._id;
    let comment;

    const newComment = {
        text: req.body.text,
        author: authorID,
        originalPost: postID,
    };

    Comment.create(newComment)
        .then((commentDetails) => {
            comment = commentDetails;
            console.log("from post ____" + commentDetails);
            res.redirect(`/subreddit/${subreddit}/post/${postID}`);
        })
        .catch((err) => {
            next(err);
        });
};

exports.getEditForm = (req, res, next) => {
    const pid = req.params.pid;
    console.log(res.locals.samePerson);

    Post.findById(pid)
        .then((postDetails) => {
            console.log(postDetails);
            res.render("posts/post-edit", { postDetails });
        })
        .catch((err) => next(err));
};

exports.postEdit = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;
    const text = req.body.text;
    const title = req.body.title;
    Post.findByIdAndUpdate(pid, { text, title }, { new: true })
        .then(() => {
            res.redirect(`/subreddit/${id}/post/${pid}`);
        })
        .catch((err) => {
            next(err);
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;

    Comment.deleteMany({ originalPost: pid })
        .then(() => {
            return Post.findByIdAndDelete(pid);
        })
        .then(() => res.redirect("/subreddit"))
        .catch((err) => {
            next(err);
        });
};

exports.upvote = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;
    const userID = req.session.currentUser._id;

    Post.findById(pid)
        .then((post) => {
            // handle upvote and downvote logic
            if (post.upvotes.includes(userID)) {
                return Post.findByIdAndUpdate(pid, { $pull: { upvotes: userID } }, { new: true });
            } else {
                return Post.findByIdAndUpdate(pid, { $push: { upvotes: userID } }, { new: true });
            }
        })
        .then((post) => {
            if (post.downvotes.includes(userID)) {
                return Post.findByIdAndUpdate(pid, { $pull: { downvotes: userID } }, { new: true });
            } else {
                return Post.findById(pid);
            }
        })
        .then((post) => {
            res.redirect(`/subreddit/${id}/post/${pid}`);
        })
        .catch((err) => {
            next(err);
        });
};

exports.downvote = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;
    const userID = req.session.currentUser._id;

    Post.findById(pid)
        .then((post) => {
            if (post.downvotes.includes(userID)) {
                return Post.findByIdAndUpdate(pid, { $pull: { downvotes: userID } }, { new: true });
            } else {
                return Post.findByIdAndUpdate(pid, { $push: { downvotes: userID } }, { new: true });
            }
        })
        .then((post) => {
            if (post.upvotes.includes(userID)) {
                return Post.findByIdAndUpdate(pid, { $pull: { upvotes: userID } }, { new: true });
            } else {
                return Post.findById(pid);
            }
        })
        .then((post) => {
            console.log(post);
            res.redirect(`/subreddit/${id}/post/${pid}`);
        })
        .catch((err) => {
            next(err);
        });
};
