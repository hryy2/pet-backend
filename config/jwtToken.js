const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const expiresIn = "1d";
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
  const decodedToken = jwt.decode(token);
  const expirationTime = new Date(decodedToken.exp * 1000);
  return {
    token,
    expiresAt: expirationTime
  };
};

module.exports = { generateToken };
