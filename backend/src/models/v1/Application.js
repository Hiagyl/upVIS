const mongoose = require("mongoose");

const { Schema } = mongoose;

const APPLICATION_TYPE_LABELS = {
  student_scholarship: "Scholarship Application",
  student_account: "Student Account Application",
  admin_account: "Admin Account Application",
};

const applicationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["student_scholarship", "student_account", "admin_account"],
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    reviewNotes: {
      type: String,
      default: "",
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ status: 1, submittedAt: -1 });
applicationSchema.index({ type: 1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1, type: 1, submittedAt: -1 });

applicationSchema.methods.canApprove = function canApprove() {
  return this.status === "pending";
};

applicationSchema.methods.getTypeLabel = function getTypeLabel() {
  return APPLICATION_TYPE_LABELS[this.type] || this.type;
};

applicationSchema.methods.toJSON = function toJSON() {
  return {
    _id: this._id,
    type: this.type,
    typeLabel: this.getTypeLabel(),
    status: this.status,
    fullName: this.fullName,
    email: this.email,
    contactNo: this.contactNo,
    details: this.details,
    reviewNotes: this.reviewNotes,
    reviewedBy: this.reviewedBy,
    rejectionReason: this.rejectionReason,
    submittedAt: this.submittedAt,
    reviewedAt: this.reviewedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

applicationSchema.pre("save", function resetPendingReviewFields(next) {
  if (this.status === "pending") {
    this.reviewedBy = null;
    this.reviewedAt = null;
    this.reviewNotes = "";
    this.rejectionReason = "";
  }

  next();
});

applicationSchema.pre("save", function validateReviewedApplication(next) {
  if (this.status === "rejected" && !this.rejectionReason.trim()) {
    return next(
      new Error("Rejection reason required when rejecting application"),
    );
  }

  if (this.status !== "pending" && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }

  return next();
});

module.exports = mongoose.model("Application", applicationSchema);
