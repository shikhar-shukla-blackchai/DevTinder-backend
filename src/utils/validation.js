const validator = require("validator");

const validateSignUpdata = (req, res, next) => {
  const { firstName, password, emailId } = req.body;
  if (!firstName) {
    res.status(400).send("ERROR : First name is required");
  } else if (!validator.isEmail(emailId)) {
    res.status(400).send("ERROR : " + "Email  is invalid");
  } else if (!validator.isStrongPassword(password)) {
    res.status(400).send("ERROR : " + "Password is week");
  }
  next();
};

const validEditProfileData = (req, res, next) => {
  //prettier-ignore
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "about",];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

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
