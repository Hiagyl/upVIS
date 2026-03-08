const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const Distributions = require("./Model/Distributions");
const Donations = require("./Model/Donations");
const Donors = require("./Model/Donors");
const Expenses = require("./Model/Expenses");
const Members = require("./Model/Members");
const Reports = require("./Model/Reports");
const Scholars = require("./Model/Scholars");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tasks", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/distributions", require("./Routes/distributionRoutes"));
app.use("/api/donations", require("./Routes/donationRoutes"));
app.use("/api/donors", require("./Routes/donorRoutes"));
app.use("/api/expenses", require("./Routes/expenseRoutes"));
app.use("/api/members", require("./Routes/memberRoutes"));
// app.use("/api/reports", require("./Routes/reportRoutes"));
app.use("/api/scholars", require("./Routes/scholarRoutes"));
app.use("/api/finance", require("./Routes/financeRoutes"));

// Check connection status endpoint
app.get("/status", (req, res) => {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
        status: states[state],
        message:
            state === 1
                ? "MongoDB connection is healthy."
                : "MongoDB not connected.",
    });
});

// Sample routes to verify collections
app.get("/check/:collection", async (req, res) => {
    try {
        const { collection } = req.params;

        const models = {
            distributions: Distributions,
            donations: Donations,
            donors: Donors,
            expenses: Expenses,
            members: Members,
            reports: Reports,
            scholars: Scholars,
        };

        const Model = models[collection.toLowerCase()];

        if (!Model) {
            return res.status(400).json({ error: "Invalid collection name." });
        }

        // Count documents to confirm connection + access
        const count = await Model.countDocuments();
        res.json({
            collection,
            count,
            message: `Successfully connected to '${collection}' collection.`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error accessing collection." });
    }
});

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "finance.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
