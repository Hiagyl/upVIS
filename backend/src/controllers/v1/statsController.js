const statsService = require("../../services/v1/statsService");

class StatsController {
  async getLandingStats(req, res) {
    try {
      const stats = await statsService.getLandingStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new StatsController();
