const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");


router.post("/:rID/posts/:pID/comments", commentController.createComment);
router.post("/:rID/posts/:pID/comments/:cID", commentController.deleteComment);

// edit comment
router.get("/:rID/posts/:pID/comments/:cID/edit", commentController.getEditForm);
router.post("/:rID/posts/:pID/comments/:cID/edit", commentController.postEditForm);

// vote comment
router.post("/:rID/posts/:pID/comments/:cID/vote", commentController.voteComment);
