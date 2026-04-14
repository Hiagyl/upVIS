export type ApplicationType =
  | "student_scholarship"
  | "student_account"
  | "admin_account";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export type Application = {
  _id: string;
  type: ApplicationType;
  typeLabel?: string;
  status: ApplicationStatus;
  fullName: string;
  email: string;
  contactNo: string;
  details: Record<string, unknown>;
  reviewNotes?: string;
  reviewedBy?: string | null;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
