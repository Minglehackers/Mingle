const mongoose = require("mongoose");

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");
const Subreddit = require("../models/Subreddit.model");

const MONGO_URI = "mongodb://127.0.0.1/mingle";

const noun = ["forest", "tree", "flower", "sky", "grass", "mountain"];
const adjective = ["happy", "rotating", "red", "fast", "elastic", "smily", "unbelievable", "infinite"];







mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to DB: ", MONGO_URI);
    User.findOne({ username: "charlie" })
        .then((user) => {
            console.log("user", user)
            for (let i = 0; i < 2; i++) {
                const randomNumber = Math.floor(Math.random() * 100);
                const n = `${adjective[Math.floor(Math.random() * adjective.length)]}-${noun[Math.floor(Math.random() * noun.length)]}`;
                const name = `${n}-${randomNumber}`;
                Subreddit.create({ name, description: "This is a description" })
                    .then((subreddit) => {
                        for (let j = 0; j < 2; j++) {
                            Post.create({ title: "This is a title", text: "This is a content", author: user._id, subreddit: subreddit._id })
                                .then((post) => {
                                    for (let k = 0; k < 3; k++) {
                                        Comment.create({ title: `comment no ${k}`, text: `comment ${k}`, author: user._id, post: post._id })
                                            .then((comment) => {
                                                console.log(comment);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        }
        );
});



