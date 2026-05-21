import ApplicationStatusBadge from "../apply/shared/ApplicationStatusBadge";
import ApplicationTypeBadge from "./ApplicationTypeBadge";
import type { Application } from "./types";

type ApplicationCardProps = {
  application: Application;
  onReview: () => void;
};

const ApplicationCard = ({ application, onReview }: ApplicationCardProps) => {
  return (
    <button
      type="button"
      onClick={onReview}
      className="w-full rounded-2xl border-2 border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold font-sans text-slate-900">
            {application.fullName}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {application.email}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ApplicationTypeBadge type={application.type} />
            <span className="text-sm text-slate-500">
              Submitted{" "}
              {new Date(application.submittedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <ApplicationStatusBadge status={application.status} />
          <span className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600">
            Review
          </span>
        </div>
      </div>
    </button>
  );
};

export default ApplicationCard;
