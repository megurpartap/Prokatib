const Order = require("../models/order");
const Customer = require("../models/customer");
const Tutor = require("../models/tutor");
const fs = require("fs");
const path = require("path");
const { find } = require("../models/customer");
const formidable = require("formidable");
require("../db/conn");
const multer = require("multer");
const zip = require("express-zip");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "temp-%-" + Date.now() + "-%-" + file.originalname);
  },
});

exports.upload = multer({ storage: storage });

exports.getOrder = (req, res) => {};

exports.createOrderFromHome = async (req, res, fields, files) => {
  const order = new Order(fields);
  var customer = await Customer.findOne({
    customerEmail: fields.customerEmail,
  }).exec();
  order.customer = customer._id;
  order.customerEmail = customer.customerEmail;
  order.customerPhoneNumber = fields.customerPhoneNumber;

  order.save(async (error, order) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    }
    customer.orders.push(order._id);
    await customer.save();
    const orderFilesArray = order.orderFiles
      .split(",")
      .slice(0, order.orderFiles.split(",").length - 1);
    orderFilesArray.forEach((file) => {
      file.split("-%-");
      fs.rename(
        `./uploads/${file}`,
        `./uploads/${order._id}-${file.split("-%-").slice(1).join("-%-")}`,
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    });
    const directoryPath = path.join(__dirname + "/../uploads");
    // passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      //listing all files using forEach
      files.forEach(function (file) {
        if (
          file.split("-%-")[0] == "temp" &&
          file.split("-%-")[1].length < 24
        ) {
          fs.unlinkSync(path.join(directoryPath + `/${file}`));
        }
      });
    });
  });
};

exports.getAllOrders = async (req, res) => {
  const orderArray = await Order.find({}).exec();
  return res.json({
    orderArray: orderArray,
  });
};

exports.getOrderDetails = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await Order.findById(orderId).exec();
  return res.status(200).json({
    order: order,
  });
};

exports.createOrder = async (req, res) => {
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.parse(req, async (err, fields, files) => {
    const order = new Order(fields);
    var customer = await Customer.findOne({
      customerEmail: fields.customerEmail,
    }).exec();
    order.customer = customer._id;
    order.customerEmail = customer.customerEmail;
    order.customerPhoneNumber = customer.customerPhoneNumber;
    order.save(async (error, order) => {
      console.log(error);
      customer.orders.push(order._id);
      customer = await customer.save();
      if (error) {
        return res.status(500).json({
          error: error,
        });
      }
      const orderFilesArray = order.orderFiles
        .split(",")
        .slice(0, order.orderFiles.split(",").length - 1);
      orderFilesArray.forEach((file) => {
        file.split("-%-");
        fs.rename(
          `./uploads/${file}`,
          `./uploads/${order._id}-${file.split("-%-").slice(1).join("-%-")}`,
          (error) => {
            if (error) {
              console.log(error);
            }
          }
        );
      });
      const directoryPath = path.join(__dirname + "/../uploads");
      // passsing directoryPath and callback function
      fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
          if (
            file.split("-%-")[0] == "temp" &&
            file.split("-%-")[1].length < 24
          ) {
            fs.unlinkSync(path.join(directoryPath + `/${file}`));
          }
        });
      });
      return res.status(200).json({
        customer: customer,
        order: order,
        message: "Order saved",
      });
    });
  });
};

exports.getNewOrders = async (req, res) => {
  const orderArray = await Order.find({
    adminApproved: false,
    isCancelled: false,
  }).exec();

  return res.json({
    orderArray: orderArray,
  });
};

exports.getOngoingOrders = async (req, res) => {
  const orderArray = await Order.find({
    adminApproved: true,
    completed: false,
    isCancelled: false,
  }).exec();
  return res.json({
    orderArray: orderArray,
  });
};

exports.getCompletedOrders = async (req, res) => {
  const orderArray = await Order.find({
    completed: true,
  }).exec();
  return res.json({
    orderArray: orderArray,
  });
};

exports.approveOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId }).exec();
  order.orderService = req.body.orderService;
  order.orderTitle = req.body.orderTitle;
  order.orderBudget = req.body.orderBudget;
  order.orderDuration = req.body.orderDuration;
  order.adminApproved = true;
  order.payment = true;
  order.save((err, order) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      order: order,
      message: "Order Approved",
    });
  });
};

exports.markCompleteOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId }).exec();
  order.completed = true;
  order.save((err, order) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    return res.status(200).json({
      message: "Order Marked Complete",
    });
  });
};

exports.getLiveProjectBids = async (req, res) => {
  const orderArray = await Order.find({
    completed: false,
    adminApproved: true,
    isCancelled: false,
  }).exec();
  return res.json({
    orderArray: orderArray,
  });
};

exports.rejectOrder = async (req, res) => {
  const order = await Order.findById(req.body.orderId).exec();
  const tutor = await Tutor.findById(order.tutorAssigned).exec();
  order.tutorAssigned = undefined;
  tutor.orders.pop(req.body.orderId);
  const resultOrder = await order.save();
  const resultTutor = await tutor.save();
  if (!resultOrder || !resultTutor) {
    return res.status(500).json({
      error: "Order Can't be rejected at the moment",
    });
  } else {
    return res.json({
      message: "Order Rejected",
    });
  }
};

exports.downloadOrderFiles = async (req, res) => {
  const order = await Order.findById(req.params.orderId).exec();
  const downloadArray = [];
  const orderFilesArray = order.orderFiles
    .split(",")
    .slice(0, order.orderFiles.split(",").length - 1);
  orderFilesArray.forEach((file) => {
    downloadArray.push({
      path: `uploads/${order._id}-${file.split("-%-").slice(1).join("-%-")}`,
      name: `${order._id}-${file.split("-%-").slice(1).join("-%-")}`,
    });
  });
  res.zip(downloadArray);
};

exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.body.orderId).exec();
  const tutor = await Tutor.findById(order.tutorAssigned).exec();
  order.isCancelled = true;
  if (tutor) {
    tutor.orders.pop(req.body.orderId);
    const resultTutor = await tutor.save();
  }
  const resultOrder = await order.save();
  if (!resultOrder) {
    return res.status(500).json({
      error: "Order Can't be cancelled at the moment",
    });
  } else {
    return res.json({
      message: "Order Cancelled",
    });
  }
};

exports.getCancelledOrders = async (req, res) => {
  const orderArray = await Order.find({
    isCancelled: true,
  }).exec();
  return res.json({
    orderArray: orderArray,
  });
};

exports.refundOrder = async (req, res) => {
  const order = await Order.findById(req.body.orderId).exec();
  order.isRefunded = true;
  const resultOrder = await order.save();
  if (!resultOrder) {
    return res.status(500).json({
      error: "Order Can't be refunded at the moment",
    });
  } else {
    return res.json({
      message: "Order Refunded",
    });
  }
};
