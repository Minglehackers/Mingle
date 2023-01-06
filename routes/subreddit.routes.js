const express = require("express");
const router = express.Router();


const subredditController = require("../controllers/subredditController");


router.get("/", subredditController.listSubreddits);
router.get("/:rID", subredditController.getSubreddit);
router.post("/", subredditController.createSubreddit);
router.put("/:rID", subredditController.updateSubreddit);
router.delete("/:id", subredditController.deleteSubreddit);


router.get("/:rID/posts", subredditController.listPostsSubreddit);

router.get("/:rID/posts/:pID", subredditController.openThread);

router.get("/:rID/posts/create", subredditController.getCreateForm);
router.post("/:rID/posts/create", subredditController.postCreateForm);

router.get("/:rID/posts/:pID/edit", subredditController.getEditForm);
router.post("/:rID/posts/:pID/edit", subredditController.postEditForm);
router.post("/:rID/posts/:pID/delete", subredditController.deletePost);


module.exports = router;
