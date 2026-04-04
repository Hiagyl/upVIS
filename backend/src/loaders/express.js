const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// V1 Routes
const v1TransactionRoutes = require("../routes/v1/transactionRoutes");
const v1DonorRoutes = require("../routes/v1/donorRoutes");
const v1MemberRoutes = require("../routes/v1/memberRoutes");
const v1ScholarRoutes = require("../routes/v1/scholarRoutes");
const v1RegisterRoutes = require("../routes/v1/registerRoutes");
const v1LoginRoutes = require("../routes/v1/loginRoutes");

// V2 Routes
const v2TransactionRoutes = require("../routes/v2/transactionRoutes");
const v2DonorRoutes = require("../routes/v2/donorRoutes");
const v2MemberRoutes = require("../routes/v2/memberRoutes");
const v2ScholarRoutes = require("../routes/v2/scholarRoutes");

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
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true, // for cookies!
        }),
    );
    app.use(compression()); // Compress responses
    app.use(morgan("dev")); // HTTP request logger

    // Body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(
        session({
            name: "upvis_sid",
            secret: process.env.SESSION_SECRET || "your_secret_key",
            resave: false,
            saveUninitialized: false,
            // Use the conditional check to ensure connect-mongo is ready
            store: (MongoStore.default ? MongoStore.default : MongoStore).create({
                mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/upVIS",
                dbName: 'upVIS',
                autoRemove: 'native'
            }),
            cookie: {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24,
            },
        }),
    );

    // Security: Prevent NoSQL injection & HTTP Parameter Pollution
    // app.use(mongoSanitize());
    // app.use(hpp());

    // Load API routes
    // app.use(config.api.prefix, routes());
    // V1 Router
    const v1Router = express.Router();
    v1TransactionRoutes(v1Router);
    v1DonorRoutes(v1Router);
    v1MemberRoutes(v1Router);
    v1ScholarRoutes(v1Router);
    v1RegisterRoutes(v1Router);
    v1LoginRoutes(v1Router);
    app.use("/api/v1", v1Router);

    // V2 Router
    const v2Router = express.Router();
    v2TransactionRoutes(v2Router);
    v2DonorRoutes(v2Router);
    v2MemberRoutes(v2Router);
    v2ScholarRoutes(v2Router);
    app.use("/api/v2", v2Router);



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
