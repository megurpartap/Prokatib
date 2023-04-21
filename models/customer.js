const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const customerSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: false,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: ObjectId,
        ref: "Order",
      },
    ],
    customerPassword: {
      type: String,
      // required: true,
    },
    otp: {
      type: String,
    },
    // bookingFees: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

customerSchema.methods.setPassword = async function (newPassword) {
  const customer = this;
  try {
    bcrypt.hash(newPassword, 12, async (err, hash) => {
      if (err) return err;
      customer.customerPassword = hash;
      await customer.save();
    });
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model("Customer", customerSchema);
