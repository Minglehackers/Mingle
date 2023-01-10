const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");
const mongoose = require('mongoose')
const Message = require("../../models/Message.model");

exports.displayInbox = (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    Message
        .find({ with: id })
        .populate("with")
        .then((messages) => {
            res.render("inbox/main", { messages });
        }
        )
        .catch((err) => { next(err); });
}

exports.displayConversation = (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    Message
        .find({ with: id })
        .populate("with")
        .then((messages) => {
            res.render("inbox/conversation", { messages });
        }
        )
        .catch((err) => { next(err); });
}
