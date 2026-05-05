const { Router } = require("express");
const reportService = require("../../services/v1/reportService");

const route = Router();

module.exports = (app) => {
    app.use("/reports", route);

    route.get("/monthly-donors", async (req, res) => {
        try {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=monthly-report.pdf');
            await reportService.generateMonthlyDonorReport(res);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};