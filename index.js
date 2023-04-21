// Requires
const express = require("express");
require("dotenv").config();


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Routes Requires
const customerRoutes = require("./routes/customer");
const orderRoutes = require("./routes/order");
const reviewRoutes = require("./routes/review");
const adminRoutes = require("./routes/admin");
const tutorRoutes = require("./routes/tutor");
const contactUsRoutes = require("./routes/contactUs.js");

// DB CONNECTION
require("./db/conn");

// Port
const PORT = process.env.PORT || 8001;

// Middlewares
app.use(
  express.static("client/public", {
    extensions: ["html", "htm"],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/customer", customerRoutes);
app.use("/order", orderRoutes);
app.use("/review", reviewRoutes);
app.use("/admin", adminRoutes);
app.use("/tutor", tutorRoutes);
app.use("/contactUs", contactUsRoutes);

// Server Listening
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}!`);
});