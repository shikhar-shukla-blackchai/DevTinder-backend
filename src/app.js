const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.json({
    message: "This is the user data",
    useData: {
      firstName: "Shikhar",
      lastName: "Shukla",
    },
  });
});

app.post("/user", (req, res) => {
  res.json({ message: "User data is saved successfully" });
});

app.delete("/user", (req, res) => {
  res.json({ message: "User is deleted form the database" });
});

app.patch("/user", (req, res) => {
  res.json({ message: "User data is successfully updated" });
});

app.put("/user", (req, res) => {
  res.json({ message: "This user is replaced by the new user" });
});

app.use("/test", (req, res) => {
  res.send("Hello for server 7777 : TEST");
});

app.listen(7777, () => {
  console.log("Server is running on the port 7777");
});
