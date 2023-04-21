// Connection to Database. At this time, Gurpartap's personal Database is connected

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to DB`);
  })
  .catch((error) => {
    console.log("could not connect to DB ", error);
  });