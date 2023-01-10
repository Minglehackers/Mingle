const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const Subreddit = require("../models/Subreddit.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");


//  go to main subreddit list
router.get("/", (req, res, next) =>
    Subreddit.find().then((subreddits) => {
        res.render("subreddit/list", { subreddits })
    })
        .catch((err) => {
            next(err);
        })
);

// go to single subreddit
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


// go to Post create form
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


// POST Post
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



// POST page
router.get("/:id/post/:pid", (req, res, next) => {
    const id = req.params.id;
    const pid = req.params.pid
    let commentArr;

    Comment.find({
        originalPost: pid
    }).populate("originalPost author")
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
    let comment;

    const newComment = {
        text: req.body.text,
        author: authorID,
        originalPost: postID
    }

    console.log(newComment)

    Comment.create(newComment)
        .then((commentDetails) => {
            comment = commentDetails
            console.log("from post ____" + commentDetails);
            res.redirect(`/subreddit/${subreddit}/post/${postID}`);


        })
        .catch((err) => {
            console.log("err creating new post to the db", err);
            next();
        });


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




//* Topics
// delete subreddit 

router.post("/:id/delete", (req, res, next) => {
    const id = req.params.id

    Post.find({ subreddit: id }).then(posts => {
        const postIdArr = posts.map(post => post._id)

        return postIdArr.forEach(id => Comment.find({ originalPost: id })
        )
    })
        .then(comments => console.log(comments))

})

// /:id/post/:pid"
//http://localhost:3000/subreddit/63bd27e02767721efd222cf5/post/63bd2877ca81a2dac734a0d8

// http://localhost:3000/subreddit/63bd27e02767721efd222cf5/post/63bd2877ca81a2dac734a0d8/edit

//  GET ROUTE for Updating an existing post 

router.get("/:id/post/:pid/edit", (req, res, next) => {
    const pid = req.params.pid
    // const text = req.body.text
    // const title = req.body.title
    Post.findById(pid)
        .then((postDetails) => {
            console.log(postDetails)
            res.render("posts/post-edit", { postDetails })
        })
        .catch(err => next(err))


})
// POST ROUTE for Updating an existing post 


router.post("/:id/post/:pid/edit", (req, res, next) => {
    const id = req.params.id
    const pid = req.params.pid
    const text = req.body.text
    const title = req.body.title
    Post.findByIdAndUpdate(pid, { text, title }, { new: true })
        .then(() => {
            res.redirect(`/subreddit/${id}/post/${pid}`)
        })
        .catch((err) => {
            next(err)
        })
})

// Subreddit.findByIdAndDelete(id)
//     .then(() => res.redirect("/subreddit"))
//     .catch((err) => {
//         next(err)
//     })




// delete post
router.post("/:id/post/:pid/delete", (req, res, next) => {
    const id = req.params.id
    const pid = req.params.pid
    // maybe delete comments too
    Comment.deleteMany({ originalPost: pid }).
        then(() => {

            return Post.findByIdAndDelete(pid)
        }).then(() =>
            res.redirect("/subreddit")
        )
        .catch((err) => {
            next(err)
        })

})

// delete comment
router.post("/:id/post/:pid/delete", (req, res, next) => {
    const id = req.params.id
    const pid = req.params.pid
    Comment.findByIdAndDelete(id)
        .catch((err) => {
            next(err)
        })

})



//edit commemt
router.get("/comment/:cid/edit", (req, res, next) => {
    const cid = req.params.cid
    const text = req.body.text
    Comment.findById(cid)
        .then((commentDetails) => {
            console.log(commentDetails)
            res.render("comments/comment-edit", { commentDetails })
        })
        .catch(err => next(err))


})


router.post("/comment/:cid/edit", (req, res, next) => {
    const cid = req.params.cid
    const text = req.body.text
    let postId;
    let subredditId;

    console.log(text)
    Comment.findByIdAndUpdate(cid, { text }, { new: true })
        .then((newComment) => {
            postId = newComment.originalPost
            return Post.findById(postId)
        })
        .then((postDetails) => {
            subredditId = postDetails.subreddit
            res.redirect(`/subreddit/${subredditId}/post/${postId}`)
        })
        .catch((err) => {
            next(err)
        })

})











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
