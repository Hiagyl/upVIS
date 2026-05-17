const Scholar = require("../../models/v1/Scholar");
const Transaction = require("../../models/v1/Transaction");

class StatsService {
  async getLandingStats() {
    // Active scholars


    const activeScholars = await Scholar.countDocuments({
      status: "Student",
    });

    // Total scholars
    const totalScholars = await Scholar.countDocuments();

    // Total donations
    const donations = await Transaction.aggregate([
      {
        $match: {
          type: "donation",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalDonations = donations.length > 0 ? donations[0].total : 0;

    return {
      activeScholars,
      totalScholars,
      totalDonations,
    };
  }
}

module.exports = new StatsService();
