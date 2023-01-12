const express = require("express");
const router = express.Router();
const inboxController = require("./controllers/inboxController");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isSamePerson = require("../middleware/isSamePerson");
const youShallNotPass = require("../middleware/youShallNotPass")


router.get("/", inboxController.displayInbox);
router.get("/sendmsg/:id", inboxController.getMessageForm);
router.post("/sendmsg/:id", inboxController.sendMessage);
router.get("/chatwith/:Uid", inboxController.displayConversation);



module.exports = router;