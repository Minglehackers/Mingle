const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");
const Comment = require("../../models/Comment.model");
const mongoose = require("mongoose");
const checkIfSamePerson = require("../../utils/checkIfSamePerson");


exports.listReddits = (req, res, next) => {
    Subreddit.find().then((subreddits) => {
        res.render("subreddit/list", { subreddits })
    })
        .catch((err) => {
            next(err);
        })
}

exports.filterReddits = (req, res, next) => {
    const input = req.body.querry
    console.log("querry ", input)

    Subreddit.find().then((subreddits) => {


        const filteredSubreddits =
            subreddits.filter(subreddit => {
                return subreddit.name.toLowerCase().includes(input.toLowerCase())
            })

        const data = {
            subreddits,
            filteredSubreddits
        }

        console.log("data: ", data)

        res.render("subreddit/list", data)


    })
        .catch((err) => {
            next(err);
        })
}




exports.displaySingleReddit = (req, res, next) => {
    const id = req.params.id;
    let postArr;
    let fallbackModerator = "63bea781ec801d76b898b005"

    User.findById("63bea781ec801d76b898b005").then((user) => {
        fallbackModerator = user
        console.log("fallbackModerator: ", fallbackModerator)
    }).then(() =>
        Post.find({ subreddit: id }).populate("author")
    ).then((postdetails) => {
        postArr = postdetails;
        return Subreddit.findById(id).populate("moderator", "username")
    })
        .then((subredditDetails) => {
            if (!subredditDetails.moderator) {
                subredditDetails.moderator = fallbackModerator
            }
            if (req.session.currentUser) {
                checkIfSamePerson(req, res, subredditDetails.moderator._id)
                const data = {
                    post: postArr,
                    subredditdetails: subredditDetails,

                }
                res.render("subreddit/subreddit-details", data);
            } else {
                const data = {
                    post: postArr,
                    subredditdetails: subredditDetails,
                }
                res.render("subreddit/subreddit-details", data);
            }

        })
        .catch((err) => { next(err); });
}






exports.getCreateForm = (req, res, next) => {
    res.render("subreddit/create")
}


exports.postCreateForm = (req, res, next) => {
    const newSubreddit = {
        name: req.body.name,
        description: req.body.description,
        moderator: req.session.currentUser._id,
        img: req.file && req.file.path,
    }

    // const { name, description } = req.body;
    // let author = req.session.currentUser._id

    if (newSubreddit.name === "" || newSubreddit.description === "") {
        res.status(400).render("subreddit/create", {
            errorMessage:
                "Please provide a name and a description.",
        });
        return;
    }
    if (newSubreddit.name.length < 3 || newSubreddit.description.length < 8) {
        res.status(400).render("subreddit/create", {
            errorMessage: "The name needs to be at least 3 characters long and the description needs to be at least 8 characters long.",
        });

        return;
    }

    Subreddit.create(newSubreddit)
        .then((newSubreddit) => {
            console.log(newSubreddit)
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
            res.render("subreddit/edit", { subreddit });
        }
        )
        .catch((err) => { next(err); });
}

exports.postEditForm = (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const img = req.file && req.file.path;

    Subreddit.findByIdAndUpdate(id, { name, description, img }, { new: true })
        .then((subreddit) => {
            console.log(subreddit)
            res.redirect(`/subreddit/${subreddit._id}`);
        }
        )
        .catch((err) => { next(err); });
}