require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes/userRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin:["http://localhost:5173"],
}));
app.use(router);

mongoose
  .connect(process.env.MONGODB_CONNECT_URL, { useNewUrlParser: true })
  .then(() =>
    app.listen(8000, () => {
      console.log(`Database connected and Server is running at port 8000`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
