const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const transactionRoutes = require("../routes/transactionRoutes");

module.exports = ({ app }) => {
  /**
   * Health Check endpoints
   */
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Nginx, AWS, etc)
  app.enable("trust proxy");

  // The Magic Middlewares
  // app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS
  app.use(compression()); // Compress responses
  app.use(morgan("dev")); // HTTP request logger

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Security: Prevent NoSQL injection & HTTP Parameter Pollution
  // app.use(mongoSanitize());
  // app.use(hpp());

  // Load API routes
  // app.use(config.api.prefix, routes());
  transactionRoutes(app);

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  /// error handlers
  // Note: You must keep the 4th 'next' parameter for Express to identify this as an error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
