const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const Subreddit = require("../models/Subreddit.model");

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
    Subreddit
        .findById(id)
        .then((subreddit) => {
            res.render("subreddit/subreddit-details", subreddit);
        })
        .catch((err) => { next(err); });
});



router.get("/:id/post/create", (req, res, next) => {
    const id = req.params.id;
    Subreddit
        .findById(id)
        .then((subreddit) => {
            res.render("posts/post-create", subreddit);
        })
        .catch((err) => { next(err); });
});


router.post("/:id/post/create", (req, res, next) => {
    const id = req.params.id
    const { title, text, img } = req.body
    const { author } = req.session.currentUser._id
    console.log(author)
    const newPost = {
        title, text, img, author, subreddit: id
    }

    Subreddit.findById(id)
        .then(subreddit => {
            subreddit.topics.push(newPost);
            return subreddit.save()
        })
        .then(() => {
            res.redirect(`/subreddit/${id}`)
        })
        .catch(err => {
            next(err)
        })
})

























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
