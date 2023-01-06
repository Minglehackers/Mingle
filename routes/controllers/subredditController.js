const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");


exports.listPostsSubreddit = (req, res, next) => {
    const { rID } = req.params;
    Subreddit.findById(rID)
        .populate("posts")
        .then((subreddit) => {
            res.render("posts/post-list", { subreddit });
        }
        )
        .catch((err) => {
            next(err);
        }
        );
};

exports.openThread = (req, res, next) => {
    const { rID, pID } = req.params;
    Post.findById(pID)
        .populate("author")
        .then((post) => {
            res.render("posts/post-detail", post);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
};


exports.getCreateForm = (req, res, next) => {
    res.render("posts/post-create");
}

exports.postCreateForm = (req, res, next) => {
    const { title, content } = req.body;
    const { id } = req.params;
    Post.create({ title, content, author: req.session.currentUser._id, subreddit: id })
        .then(() => {
            res.redirect("/subreddit-list");
        })
        .catch((err) => {
            next(err);
        });
}

exports.getEditForm = (req, res, next) => {
    const { pID } = req.params;
    Post.findById
        (pID
        )
        .then((post) => {
            res.render("posts/post-edit", post);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}


exports.postEditForm = (req, res, next) => {
    const { id } = req.params;
    const { title, content } = req.body;
    Post.findByIdAndUpdate
        (id
            , { title, content }
            , { updated: true }
        )
        .then(() => {
            res.redirect("/subreddit-list");
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}


exports.deletePost = (req, res, next) => {
    const { id } = req.params;
    Post.findByIdAndDelete(id)
        .then(() => {
            res.redirect("/subreddit-list");
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = router;

