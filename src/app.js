const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello for server 7777 : 'c'");
});

app.use("/home", (req, res) => {
  res.send("Hello for server 7777 : HOME");
});

app.use("/test", (req, res) => {
  res.send("Hello for server 7777 : TEST");
});

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
