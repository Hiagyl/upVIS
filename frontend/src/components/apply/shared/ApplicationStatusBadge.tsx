type ApplicationStatusBadgeProps = {
  status: "pending" | "approved" | "rejected";
};

const statusStyles: Record<ApplicationStatusBadgeProps["status"], string> = {
  pending: "bg-slate-100 text-slate-700 border border-slate-200",
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

const statusLabels: Record<ApplicationStatusBadgeProps["status"], string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

const ApplicationStatusBadge = ({ status }: ApplicationStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

export default ApplicationStatusBadge;
