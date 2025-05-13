const express = require("express");
const { connectDB } = require("./config/database"); // Database
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouts } = require("./routes/user");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouts);

connectDB()
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on the port 7777");
    });
  })
  .catch((err) => console.error(err.message));
