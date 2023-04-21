const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const {
  createCustomer,
  loginCustomer,
  setCustomerPassword,
  getCustomerOrders,
  getLiveOrders,
  getPreviousOrders,
  forgotPassword,
  checkOtp,
  checkOtpMiddleware,
  newPassword,
  updateCustomerEmail,
  updateCustomerPhoneNumber,
  getCancelledOrders,
} = require("../controllers/customer");
require("../db/conn");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-%-" + Date.now());
  },
});
const upload = multer({ storage: storage });

// Router Params
// router.param("campaignId", getCampaignById);

// create Customer
router.post("/create", createCustomer);
// set Password
router.post("/setPassword", setCustomerPassword);
// login Customer
router.post("/login", loginCustomer);
// getOrder
router.post("/getOrders", getCustomerOrders);
// getLiveOrders
router.post("/getLiveOrders", getLiveOrders);
// getPreviousOrders
router.post("/getPreviousOrders", getPreviousOrders);
// getPreviousOrders
router.post("/getCancelledOrders", getCancelledOrders);
// Forgot Password
router.post("/forgotPassword", forgotPassword);
// Send Otp Here
router.post("/checkOtp", checkOtp);
// Set New Password
router.post("/newPassword", checkOtpMiddleware, newPassword);
// update customer email
router.post("/updateCustomerEmail", updateCustomerEmail);
// update customer Phone Number
router.post("/updateCustomerPhoneNumber", updateCustomerPhoneNumber);

module.exports = router;
