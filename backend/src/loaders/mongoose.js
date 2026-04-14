const mongoose = require("mongoose");
const config = require("../config");
require("../models/v1/Application");

module.exports = async () => {
  // Mongoose 6+ and 7+ automatically handle connection pooling
  const connection = await mongoose.connect(config.databaseURL);

  // Ensure the db object is present
  if (!connection.connection.db) {
    throw new Error(
      "MongoDB connection established but database object is missing.",
    );
  }

  // Return the database object so other loaders can use it if needed
  return connection.connection.db;
};
