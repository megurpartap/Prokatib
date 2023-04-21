const express = require("express");
const path = require("path");
const app = express();
const port = 8000;

staticPath = path.join(__dirname, "../public");

app.use(
  express.static(staticPath, {
    extensions: ["html", "htm"],
  })
);

app.listen(port, () => console.log(`frontend pages serving on port ${port}!`));
