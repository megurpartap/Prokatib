const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const tutorSchema = mongoose.Schema(
  {
    tutorName: {
      type: String,
      required: true,
    },
    tutorEmail: {
      type: String,
      default: false,
    },
    tutorPhoneNumber: {
      type: String,
      required: true,
    },
    tutorCountry: {
      type: String,
      required: true,
    },
    tutorState: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: ObjectId,
        ref: "Order",
      },
    ],
    orderService: {
      type: Array,
    },
    tutorPassword: {
      type: String,
      // required: true,
    },
    tutorDescription: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

tutorSchema.methods.setPassword = async function (newPassword) {
  const tutor = this;
  try {
    bcrypt.hash(newPassword, 12, async (err, hash) => {
      if (err) return err;
      tutor.tutorPassword = hash;
      await tutor.save();
    });
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model("Tutor", tutorSchema);
