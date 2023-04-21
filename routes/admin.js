const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const {
  createAdmin,
  loginAdmin,
  setAdminPassword,
} = require("../controllers/admin");
require("../db/conn");

// Router Params
// router.param("campaignId", getCampaignById);

// create Admin
router.post("/create", createAdmin);
// set Password
router.post("/setPassword", setAdminPassword);
// login Admin
router.post("/login", loginAdmin);

module.exports = router;
