const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    customerReview: {
      type: String,
    },
    orderId: {
      type: ObjectId,
      ref: "Order",
    },
    stars: {
      type: Number,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    highlightedDate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
