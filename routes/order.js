const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const {
  getAllOrders,
  getOrderDetails,
  createOrder,
  getNewOrders,
  getOngoingOrders,
  getCompletedOrders,
  approveOrder,
  markCompleteOrder,
  getLiveProjectBids,
  rejectOrder,
  downloadOrderFiles,
  cancelOrder,
  getCancelledOrders,
  refundOrder,
} = require("../controllers/order");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "temp-%-" + Date.now() + "-%-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// get orders
router.get("/getAllOrders", getAllOrders);

// get Live Project Bids
router.get("/getLiveProjectBids", getLiveProjectBids);

// getOrderDetails
router.post("/getOrderDetails", getOrderDetails);

// create order
router.post("/create", createOrder);

// get not approved orders
router.get("/getNewOrders", getNewOrders);

// get ongoing orders
router.get("/getOngoingOrders", getOngoingOrders);

// get completed orders
router.get("/getCompletedOrders", getCompletedOrders);

// get cancelled orders
router.get("/getCancelledOrders", getCancelledOrders);

// approve Order
router.post("/approveOrder", approveOrder);

// cancel Order
router.post("/cancelOrder", cancelOrder);

// refund Order
router.post("/refundOrder", refundOrder);

// mark complete Order
router.post("/markCompleteOrder", markCompleteOrder);

// mark complete Order
router.post("/rejectOrder", rejectOrder);

// mark complete Order
router.get("/downloadOrderFiles/:orderId", downloadOrderFiles);

// upload File
router.post("/uploadFile", upload.array("uploadedFiles"), (req, res, next) => {
  const files = req.files;
  res.send(files);
});
module.exports = router;
