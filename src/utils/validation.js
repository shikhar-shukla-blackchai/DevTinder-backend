const validator = require("validator");

const validateSignUpdata = (req, res, next) => {
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName || !lastName) {
    res.status(400).send("Name is required");
  } else if (!validator.isEmail(emailId)) {
    res.status(400).send("Email is not valid " + emailId);
  } else if (!validator.isStrongPassword(password)) {
    res.status(400).send("Password is not valid " + password);
  }
  next();
};

module.exports = {
  validateSignUpdata,
};
