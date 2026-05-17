import ApplicationStatusBadge from "../apply/shared/ApplicationStatusBadge";
import ApplicationTypeBadge from "./ApplicationTypeBadge";
import type { Application } from "./types";

type ApplicationDetailViewProps = {
  application: Application;
};

const detailFieldLabels: Record<string, string> = {
  studentNumber: "Student Number",
  program: "Program",
  yearLevel: "Year Level",
  reasonForApplying: "Reason for Applying",
  supportingNotes: "Supporting Notes",
  reasonForAccount: "Reason for Account",
  affiliation: "Affiliation",
  reasonForAdminAccess: "Reason for Admin Access",
};

const ApplicationDetailView = ({ application }: ApplicationDetailViewProps) => {
  const detailEntries = Object.entries(application.details || {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <ApplicationTypeBadge type={application.type} />
        <ApplicationStatusBadge status={application.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Applicant
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-bold text-slate-900">Name:</span>{" "}
              {application.fullName}
            </p>
            <p>
              <span className="font-bold text-slate-900">Email:</span>{" "}
              {application.email}
            </p>
            <p>
              <span className="font-bold text-slate-900">Contact:</span>{" "}
              {application.contactNo}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Submission
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-bold text-slate-900">Submitted:</span>{" "}
              {new Date(application.submittedAt).toLocaleString()}
            </p>
            {application.reviewedAt && (
              <p>
                <span className="font-bold text-slate-900">Reviewed:</span>{" "}
                {new Date(application.reviewedAt).toLocaleString()}
              </p>
            )}
            {application.reviewedBy && (
              <p>
                <span className="font-bold text-slate-900">Reviewed By:</span>{" "}
                {application.reviewedBy}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Application Details
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {detailEntries.map(([key, value]) => (
            <div
              key={key}
              className={typeof value === "string" && value.length > 80 ? "md:col-span-2" : ""}
            >
              <p className="text-sm font-bold text-slate-900">
                {detailFieldLabels[key] || key}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {String(value || "-")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {(application.reviewNotes || application.rejectionReason) && (
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Review History
          </p>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            {application.reviewNotes && (
              <p>
                <span className="font-bold text-slate-900">Review Notes:</span>{" "}
                {application.reviewNotes}
              </p>
            )}
            {application.rejectionReason && (
              <p>
                <span className="font-bold text-slate-900">Rejection Reason:</span>{" "}
                {application.rejectionReason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailView;
