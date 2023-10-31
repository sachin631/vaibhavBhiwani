require("dotenv").config();
const express = require("express");
const productsRouter = require("./routes/products");
const moment = require("moment/moment");
const app = express();
const PORT = process.env.PORT;
require("./connection/connection");

try {
  //middleware
  app.use(express.json());

  //router //always in last  before listen server
  app.use("/api/v1",productsRouter);
  app.listen(PORT, (req, res) => {
    console.log(`server start at http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
}
