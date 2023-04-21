const Customer = require("../models/customer");
const Order = require("../models/order");
require("../db/conn");
const formidable = require("formidable");
var nodemailer = require("nodemailer");
const {
  createOrderFromHome
} = require("./order");
const bcrypt = require("bcryptjs");

exports.getCustomer = (req, res) => {};

exports.createCustomer = async (req, res) => {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, async (err, fields, files) => {
    const {
      customerEmail,
      customerPhoneNumber
    } = fields;
    const userAlready = await Customer.findOne({
      $or: [{
          customerEmail: customerEmail
        },
        {
          customerPhoneNumber: customerPhoneNumber
        },
      ],
    }).exec();
    if (userAlready && userAlready.customerPassword) {
      return res.status(400).json({
        error: "User already exists",
      });
    } else if (userAlready && !userAlready.customerPassword) {
      return res.status(403).json({
        customer: userAlready,
        error: "password not yet set",
      });
    }
    const customer = new Customer(fields);
    // const password = generatePassword();
    // customer.customerPassword = password;
    await customer.save(async (error, customer) => {
      if (error) {
        return res.status(500).json({
          error: error,
        });
      }
      await createOrderFromHome(req, res, fields, files);
    });

    // message = `Here are your login details: \n Email: ${customer.customerEmail} \n Password: ${password}`;
    // sendEmail(customer.customerEmail, message);
    return res.status(200).json({
      customer: customer,
      message: "customer and order saved",
    });
  });
  // const { name, email, phoneNumber, } = req.body;
};

const generatePassword = () => {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

// Set Customer Password
exports.setCustomerPassword = async (req, res) => {
  const password = req.body.customerPassword;
  const customerEmail = req.body.customerEmail;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  userAlready.setPassword(password);
  return res.status(200).json({
    customer: userAlready,
    message: "Password Set Successful",
  });
};

// login Customer
exports.loginCustomer = async (req, res) => {
  const {
    customerEmail,
    customerPassword
  } = req.body;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  // console.log(userAlready.customerPassword);
  if (!userAlready) {
    return res.status(400).json({
      error: "User Does Not Exist",
    });
  }
  if (userAlready && !userAlready.customerPassword) {
    return res.status(403).json({
      customer: userAlready,
      error: "password not yet set",
    });
  }
  const passMatch = await bcrypt.compare(
    customerPassword,
    userAlready.customerPassword
  );
  if (!passMatch) {
    return res.status(400).json({
      error: "Password is Incorrect",
    });
  }
  return res.json({
    customer: userAlready,
    message: "login successful",
  });
};

exports.getCustomerOrders = async (req, res) => {
  const customerEmail = req.body.customerEmail;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
};

const liveOrdersArray = [];
exports.getLiveOrders = async function (req, res) {
  const customerEmail = req.body.customerEmail;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  const liveOrdersArray = Promise.all(
    userAlready.orders.map(async function (orderId) {
      const order = await Order.findById(orderId).exec();
      if (!order.completed && !order.isCancelled) {
        return order;
      }
    })
  );
  liveOrdersArray.then((data) => {
    const liveOrdersFilteredArray = data.filter((order) => {
      return order != undefined;
    });
    return res.status(200).json({
      liveOrdersArray: liveOrdersFilteredArray,
    });
  });
};

const previousOrdersArray = [];
exports.getPreviousOrders = async function (req, res) {
  const customerEmail = req.body.customerEmail;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  const previousOrdersArray = Promise.all(
    userAlready.orders.map(async function (orderId) {
      const order = await Order.findById(orderId).exec();
      if (order.completed && !order.isCancelled) {
        return order;
      }
    })
  );
  previousOrdersArray.then((data) => {
    const previousOrdersFilteredArray = data.filter((order) => {
      return order != undefined;
    });
    return res.status(200).json({
      previousOrdersArray: previousOrdersFilteredArray,
    });
  });
};

const cancelledOrdersArray = [];
exports.getCancelledOrders = async function (req, res) {
  const customerEmail = req.body.customerEmail;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  const cancelledOrdersArray = Promise.all(
    userAlready.orders.map(async function (orderId) {
      const order = await Order.findById(orderId).exec();
      if (order.isCancelled) {
        return order;
      }
    })
  );
  cancelledOrdersArray.then((data) => {
    const cancelledOrdersFilteredArray = data.filter((order) => {
      return order != undefined;
    });
    return res.status(200).json({
      cancelledOrdersArray: cancelledOrdersFilteredArray,
    });
  });
};

// forgotPassword
exports.forgotPassword = async (req, res) => {
  const customerEmail = req.body.customerEmail;
  const customer = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  if (!customer) {
    return res.status(400).json({
      error: "customer does not exist",
    });
  }
  if (customer && !customer.customerPassword) {
    return res.status(403).json({
      customer: customer,
      error: "password not yet set",
    });
  }
  var otp = Math.floor(1000 + Math.random() * 9000);
  otp = otp.toString();
  customer.otp = otp;
  await customer.save();
  sendOtp(otp, customerEmail);
  return res.status(200).json({
    message: "Otp Sent",
  });
};

const sendOtp = (otp, customerEmail) => {
  const message = "Your OTP For Password Change is " + otp;
  const subject = "OTP for Password Reset";
  sendEmail(customerEmail, message, subject);
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
  const customerEmail = req.body.customerEmail;
  const customer = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  if (otp == customer.otp) {
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
  const customerEmail = req.body.customerEmail;
  const customer = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  if (otp == undefined) {
    return res.status(400).json({
      error: "Provide an otp",
    });
  } else if (customer.otp == undefined) {
    return res.status(400).json({
      error: "generate an otp first. Not present in DB",
    });
  }
  if (otp == customer.otp) {
    customer.otp == undefined;
    next();
  } else
    return res.status(400).json({
      error: "otp mismatch",
    });
};

exports.newPassword = async (req, res) => {
  const customerEmail = req.body.customerEmail;
  const customer = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  const newPassword = req.body.password;
  await customer.setPassword(newPassword);
  return res.json({
    message: "Password Changed",
  });
};

exports.updateCustomerEmail = async (req, res) => {
  const customerEmail = req.body.customerEmail;
  const customer = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  customer.customerEmail = req.body.newCustomerEmail;
  customer.save((error, customer) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    }
    customer.orders.forEach(async (orderId) => {
      var order = await Order.findById(orderId).exec();
      order.customerEmail = customer.customerEmail;
      order.save();
    });

    return res.status(200).json({
      message: "Customer Email Updated",
    });
  });
};

exports.updateCustomerPhoneNumber = async (req, res) => {
  const customerEmail = req.body.customerEmail;
  const customer = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  customer.customerPhoneNumber = req.body.newCustomerPhoneNumber;
  customer.save((error, customer) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    }
    customer.orders.forEach(async (orderId) => {
      var order = await Order.findById(orderId).exec();
      order.customerPhoneNumber = customer.customerPhoneNumber;
      order.save();
    });

    return res.status(200).json({
      message: "Customer Email Updated",
    });
  });
};