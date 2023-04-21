const Admin = require("../models/admin");
require("../db/conn");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");
const admin = require("../models/admin");

exports.createAdmin = async (req, res) => {
  const { adminUsername, adminPassword } = req.body;
  const admin = new Admin(req.body);
  // const password = generatePassword();
  // admin.adminPassword = password;

  await admin.save(async (error, admin) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    }
    admin.setPassword(adminPassword);
    return res.status(200).json({
      message: "admin saved",
    });
  });
};

// Set Admin Password
exports.setAdminPassword = async (req, res) => {
  const password = req.body.adminPassword;
  const adminUsername = req.body.adminUsername;
  const userAlready = await Admin.findOne({
    adminUsername: adminUsername,
  }).exec();
  userAlready.setPassword(password);
  return res.status(200).json({
    admin: userAlready,
    message: "Password Set Successful",
  });
};

// login Admin
exports.loginAdmin = async (req, res) => {
  const { adminUsername, adminPassword } = req.body;
  const userAlready = await Admin.findOne({
    adminUsername: adminUsername,
  }).exec();
  if (!userAlready) {
    return res.status(400).json({
      error: "Admin Does Not Exist",
    });
  }
  const passMatch = await bcrypt.compare(
    adminPassword,
    userAlready.adminPassword
  );
  if (!passMatch) {
    return res.status(400).json({
      error: "Password is Incorrect",
    });
  }
  return res.json({
    message: "login successful",
  });
};
