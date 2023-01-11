const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isSamePerson = require("../middleware/isSamePerson");


router.post("/:rID/posts/:pID/comments", commentController.createComment);

// delete comment
router.post("/:rID/posts/:pID/comments/:cID", commentController.deleteComment);

// edit comment
router.get("/:rID/posts/:pID/comments/:cID/edit", isLoggedIn, commentController.getEditForm);
router.post("/:rID/posts/:pID/comments/:cID/edit", isLoggedIn, commentController.postEditForm);

// vote comment
router.post("/:rID/posts/:pID/comments/:cID/vote", commentController.voteComment);
