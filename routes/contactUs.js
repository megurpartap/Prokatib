const express = require("express");
const router = express.Router();
const {
  createContactUs,
  getContactUsMessages,
  replyToMessage,
} = require("../controllers/contactUs");
require("../db/conn");

// create Contact Us
router.post("/", createContactUs);
router.get("/getContactUsMessages", getContactUsMessages);
router.post("/replyToMessage", replyToMessage);

module.exports = router;
