const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token) {
    return res.status(401).json({ error: "You are not logged in!!!" });
  }
  try {
    const verified = jwt.verify(token, process.env.jwtsecret);

    if (!verified) {
      return res.status(401).json({ error: "You are not logged in!!!" });
    }

    req.userId = verified.id;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = verifyUser;
