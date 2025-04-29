const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isTokenAuthenticated = token === "xyz";

  if (!isTokenAuthenticated) {
    res.status(400).send("Admin is not authorize to add the user");
  }
  console.log("This is admin Auth ");
  next();
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isTokenAuthenticated = token === "xyz";

  if (!isTokenAuthenticated) {
    res.status(400).send("User is not deleted");
  }
  console.log("This is User Auth ");
  next();
};

module.exports = {
  adminAuth,
  userAuth,
};
