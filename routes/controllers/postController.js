const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subreddit = require("../../models/Subreddit.model");

exports.listSubreddits = (req, res, next) => {
    Subreddit.find()
        .then((subreddits) => {
            res.render("subreddits/subreddit-list", { subreddits });
        })
        .catch((err) => {
            next(err);
        });
};


exports.getSubreddit = (req, res, next) => {
    const { rID } = req.params;
    Subreddit
        .findById(rID).populate("posts")
        .then((subreddit) => {
            res.render("subreddits/subreddit-detail", subreddit);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
};


exports.createSubreddit = (req, res, next) => {
    const { name, description } = req.body;
    Subreddit.create({ name, description })
        .then(() => {
            res.redirect("/subreddit-list");
        })
        .catch((err) => {
            next(err);
        });
}


exports.updateSubreddit = (req, res, next) => {
    const { rID } = req.params;
    const { name, description } = req.body;
    Subreddit
        .findById
        (rID)
        .then((subreddit) => {
            subreddit.name = name;
            subreddit.description = description;
            return subreddit.save();
        })
        .then(() => {
            res.redirect("/subreddit-list");
        })
        .catch((err) => {
            next(err);
        });
}


exports.deleteSubreddit = (req, res, next) => {
    // delete all posts from subreddit and then delete subreddit
    const { rID } = req.params;
    Subreddit
        .findByIdAndDelete(rID)
        .then(() => {
            res.redirect("/subreddit-list");
        }
        ).then(() => {
            Post.deleteMany({
                subreddit
                    : rID
            })
        })
        .catch((err) => {
            next(err);
        }
        );

}








exports.listPostsSubreddit = (req, res, next) => {
    const { id } = req.params;
    Subreddit.findById(id)
        .populate("posts")
        .then((subreddit) => {
            res.render("posts/post-list", { subreddit });
        })
        .catch((err) => {
            next(err);
        });
};


exports.openThread = (req, res, next) => {
    const { id } = req.params;



}

exports.getCreateForm = (req, res, next) => {
    res.render("celebrities/new-celebrity");
}

exports.postCreateForm = (req, res, next) => {
    const { name, occupation, catchPhrase } = req.body;
    Celebrity.create({ name, occupation, catchPhrase })
        .then(() => {
            res.redirect("/celebrities-list");
        })
        .catch((err) => {
            next(err);
        });
}


exports.getEditForm = (req, res, next) => {
    const { id } = req.params;
    Celebrity
        .findById(id)
        .then((celebrity) => {
            res.render("celebrities/celebrity-edit", celebrity);
        }
        )
        .catch((err) => {
            next(err);
        }
        );
}

exports.postEditForm = (req, res, next) => {
    const { id } = req.params;
    const { name, occupation, catchPhrase } = req.body;
    Celebrity.findById(id)
        .then((celebrity) => {
            celebrity.name = name;
            celebrity.occupation = occupation;
            celebrity.catchPhrase = catchPhrase;
            celebrity.save()
                .then(() => {
                    res.redirect("/celebrities/celebrity-list");
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch((err) => {
            next(err);
        });
}


exports.delete = (req, res, next) => {
    const { id } = req.params;
    Celebrity.findByIdAndDelete(id)
        .then(() => {
            res.redirect("/celebrities/celebrity-list");
        })
        .catch((err) => {
            next(err);
        });
}