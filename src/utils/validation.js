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

module.exports = {
  validateSignUpdata,
};
