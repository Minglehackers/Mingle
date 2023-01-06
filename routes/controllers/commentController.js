const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Subreddit = require("../models/Subreddit.model");

exports.createComment = (req, res, next) => {

    const { content } = req.body;
    const { pID } = req.params;
    Comment.create({ content, author: req.session.currentUser._id, post: pID })
        .then((comment) => {
            return Post.findByIdAndUpdate(pID, { $push: { comments: comment._id } }, { new: true })
        })
        .then(() => {
            res.redirect(`/subreddit-list/posts/${pID}`);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}

exports.getEditForm = (req, res, next) => {
    const { cID } = req.params;
    Comment.findById
        (cID
        )
        .then((comment) => {
            res.render("comments/comment-edit", comment);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}


exports.postEditForm = (req, res, next) => {
    const { content } = req.body;
    const { cID, pID } = req.params;
    Comment
        .findById
        (cID
        )
        .then((comment) => {
            comment.content = content;
            return comment.save();
        }
        )
        .then(() => {
            res.redirect(`/subreddit-list/posts/${pID}`);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}

exports.deleteComment = (req, res, next) => {
    const { cID, pID } = req.params;
    Comment
        .findByIdAndDelete
        (cID
        )
        .then(() => {
            res.redirect(`/subreddit-list/posts/${pID}`);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}

exports.voteComment = (req, res, next) => {
    const { cID, pID } = req.params;
    const { vote } = req.body;
    Comment
        .findById
        (cID
        )
        .then((comment) => {
            if (vote === "up") {
                comment.upvotes += 1;
            } else {
                comment.downvotes += 1;
            }
            return comment.save();
        }
        )
        .then(() => {
            res.redirect(`/subreddit-list/posts/${pID}`);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}



