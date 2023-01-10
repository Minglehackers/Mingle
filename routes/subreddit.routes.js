const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const Subreddit = require("../models/Subreddit.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

router.get("/", (req, res, next) =>
    Subreddit.find().then((subreddits) => {
        res.render("subreddit/list", { subreddits })
    })
        .catch((err) => {
            next(err);
        })
);


router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    let postArr;
    Post.find({
        subreddit: id
    }).populate("author")
        .then((postdetails) => {
            postArr = postdetails;
            return Subreddit.findById(id)
        })
        .then((subredditDetails) => {

            const data = {
                post: postArr,
                subredditdetails: subredditDetails,

            }

            res.render("subreddit/subreddit-details", data);
        })
        .catch((err) => { next(err); });
});


router.get("/:id/post/create", (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    Subreddit
        .findById(id)
        .then((subreddit) => {
            res.render("posts/post-create", subreddit);
        })
        .catch((err) => { next(err); });
});


router.post("/:id/post/create", (req, res, next) => {
    let postId;
    const id = req.params.id

    const authorID = req.session.currentUser._id

    const newPost = {
        title: req.body.title,
        text: req.body.text,
        author: authorID,
        subreddit: id
    }
    Post.create(newPost)
        .then((postDetails) => {
            console.log("from post ____" + postDetails);
            res.redirect(`/subreddit/${id}`);


        })
        .catch((err) => {
            console.log("err creating new post to the db", err);
            next();
        });
})



// Topic page
router.get("/:id/post/:pid", (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid
    let commentArr;



    Comment.find({
        originalPost: pid,

    }).populate("originalPost author comments subreddit")
        .then((postdetails) => {

            commentArr = postdetails;
            return Post.findById(pid).populate("author")
        })
        .then((details) => {


            const data = {
                comments: commentArr,
                postDetails: details,

            }
            console.log(data, "---------------------------")
            res.render("posts/post-details", data);
        })
        .catch((err) => { next(err); });
});


// Post COMMENTS 

router.post("/:id/post/:pid", (req, res, next) => {
    const subreddit = req.params.id
    const postID = req.params.pid
    const authorID = req.session.currentUser._id
    const parentComment = req.body.parentComment || null


    let comment;

    const newComment = {
        text: req.body.text,
        author: authorID,
        originalPost: postID,
        type: req.body.type,
        subreddit: subreddit

    }

    if (parentComment) {
        newComment.parentComment = parentComment
    } else {
        newComment.parentComment = postID
    }

    console.log(newComment, "new comment")

    Comment.create(newComment)
        .then((commentDetails) => {
            comment = commentDetails
            return Post
                .findByIdAndUpdate(postID, { $push: { comments: commentDetails._id } }, { new: true })
        })
        .then((postDetails) => {

            res.redirect(`/subreddit/${subreddit}/post/${postID}`);
        }
        )
        .catch((err) => {
            console.log("err creating new post to the db", err);
            next();
        }
        );

});





// go to create form    
router.get("/create", (req, res, next) => res.render("subreddit/create",));



router.post("/create", (req, res, next) => {
    const { name, description } = req.body;
    Subreddit.create({ name, description })
        .then(() => {
            res.redirect("/subreddit");
        })
        .catch((err) => {
            next(err);
        });
});










// router.put("/:rID", subredditController.updateSubreddit);
// router.delete("/:id", subredditController.deleteSubreddit);


// router.get("/:rID/posts", subredditController.listPostsSubreddit);

// router.get("/:rID/posts/:pID", subredditController.openThread);

// router.get("/:rID/posts/create", subredditController.getCreateForm);
// router.post("/:rID/posts/create", subredditController.postCreateForm);

// router.get("/:rID/posts/:pID/edit", subredditController.getEditForm);
// router.post("/:rID/posts/:pID/edit", subredditController.postEditForm);
// router.post("/:rID/posts/:pID/delete", subredditController.deletePost);


module.exports = router;
