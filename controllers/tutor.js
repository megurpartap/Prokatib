const Tutor = require("../models/tutor");
const Order = require("../models/order");
require("../db/conn");
const formidable = require("formidable");
var nodemailer = require("nodemailer");
const { createOrderFromHome } = require("./order");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const order = require("../models/order");

exports.getTutor = (req, res) => {};

exports.createTutor = async (req, res) => {
  const {
    tutorName,
    tutorEmail,
    tutorPhoneNumber,
    orderService,
    tutorPassword,
    tutorDescription,
    tutorCountry,
    tutorState,
  } = req.body;
  var userAlready = await Tutor.findOne({
    $or: [{ tutorEmail: tutorEmail }, { tutorPhoneNumber: tutorPhoneNumber }],
  }).exec();
  if (userAlready) {
    if (userAlready.isBlocked) {
      return res.status(403).json({
        error: "Tutor Is Blocked",
      });
    }
    if (userAlready.isRejected) {
      userAlready.tutorName = tutorName;
      userAlready.tutorEmail = tutorEmail;
      userAlready.tutorPhoneNumber = tutorPhoneNumber;
      userAlready.tutorCountry = tutorCountry;
      userAlready.tutorState = tutorState;
      userAlready.orderService = orderService;
      userAlready.tutorDescription = tutorDescription;
      userAlready.isRejected = false;
      await userAlready.setPassword("hello");
      return res.status(200).json({
        tutor: userAlready,
        message: "Tutor Is Updated",
      });
    }
    return res.status(409).json({
      error: "Tutor already exists",
    });
  }

  const tutor = new Tutor(req.body);
  // const password = generatePassword();
  // admin.adminPassword = password;

  await tutor.save(async (error, admin) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error,
      });
    }
    tutor.setPassword(tutorPassword);
    return res.status(200).json({
      tutor: tutor,
      message: "tutor saved",
    });
  });
};

// Set Tutor Password
exports.setTutorPassword = async (req, res) => {
  const password = req.body.tutorPassword;
  const tutorEmail = req.body.tutorEmail;
  const userAlready = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  userAlready.setPassword(password);
  return res.status(200).json({
    tutor: userAlready,
    message: "Password Set Successful",
  });
};

// login Tutor
exports.loginTutor = async (req, res) => {
  const { tutorEmail, tutorPassword } = req.body;
  const userAlready = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  if (!userAlready) {
    return res.status(400).json({
      error: "Tutor Does Not Exist",
    });
  }
  if (userAlready.isBlocked) {
    return res.status(403).json({
      error: "Tutor is Blocked",
    });
  }

  if (userAlready.isRejected) {
    return res.status(401).json({
      error: "Tutor is Rejected",
    });
  }
  const passMatch = await bcrypt.compare(
    tutorPassword,
    userAlready.tutorPassword
  );
  if (!passMatch) {
    return res.status(400).json({
      error: "Password is Incorrect",
    });
  }
  return res.json({
    tutor: userAlready,
    message: "login successful",
  });
};

exports.getNewTutors = async (req, res) => {
  const tutorArray = await Tutor.find({
    isApproved: false,
    isBlocked: false,
    isRejected: false,
  }).exec();
  return res.json({
    tutorArray: tutorArray,
  });
};

exports.approveTutor = async (req, res) => {
  const tutor = await Tutor.findOne({ _id: req.body.tutorId }).exec();
  tutor.isApproved = true;
  tutor.isRejected = false;
  tutor.save((err, tutor) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Tutor Approved",
    });
  });
};

exports.blockTutor = async (req, res) => {
  const tutor = await Tutor.findOne({ _id: req.body.tutorId }).exec();
  tutor.isBlocked = true;
  tutor.isRejected = false;
  tutor.isApproved = false;
  tutor.save((err, tutor) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Tutor Blocked",
    });
  });
};

exports.rejectTutor = async (req, res) => {
  const tutor = await Tutor.findOne({ _id: req.body.tutorId }).exec();
  tutor.isBlocked = false;
  tutor.isRejected = true;
  tutor.isApproved = false;
  tutor.rejectionReason = req.body.rejectionReason;
  tutor.save((err, tutor) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    const message = `Hi! We're sorry to inform you that your email Id has been rejected by the admin. Reason for Rejection - ${tutor.rejectionReason}. You can try again signing up after making the aforementioned changes.`;
    const subject = `Your Application Has Been Rejected`;
    sendEmail(tutor.tutorEmail, message, subject);
    return res.status(200).json({
      message: "Tutor Rejected",
    });
  });
};

exports.getApprovedTutors = async (req, res) => {
  const tutorArray = await Tutor.find({
    isApproved: true,
  }).exec();
  return res.json({
    tutorArray: tutorArray,
  });
};

exports.getTutorDetails = async (req, res) => {
  var userAlready;
  if (req.body.tutorEmail) {
    userAlready = await Tutor.findOne({
      tutorEmail: req.body.tutorEmail,
    }).exec();
  } else if (req.body.tutorId) {
    userAlready = await Tutor.findById(req.body.tutorId).exec();
  }
  return res.status(200).json({
    tutor: userAlready,
  });
};

exports.acceptOrder = async (req, res) => {
  var userAlready = await Tutor.findOne({
    tutorEmail: req.body.tutorEmail,
  }).exec();
  const orderId = req.body.orderId;
  userAlready.orders.push(orderId);
  userAlready.save(async (error, tutor) => {
    if (!error) {
      var order = await Order.findById(orderId);
      order.tutorAssigned = tutor._id;
      order.save((error, order) => {
        if (!error) {
          res.status(200).json({
            message: "Order Accepted",
          });
        }
      });
    }
  });
};

exports.getTutorOngoingOrders = async (req, res) => {
  const orderArray = await Order.find({
    completed: false,
    isCancelled: false,
    tutorAssigned: req.body.tutorEmail,
  }).exec();
  console.log(orderArray);
  res.status(200).json({
    orderArray: orderArray,
  });
};

exports.getTutorCompletedOrders = async (req, res) => {
  const orderArray = await Order.find({
    completed: true,
    isCancelled: false,
    tutorAssigned: req.body.tutorEmail,
  }).exec();
  res.status(200).json({
    orderArray,
  });
};

// forgotPassword
exports.forgotPassword = async (req, res) => {
  const tutorEmail = req.body.tutorEmail;
  const tutor = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  if (!tutor) {
    return res.status(400).json({
      error: "tutor does not exist",
    });
  }
  var otp = Math.floor(1000 + Math.random() * 9000);
  otp = otp.toString();
  tutor.otp = otp;
  await tutor.save();
  sendOtp(otp, tutorEmail);
  return res.status(200).json({
    message: "Otp Sent",
  });
};

const sendOtp = (otp, tutorEmail) => {
  const message = "Your OTP For Password Change is " + otp;
  const subject = "OTP for Password Reset";
  sendEmail(tutorEmail, message, subject);
};

const sendEmail = (to, message, subject) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "prokatib@gmail.com",
      pass: "Hello123@",
    },
  });

  var mailOptions = {
    from: '"Prokatib" <prokatib@gmail.com>',
    to: to,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.checkOtp = async (req, res) => {
  const otp = req.body.otp;
  const tutorEmail = req.body.tutorEmail;
  const tutor = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  if (otp == tutor.otp) {
    return res.status(200).json({
      message: "otp matched",
    });
  }
  return res.status(400).json({
    error: "otp mismatch",
  });
};

exports.checkOtpMiddleware = async (req, res, next) => {
  const otp = req.body.otp;
  const tutorEmail = req.body.tutorEmail;
  const tutor = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  if (otp == undefined) {
    return res.status(400).json({
      error: "Provide an otp",
    });
  } else if (tutor.otp == undefined) {
    return res.status(400).json({
      error: "generate an otp first. Not present in DB",
    });
  }
  if (otp == tutor.otp) {
    tutor.otp == undefined;
    next();
  } else
    return res.status(400).json({
      error: "otp mismatch",
    });
};

exports.newPassword = async (req, res) => {
  const tutorEmail = req.body.tutorEmail;
  const tutor = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  const newPassword = req.body.password;
  await tutor.setPassword(newPassword);
  return res.json({
    message: "Password Changed",
  });
};

exports.updateTutorEmail = async (req, res) => {
  const tutorEmail = req.body.tutorEmail;
  const tutor = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  tutor.tutorEmail = req.body.newTutorEmail;
  tutor.save((error, tutor) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    }

    return res.status(200).json({
      message: "Tutor Email Updated",
    });
  });
};

exports.updateTutorPhoneNumber = async (req, res) => {
  const tutorEmail = req.body.tutorEmail;
  const tutor = await Tutor.findOne({
    tutorEmail: tutorEmail,
  }).exec();
  tutor.tutorPhoneNumber = req.body.newTutorPhoneNumber;
  tutor.save((error, tutor) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    }
    return res.status(200).json({
      message: "Tutor Phone Number Updated",
    });
  });
};
