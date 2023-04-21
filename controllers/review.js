const review = require("../models/review");
const Review = require("../models/review");
const Order = require("../models/order");
require("../db/conn");

exports.createReview = (req, res) => {
  const { customerName, customerReview, orderId, stars } = req.body;
  const review = new Review(req.body);
  review.save(async (error, review) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "Review could not be saved",
      });
    }
    const existingOrder = await Order.findById(orderId).exec();
    existingOrder.orderReview = customerReview;
    await existingOrder.save();
    return res.json({
      message: "Review Saved",
    });
  });
};

exports.getHighlightedReviews = async (req, res) => {
  const reviewsArray = await Review.find({ highlighted: true }).exec();
  res.status(200).json({
    reviewsArray: reviewsArray,
  });
};

exports.getNotHighlightedReviews = async (req, res) => {
  const reviewsArray = await Review.find({ highlighted: false }).exec();
  res.status(200).json({
    reviewsArray: reviewsArray,
  });
};

exports.getReviews = async (req, res) => {
  const reviewsArray = await Review.find({}).exec();
  res.status(200).json({
    reviewsArray: reviewsArray,
  });
};

exports.highlightReview = async (req, res) => {
  const review = await Review.findById(req.body.reviewId).exec();
  review.highlighted = true;
  const d = new Date();
  review.highlightedDate = `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()}`;
  review.save((error, review) => {
    if (error) {
      return res.status(500).json({
        error: "Review Cannot be Highlighted",
      });
    }
    return res.json({
      message: "Review Highlighted",
    });
  });
};

exports.unHighlightReview = async (req, res) => {
  const review = await Review.findById(req.body.reviewId).exec();
  review.highlighted = false;
  review.save((error, review) => {
    if (error) {
      return res.status(500).json({
        error: "Review Cannot be unHighlighted",
      });
    }
    return res.json({
      message: "Review unHighlighted",
    });
  });
};

exports.removeReview = async (req, res) => {
  Review.deleteOne({ _id: req.body.reviewId })
    .then(function () {
      res.json({
        message: "Review Deleted",
      });
    })
    .catch(function (error) {
      res.status(500).json({
        error: "Review Could Not be Deleted",
      });
    });
};
