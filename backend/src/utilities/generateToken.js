const jwt = require("jsonwebtoken");
const config = require("../config");

const generateToken = (id) =>
  jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

module.exports = generateToken;
