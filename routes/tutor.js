const express = require("express");
const router = express.Router();
const Tutor = require("../models/tutor");
const {
  createTutor,
  loginTutor,
  setTutorPassword,
  getNewTutors,
  approveTutor,
  blockTutor,
  rejectTutor,
  getApprovedTutors,
  getTutorDetails,
  acceptOrder,
  getTutorOngoingOrders,
  getTutorCompletedOrders,
  forgotPassword,
  checkOtp,
  checkOtpMiddleware,
  newPassword,
  updateTutorEmail,
  updateTutorPhoneNumber,
} = require("../controllers/tutor");
require("../db/conn");

// Router Params
// router.param("campaignId", getCampaignById);

// create Tutor
router.post("/create", createTutor);
// set Password
router.post("/setPassword", setTutorPassword);
// login Tutor
router.post("/login", loginTutor);
// get new Tutors
router.get("/getNewTutors", getNewTutors);
// approve Tutor
router.post("/approveTutor", approveTutor);
// block Tutor
router.post("/blockTutor", blockTutor);
// reject Tutor
router.post("/rejectTutor", rejectTutor);
// get Approved Tutors
router.get("/getApprovedTutors", getApprovedTutors);
// get Tutor Details
router.post("/getTutorDetails", getTutorDetails);
// accept order
router.post("/acceptOrder", acceptOrder);
// get Ongoing Orders
router.post("/getTutorOngoingOrders", getTutorOngoingOrders);
// get Completed Orders
router.post("/getTutorCompletedOrders", getTutorCompletedOrders);
// Forgot Password
router.post("/forgotPassword", forgotPassword);
// Send Otp Here
router.post("/checkOtp", checkOtp);
// Set New Password
router.post("/newPassword", checkOtpMiddleware, newPassword);
// update tutor email
router.post("/updateTutorEmail", updateTutorEmail);
// update tutor Phone Number
router.post("/updateTutorPhoneNumber", updateTutorPhoneNumber);

module.exports = router;