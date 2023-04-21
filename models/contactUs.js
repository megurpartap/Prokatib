const mongoose = require("mongoose");

const contactUsSchema = mongoose.Schema(
  {
    contactUsName: {
      type: String,
      required: true,
    },
    contactUsEmail: {
      type: String,
      default: false,
    },
    contactUsMessage: {
      type: String,
      required: true,
    },
    replied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
