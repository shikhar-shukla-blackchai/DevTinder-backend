const { User } = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(404).send("Token not fond !!!! ");
    }

    const decodedObj = jwt.verify(token, "DEV@TINDER$7777");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("Token not fond !!!! ");
    }
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};
module.exports = {
  userAuth,
};
