const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");
const Comment = require("../../models/Comment.model");
const mongoose = require("mongoose");


exports.listReddits = (req, res, next) => {
    Subreddit.find().then((subreddits) => {
        res.render("subreddit/list", { subreddits })
    })
        .catch((err) => {
            next(err);
        })
}

exports.displaySingleReddit = (req, res, next) => {
    const id = req.params.id;
    let postArr;
    Post.find({
        subreddit: id
    }).populate("author")
        .then((postdetails) => {
            postArr = postdetails;
            return Subreddit.findById(id).populate("moderator", "username")
        })
        .then((subredditDetails) => {

            const data = {
                post: postArr,
                subredditdetails: subredditDetails,

            }

            res.render("subreddit/subreddit-details", data);
        })
        .catch((err) => { next(err); });
}




exports.getCreateForm = (req, res, next) => {
    res.render("subreddit/create")
}


exports.postCreateForm = (req, res, next) => {
    const { name, description } = req.body;
    let author = req.session.currentUser._id

    if (name === "" || description === "") {
        res.status(400).render("subreddit/create", {
            errorMessage:
                "All fields are mandatory. Please provide a name and a description.",
        });
        return;
    }
    if (name.length < 3 || description.length < 8) {
        res.status(400).render("subreddit/create", {
            errorMessage: "The name needs to be at least 3 characters long and the description needs to be at least 8 characters long.",
        });

        return;
    }

    Subreddit.create({ name, description, moderator: author, img: req.file.path })
        .then(() => {
            res.redirect(`/subreddit`);
        })
        .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
                res.status(500).render("subreddit/create", { errorMessage: err.message });
            } else {
                next(err);
            }
        });
}


exports.deleteSubreddit = (req, res, next) => {

    const id = req.params.id
    Comment.deleteMany({ subreddit: id }).then(() => {
        Post.deleteMany({ subreddit: id }).then(() => {
            Subreddit.findByIdAndDelete(id).then(() => {
                res.redirect("/subreddit")
            })
        })

    })
}

exports.getEditForm = (req, res, next) => {
    const id = req.params.id;
    Subreddit.findById(id)
        .then((subreddit) => {
            console.log(subreddit)
            res.render("subreddit/edit", { subreddit });
        }
        )
        .catch((err) => { next(err); });
}

exports.postEditForm = (req, res, next) => {
    const id = req.params.id;
    const { name, description } = req.body;
    Subreddit.findByIdAndUpdate(id
        , { name, description }
        , { new: true })
        .then((subreddit) => {
            res.redirect(`/subreddit/${subreddit._id}`);
        }
        )
        .catch((err) => { next(err); });
}