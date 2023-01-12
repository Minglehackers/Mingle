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
    const me = req.session.currentUser._id
    ''
    const chats = [];

    // Message.find({ with: me })
    //     .populate("with sentBy")
    //     .then((messages) => {
    //         messages.forEach((msg) => !chats.includes(msg.sentBy) && chats.push(msg.sentBy));
    //         return Message.find({ sentBy: me });
    //     })
    //     .then((messages) => messages.forEach((msg) => !chats.includes(msg.with) && chats.push(msg.with)));
    // console.log(chats);

    Message.find({ sentBy: me }).populate("with sentBy")
        .then((messages) => {
            console.log(messages)
            const data = {
                messages
            }

            res.render("users/inbox", data);
        })
        .catch((err) => {
            next(err);
        })
};


// res.render("users/inbox", { JSON: JSON.stringify(chats) });


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
            res.render("users/chat", { messageArray });
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
    const { message } = req.body;
    const myId =

        console.log(id, "-----------", message)

    const newMessage = {
        text: message,
        with: id,
        sentBy: req.session.currentUser._id,
    };
    console.log(newMessage)
    Message.create(newMessage)
        .then((msg) => {

            console.log(msg);
            res.redirect(`/inbox`);
        })
        .catch((err) => {
            next(err);
        });
};
