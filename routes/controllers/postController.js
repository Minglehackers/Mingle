const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Comment = require("../../models/Comment.model");
const Subreddit = require("../../models/Subreddit.model");
const mongoose = require("mongoose");
const checkIfSamePerson = require("../../utils/checkIfSamePerson");

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
    let subredditDetails;

    const authorID = req.session.currentUser._id;

    const newPost = {
        title: req.body.title,
        text: req.body.text,
        author: authorID,
        subreddit: id,
        img: req.file && req.file.path
    };



    if (req.body.title === "" || req.body.text === "") {
        console.log(newPost)
        res.status(400).render(`posts/post-create`, {
            errorMessage: "Please provide a title and a text.",
            ...newPost,
            _id: id
        });
        return;
    }
    if (newPost.title.length < 5 || newPost.text.length < 5) {
        console.log(newPost)
        res.status(400).render(`posts/post-create`, {
            errorMessage: "The title and the text need to be at least 5 characters long.",
            ...newPost,
            _id: id
        });

        return;
    }

    Subreddit.findById(id)
        .then((subreddit) => {
            console.log(subreddit);
            subredditDetails = subreddit;
            return Post.create(newPost);
        })
        .then((postDetails) => {
            console.log("from post ____" + postDetails);
            res.redirect(`/subreddit/${id}`);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                res
                    .status(500)
                    .render(`posts/post-create`, { errorMessage: err.message });

            } else {
                next(err);
            }
        });
};






















exports.displayView = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;
    let commentArr;
    let totalVotes;
    let fallBackUser = "63c0da3a67554c58ce13a469"

    User.findById("63c0da3a67554c58ce13a469").then((user) => {
        fallBackUser = user
    }).then(() => {
        return Comment.find({
            originalPost: pid,
        })
            .populate("originalPost author")
    }).then((postdetails) => {
        if (!postdetails.author) {
            postdetails.author = fallBackUser
        }
        return postdetails
    })
        .then((postdetails) => {

            console.log(postdetails, "postdetails")
            commentArr = postdetails;
            commentArr.forEach(element => {
                if (req.session.currentUser) {
                    if (`${req.session.currentUser._id}` !== `${element.author._id}`) {
                        element.isCommentAuthor = false;
                    } else {
                        element.isCommentAuthor = true;
                    }
                } else {
                    element.isCommentAuthor = false;
                }
            })
            return Post.findById(pid).populate("author");
        })
        .then((details) => {
            totalVotes = details.upvotes.length - details.downvotes.length
            if (req.session.currentUser) {
                checkIfSamePerson(req, res, details.author._id)

                const data = {
                    totalVotes: totalVotes,
                    comments: commentArr,
                    postDetails: details
                };
                res.render("posts/post-details", data);
            } else {
                const data = {
                    totalVotes: totalVotes,
                    comments: commentArr,
                    postDetails: details
                };
                res.render("posts/post-details", data);
            }

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
    const img = req.file && req.file.path;
    Post.findByIdAndUpdate(pid, { text, title, img }, { new: true })
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
    const type = req.params.type;

    console.log(type);

    Post.findById(pid)
        .then((post) => {

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
            if (type === "thread") {
                res.redirect(`/subreddit/${id}/post/${pid}`);
            } else {
                res.redirect(`/subreddit/${id}`);
            }

        })
        .catch((err) => {
            next(err);
        });
};

exports.downvote = (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid;
    const userID = req.session.currentUser._id;
    const type = req.params.type;

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
            if (type === "thread") {
                res.redirect(`/subreddit/${id}/post/${pid}`);
            } else {
                res.redirect(`/subreddit/${id}`);
            }
        })
        .catch((err) => {
            next(err);
        });
};
