const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = mongoose.Schema(
  {
    adminUsername: {
      type: String,
      required: true,
    },
    adminPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

adminSchema.methods.setPassword = async function (newPassword) {
  const admin = this;
  try {
    bcrypt.hash(newPassword, 12, async (err, hash) => {
      if (err) return err;
      admin.adminPassword = hash;
      await admin.save();
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = mongoose.model("Admin", adminSchema);
