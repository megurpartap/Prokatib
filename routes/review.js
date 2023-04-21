const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  highlightReview,
  getHighlightedReviews,
  getNotHighlightedReviews,
  unHighlightReview,
  removeReview,
} = require("../controllers/review");
require("../db/conn");

// Router Params
// router.param("campaignId", getCampaignById);

// create Review
router.post("/create", createReview);

// get all review
router.get("/all", getReviews);

// get highlighted review
router.get("/getHighlightedReviews", getHighlightedReviews);

// get Not highlighted review
router.get("/getNotHighlightedReviews", getNotHighlightedReviews);

// highlightReview
router.post("/highlightReview", highlightReview);

// un-highlightReview
router.post("/unHighlightReview", unHighlightReview);

// remove review
router.post("/removeReview", removeReview);

module.exports = router;