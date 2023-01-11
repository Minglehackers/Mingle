const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");
const mongoose = require("mongoose");
const Message = require("../../models/Message.model");

exports.displayInbox = (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    const chats = [];

    Message.find({ with: req.user._id })
        .populate("with sentBy")
        .then((messages) => {
            messages.forEach((msg) => !chats.includes(msg.sentBy) && chats.push(msg.sentBy));
            return Message.find({ sentBy: req.user._id });
        })
        .then((messages) => messages.forEach((msg) => !chats.includes(msg.with) && chats.push(msg.with)));
    res.render("users/inbox", { chats });
};

exports.displayConversation = (req, res, next) => {
    const id = req.params.Uid;
    const messageArray = [];

    Message.find({ with: id, sentBy: req.user._id })
        .populate("with sentBy")
        .then((messages) => {
            messages.forEach((message) => messageArray.push(message));
            return Message.find({ with: req.user._id, sentBy: id });
        })
        .then((messages) => {
            messages.forEach((message) => messageArray.push(message));
            messageArray.sort((a, b) => a.createdAt - b.createdAt);
            res.render("users/conversation", { messageArray });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getMessageForm = (req, res, next) => {
    const id = req.params.id;
    res.render("users/message-form", { id });
};

exports.sendMessage = (req, res, next) => {
    const id = req.params.id;
    const { content } = req.body;
    Message.create({ content, with: id })
        .then(() => {
            res.redirect(`/inbox/${id}`);
        })
        .catch((err) => {
            next(err);
        });
};
