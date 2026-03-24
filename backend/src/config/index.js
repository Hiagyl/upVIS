const dotenv = require("dotenv");

// Load env
const result = dotenv.config();

if (result.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

// Validate required variables
const requiredEnvVars = ["MONGODB_URI", "SESSION_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`⚠️ Missing required env variable: ${key}`);
  }
});

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5001,

  databaseURL: process.env.MONGODB_URI,

  session: {
    secret: process.env.SESSION_SECRET,
    name: "upvis_sid",
  },
  
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  api: {
    prefix: "/api",
  },
};
