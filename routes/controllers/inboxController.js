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
            res.render("users/inbox", { messages });
        }
        )
        .catch((err) => { next(err); });
}

exports.displayConversation = (req, res, next) => {
    const id = req.params.id;
    const messageArray = [];
    // with 
    // sentBy

    // find all { with: id } && { sentBy: req.user._id }
    // find all { with: req.user._id } && { sentBy: id }
    // sort by createdAt
    // render

    Message
        .find({ with: id })
        .populate("with")
        .then((messages) => {
            messages.forEach((message) => {
                messageArray.push(message);
            });
            return Message.find({ sentBy: id });
        })
        .then((messages) => {
            messages.forEach((message) => {
                messageArray.push(message);
            });
            messageArray.sort((a, b) => {
                return a.createdAt - b.createdAt;
            });
            res.render("users/conversation", { messageArray });
        })
        .catch((err) => { next(err); });
}




exports.sendMessage = (req, res, next) => {
    const id = req.params.id;
    const { content } = req.body;
    Message
        .create({ content, with: id })
        .then(() => {
            res.redirect(`/inbox/${id}`);
        })
        .catch((err) => { next(err); });
}
