const applicationService = require("../../services/v1/applicationService");
const approvalEffectsService = require("../../services/v1/approvalEffectsService");

const VALID_TYPES = [
  "student_scholarship",
  "student_account",
  "admin_account",
];

class ApplicationController {
  async create(req, res) {
    try {
      const { type, fullName, email, contactNo, details,password } = req.body;

      if (!type || !fullName || !email || !contactNo||!password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ error: "Invalid application type" });
      }

      const application = await applicationService.create({
        type,
        fullName,
        email,
        contactNo,
        password,
        details: details || {},
      });

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const { status, type, email } = req.query;

      const applications = await applicationService.getAll({
        status,
        type,
        email,
      });

      return res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const application = await applicationService.getById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          error: "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async review(req, res) {
    try {
      const { id } = req.params;
      const { status, reviewNotes, rejectionReason } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Invalid status. Must be 'approved' or 'rejected'",
        });
      }

      const application = await applicationService.review(id, {
        status,
        reviewNotes: reviewNotes || "",
        reviewedBy: null,
        rejectionReason: rejectionReason || "",
      });

      let createdAccount = null;
      let warning = null;

      if (status === "approved") {
        try {
          createdAccount =
            await approvalEffectsService.executeApprovalEffect(application);
        } catch (effectError) {
          console.error("Error executing approval effects:", effectError);
          warning =
            "Application status updated, but account creation had issues";
        }
      }

      return res.status(200).json({
        success: true,
        message: `Application ${status}`,
        data: application,
        createdAccount,
        warning,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new ApplicationController();
