const PDFDocument = require('pdfkit');
const Transaction = require('../../models/v2/Transaction');

class ReportService {
    // --- EXISTING DONOR REPORT ---
    async generateMonthlyDonorReport(res) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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

        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(res);

        doc.fillColor('#0f172a').fontSize(25).text('Monthly Donor Report', { align: 'center' });
        doc.fontSize(12).text(`${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`, { align: 'center' });
        doc.moveDown(2);

        this.generateTableRow(doc, 150, 'Donor Name', 'Email', 'Total Donated (PHP)');
        this.generateHr(doc, 170);

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

        doc.moveDown(4);
        doc.fontSize(14).text(`Total Monthly Donations: P${grandTotal.toLocaleString()}`, { align: 'right', bold: true });
        doc.end();
    }

    // --- NEW FINANCIAL SUMMARY REPORT ---
    async generateFinancialSummary(res) {
        const transactions = await Transaction.find().sort({ date: -1 });

        const totalDonations = transactions
            .filter(t => t.type === 'donation')
            .reduce((acc, item) => acc + item.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, item) => acc + item.amount, 0);

        const balance = totalDonations - totalExpenses;

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        doc.pipe(res);

        // Header Banner
        doc.rect(0, 0, 612, 120).fill('#0f172a');
        doc.fillColor('#fbbf24').fontSize(28).text('FINANCIAL SUMMARY', 50, 45);
        doc.fillColor('#ffffff').fontSize(10).text(`Statement Period: All Time | Generated: ${new Date().toLocaleDateString()}`, 50, 80);

        // Summary Cards
        const cardY = 150;
        this.drawSummaryCard(doc, 50, cardY, 'TOTAL DONATIONS', `P${totalDonations.toLocaleString()}`, '#16a34a');
        this.drawSummaryCard(doc, 220, cardY, 'TOTAL EXPENSES', `P${totalExpenses.toLocaleString()}`, '#dc2626');
        this.drawSummaryCard(doc, 390, cardY, 'NET BALANCE', `P${balance.toLocaleString()}`, '#0f172a');

        // Table Header
        let currentY = 280;
        doc.fillColor('#0f172a').fontSize(16).text('Transaction History', 50, currentY - 30);
        doc.rect(50, currentY, 500, 20).fill('#334155');
        doc.fillColor('#ffffff').fontSize(9);
        doc.text('DATE', 60, currentY + 6);
        doc.text('DESCRIPTION', 140, currentY + 6);
        doc.text('TYPE', 350, currentY + 6);
        doc.text('AMOUNT', 450, currentY + 6, { align: 'right', width: 90 });

        // Table Rows
        currentY += 25;
        transactions.forEach((t, i) => {
            if (currentY > 750) { doc.addPage(); currentY = 50; }

            if (i % 2 === 0) doc.rect(50, currentY - 5, 500, 20).fill('#f8fafc');

            doc.fillColor('#334155').fontSize(9);
            doc.text(new Date(t.date).toLocaleDateString(), 60, currentY);
            doc.text(t.description.substring(0, 35), 140, currentY);

            const color = t.type === 'donation' ? '#16a34a' : '#dc2626';
            doc.fillColor(color).text(t.type.toUpperCase(), 350, currentY);
            doc.fillColor('#334155').text(`P${t.amount.toLocaleString()}`, 450, currentY, { align: 'right', width: 90 });

            currentY += 20;
        });

        doc.end();
    }

    // Helper Methods
    drawSummaryCard(doc, x, y, label, value, valueColor) {
        doc.roundedRect(x, y, 155, 70, 8).stroke('#e2e8f0');
        doc.fillColor('#64748b').fontSize(8).text(label, x + 15, y + 15);
        doc.fillColor(valueColor).fontSize(14).text(value, x + 15, y + 35, { bold: true });
    }

    generateTableRow(doc, y, name, email, amount) {
        doc.fontSize(10).text(name, 50, y).text(email, 200, y).text(amount, 400, y, { width: 100, align: 'right' });
    }

    generateHr(doc, y) {
        doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
    }
}

module.exports = new ReportService();