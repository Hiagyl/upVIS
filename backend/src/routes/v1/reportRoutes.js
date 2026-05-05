const { Router } = require("express");
const reportService = require("../../services/v1/reportService");
const route = Router();

module.exports = (app) => {
    app.use("/reports", route);

    // Monthly Donor Report
    route.get("/monthly-donors", async (req, res) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=monthly-donors.pdf');
        await reportService.generateMonthlyDonorReport(res);
    });

    // Financial Summary Report
    route.get("/financial-summary", async (req, res) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=financial-summary.pdf');
        await reportService.generateFinancialSummary(res);
    });
};