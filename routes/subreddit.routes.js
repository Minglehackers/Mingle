const express = require("express");
const router = express.Router();
const subredditController = require("./controllers/subredditController");
const commentController = require("./controllers/commentController");
const postController = require("./controllers/postController");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isSamePerson = require("../middleware/isSamePerson");
const youShallNotPass = require("../middleware/youShallNotPass")
const fileUploader = require('../config/cloudinary.config');

// *** SUBREDDITS ***
router.get("/create", isLoggedIn, subredditController.getCreateForm);
router.post("/create", isLoggedIn, fileUploader.single('img'), subredditController.postCreateForm);
router.get("/", subredditController.listReddits);
router.get("/filter", subredditController.filterReddits)
router.get("/:id", subredditController.displaySingleReddit);
router.post("/:id/delete", isLoggedIn, subredditController.deleteSubreddit)
// TODO: Update subreddit
router.get("/:id/edit", isLoggedIn, isSamePerson, subredditController.getEditForm)
router.post("/:id/edit", isLoggedIn, isSamePerson, fileUploader.single('img'), subredditController.postEditForm)

//*** POSTS ***
router.get("/:id/post/create", isLoggedIn, postController.getCreateForm);
router.post("/:id/post/create", isLoggedIn, fileUploader.single('img'), postController.postPost);
router.get("/:id/post/:pid", postController.displayView);
router.post("/:id/post/:pid", isLoggedIn, postController.postNew);
router.get("/:id/post/:pid/edit", isLoggedIn, isSamePerson, postController.getEditForm)
router.post("/:id/post/:pid/edit", isLoggedIn, isSamePerson, fileUploader.single('img'), postController.postEdit)
router.post("/:id/post/:pid/delete", isLoggedIn, postController.delete)

// router.post("/:id/post/create", (req, res, next) => {

//     const authorID = req.session.currentUser._id

//     const newPost = {
//         title: req.body.title,
//         text: req.body.text,
//         author: authorID,
//         subreddit: req.body.subreddit,
//     }

//     if (req.body.title === "" || req.body.text === "") {
//         res.status(400).render(`posts/new-post`, {
//           errorMessage:
//             "All fields are mandatory. Please provide a title and a text.",
//         });
//         return;
//       }
//       if (newPost.title.length < 5 || newPost.text.length < 5) {
//         res.status(400).render(`posts/new-post`, {
//           errorMessage: "The title and the text need to be at least 5 characters long.",
//         });

//         return;
//       }

//       Post.create(newPost)
//       .then((postDetails) => {
//           console.log("from post ____" + postDetails);

//           res.redirect(`/subreddit/${postDetails.subreddit}/post/${postDetails._id}`);


//       })
//       .catch((err) => {
//           if (err instanceof mongoose.Error.ValidationError) {
//               res.status(500).render(`posts/new-post`, { errorMessage: err.message });
//             } else {
//               next(err);
//             }
//       });
// })






// ? Votes
router.post("/:id/post/:pid/upvote/:type", isLoggedIn, postController.upvote)
router.post("/:id/post/:pid/downvote/:type", isLoggedIn, postController.downvote)

// router.post("/:id/post/:pid/upvotefromlist", isLoggedIn, postController.upvote)
// router.post("/:id/post/:pid/downvote", isLoggedIn, postController.downvote)

// *** COMMENTS ***
router.post("/comment/:cid/delete", isLoggedIn, commentController.delete)
router.get("/comment/:cid/edit", isLoggedIn, commentController.getEditForm)
router.post("/comment/:cid/edit", isLoggedIn, commentController.postEdit)

module.exports = router;
