const express = require("express");

const app = express();

// working: dragonfly, butterfly
app.get("/user/:id/:age/:gender/:password", (req, res) => {
  console.log(req.params);
  res.json({ fullName: "Shikhar" });
});

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
