const validator = require("validator");

const validateSignUpdata = (req, res, next) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName || !lastName) {
    res.status(400).send("ERROR : " + err.message);
  } else if (!validator.isEmail(emailId)) {
    res.status(400).send("ERROR : " + err.message);
  } else if (!validator.isStrongPassword(password)) {
    res.status(400).send("ERROR : " + err.message);
  }
  next();
};

const validEditProfileData = (req, res, next) => {
  //prettier-ignore
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "about",];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  console.log("Im here");
  if (isEditAllowed) {
    next();
  } else {
    res.json({ message: "ERROR: Only specific fields can be edited" });
  }
};

module.exports = {
  validateSignUpdata,
  validEditProfileData,
};
