const dotenv = require("dotenv");

// Load env
const result = dotenv.config();

if (result.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

// Validate required variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`⚠️ Missing required env variable: ${key}`);
  }
});

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,

  databaseURL: process.env.MONGODB_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "1d",
  },

  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  api: {
    prefix: "/api",
  },
};
