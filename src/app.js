const express = require("express");
const { connectDB } = require("./config/database"); // Database
const app = express();
const cookieParser = require("cookie-parser");

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouts } = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouts);

connectDB()
  .then(() => {
    console.log("Database is connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on the port 7777");
    });
  })
  .catch((err) => console.error(err.message));
