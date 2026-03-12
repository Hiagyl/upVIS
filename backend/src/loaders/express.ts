import express, { Application } from "express";
// import { Request, Response, NextFunction } from 'express';
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

interface HttpError extends Error {
  status?: number;
}

export default ({ app }: { app: Application }) => {
  /**
   * Health Check endpoints
   */
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.enable("trust proxy");

  // The Magic Middlewares
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable Cross Origin Resource Sharing
  app.use(compression()); // Compress responses
  app.use(morgan("dev")); // HTTP request logger

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Security: Prevent NoSQL injection & HTTP Parameter Pollution
  app.use(mongoSanitize());
  app.use(hpp());

  // Load API routes
  // app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    res.status(404);
    next(err);
  });

  /// error handlers
  app.use((err: HttpError, req: express.Request, res: express.Response) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
