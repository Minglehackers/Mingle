const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");
const checkIfSamePerson = require("../../utils/checkIfSamePerson");



exports.delete = (req, res, next) => {
    const cid = req.params.cid
    const sid = req.body.sid
    const pid = req.body.pid;

    Comment.findByIdAndDelete(cid)
        .then(() => {
            res.redirect(`/subreddit/${sid}/post/${pid}`)
        })
        .catch((err) => {
            next(err)
        })

}

exports.getEditForm = (req, res, next) => {
    const cid = req.params.cid;
    const text = req.body.text;
    

    Comment.findById(cid)
        .then((commentDetails) => {
            console.log(commentDetails);
            res.render("comments/comment-edit", { commentDetails });
        })
        .catch((err) => next(err));
};

exports.postEdit = (req, res, next) => {
    const cid = req.params.cid;
    const text = req.body.text;
    let postId;
    let subredditId;
    

    Comment.findByIdAndUpdate(cid, { text }, { new: true })
        .then((newComment) => {
            postId = newComment.originalPost;
            return Post.findById(postId);
        })
        .then((postDetails) => {
            subredditId = postDetails.subreddit;
            res.redirect(`/subreddit/${subredditId}/post/${postId}`);
        })
        .catch((err) => {
            next(err);
        });
};
