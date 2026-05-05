const PDFDocument = require('pdfkit');
const Donor = require('../../models/v1/Donor');
const Transaction = require('../../models/v2/Transaction');

class ReportService {
    async generateMonthlyDonorReport(res) {
        // 1. Get Date Range for Current Month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // 2. Aggregate Transactions to get totals per donor for this month
        const monthlyStats = await Transaction.aggregate([
            {
                $match: {
                    type: 'donation',
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$donorInfo.name",
                    totalAmount: { $sum: "$amount" },
                    email: { $first: "$donorInfo.email" }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // 3. Create PDF
        const doc = new PDFDocument({ margin: 50 });

        // Stream the PDF directly to the response
        doc.pipe(res);

        // Header
        doc.fillColor('#0f172a').fontSize(25).text('Monthly Donor Report', { align: 'center' });
        doc.fontSize(12).text(`${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`, { align: 'center' });
        doc.moveDown(2);

        // Table Header
        this.generateTableRow(doc, 150, 'Donor Name', 'Email', 'Total Donated (PHP)');
        this.generateHr(doc, 170);

        // Table Body
        let invoiceTableTop = 180;
        let grandTotal = 0;

        monthlyStats.forEach((item, index) => {
            const position = invoiceTableTop + (index + 1) * 30;
            this.generateTableRow(
                doc,
                position,
                item._id || "Anonymous",
                item.email || "N/A",
                `P${item.totalAmount.toLocaleString()}`
            );
            grandTotal += item.totalAmount;
        });

        // Summary
        doc.moveDown(4);
        doc.fontSize(14).text(`Total Monthly Donations: P${grandTotal.toLocaleString()}`, { align: 'right', bold: true });

        doc.end();
    }

    generateTableRow(doc, y, name, email, amount) {
        doc.fontSize(10)
            .text(name, 50, y)
            .text(email, 200, y)
            .text(amount, 400, y, { width: 100, align: 'right' });
    }

    generateHr(doc, y) {
        doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
    }
}

module.exports = new ReportService();