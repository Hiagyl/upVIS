const mongoose = require("mongoose");
const Application = require("../../models/v1/Application");

const VALID_TYPES = [
  "student_scholarship",
  "student_account",
  "admin_account",
];

const VALID_REVIEW_STATUSES = ["approved", "rejected"];

class ApplicationService {
  validateCreateData(applicationData) {
    const { type, fullName, email, contactNo } = applicationData;

    if (!type || !fullName || !email || !contactNo) {
      throw new Error("Missing required fields");
    }

    if (!VALID_TYPES.includes(type)) {
      throw new Error("Invalid application type");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      throw new Error("Invalid email format");
    }

    if (!/^09\d{9}$/.test(String(contactNo).replace(/\D/g, ""))) {
      throw new Error("Invalid contact number format");
    }
  }

  async create(applicationData) {
    const { type, fullName, email, contactNo, details = {} } = applicationData;

    this.validateCreateData({ type, fullName, email, contactNo });

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedContactNo = String(contactNo).trim();

    const existing = await Application.findOne({
      email: normalizedEmail,
      type,
      status: "pending",
    });

    if (existing) {
      throw new Error(`You already have a pending ${type} application`);
    }

    const newApplication = new Application({
      type,
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      contactNo: normalizedContactNo,
      details,
      status: "pending",
      submittedAt: new Date(),
    });

    await newApplication.save();
    return newApplication;
  }

  async getAll(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.email) {
      query.email = String(filters.email).trim().toLowerCase();
    }

    return await Application.find(query).sort({ submittedAt: -1 }).limit(100);
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return await Application.findById(id);
  }

  async review(id, reviewData) {
    const { status, reviewNotes, reviewedBy, rejectionReason } = reviewData;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Application not found");
    }

    if (!VALID_REVIEW_STATUSES.includes(status)) {
      throw new Error("Invalid review status");
    }

    const application = await Application.findById(id);
    if (!application) {
      throw new Error("Application not found");
    }

    if (!application.canApprove()) {
      throw new Error("Only pending applications can be reviewed");
    }

    if (status === "rejected" && !String(rejectionReason || "").trim()) {
      throw new Error("Rejection reason required");
    }

    application.status = status;
    application.reviewNotes = reviewNotes || "";
    application.reviewedBy = reviewedBy || null;
    application.reviewedAt = new Date();
    application.rejectionReason =
      status === "rejected" ? String(rejectionReason).trim() : "";

    await application.save();
    return application;
  }

  async hasPendingApplication(email, type) {
    const pendingApplication = await Application.findOne({
      email: String(email).trim().toLowerCase(),
      type,
      status: "pending",
    });

    return Boolean(pendingApplication);
  }

  async getPendingByType(type) {
    return await Application.find({
      type,
      status: "pending",
    }).sort({ submittedAt: -1 });
  }
}

module.exports = new ApplicationService();
