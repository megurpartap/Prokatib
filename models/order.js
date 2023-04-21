const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = mongoose.Schema(
  {
    orderService: {
      type: String,
      // required: true,
    },
    orderFiles: {
      type: String,
    },
    orderInstructions: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: ObjectId,
      ref: "Customer",
    },
    customerEmail: {
      type: String,
    },
    customerPhoneNumber: {
      type: String,
    },
    profileCompleted: {
      type: Boolean,
      default: true,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    adminApproved: {
      type: Boolean,
      default: false,
    },
    orderBudget: {
      type: String,
    },
    orderDuration: {
      type: String,
    },
    orderTitle: {
      type: String,
    },
    tutorAssigned: {
      type: ObjectId,
      ref: "Tutor",
    },
    orderReview: {
      type: String,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.virtual("fileUploaded").get(function () {
  if (this.orderFiles.length == 0) {
    return false;
  } else {
    return true;
  }
});
module.exports = mongoose.model("Order", orderSchema);
