const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const commentController = require("./controllers/commentController");
const postController = require("./controllers/postController");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isSamePerson = require("../middleware/isSamePerson");
const youShallNotPass = require("../middleware/youShallNotPass")

// *** SUBREDDITS ***
router.get("/create", isLoggedIn, subredditController.getCreateForm);
router.post("/create", isLoggedIn, subredditController.postCreateForm);
router.get("/", subredditController.listReddits);
router.get("/:id", subredditController.displaySingleReddit);
router.post("/:id/delete", isLoggedIn, subredditController.deleteSubreddit)
// TODO: Update subreddit


//*** POSTS ***
router.get("/:id/post/create", isLoggedIn, postController.getCreateForm);
router.post("/:id/post/create", isLoggedIn, postController.postPost);
router.get("/:id/post/:pid", isLoggedIn, postController.displayView);
router.post("/:id/post/:pid", isLoggedIn, postController.postNew);
router.get("/:id/post/:pid/edit", isLoggedIn, isSamePerson, postController.getEditForm)
router.post("/:id/post/:pid/edit", isLoggedIn, isSamePerson, postController.postEdit)
router.post("/:id/post/:pid/delete", isLoggedIn, youShallNotPass, postController.delete)


// *** COMMENTS ***
router.post("/comment/:cid/delete", isLoggedIn, commentController.delete)
router.get("/comment/:cid/edit", isLoggedIn, commentController.getEditForm)
router.post("/comment/:cid/edit", isLoggedIn, commentController.postEdit)



module.exports = router;
