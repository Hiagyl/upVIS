import type { ApplicationType } from "./types";

type ApplicationTypeBadgeProps = {
  type: ApplicationType;
};

const badgeConfig: Record<
  ApplicationType,
  { label: string; className: string }
> = {
  student_scholarship: {
    label: "Scholarship Application",
    className: "bg-sky-100 text-sky-700 border border-sky-200",
  },
  student_account: {
    label: "Student Account Application",
    className: "bg-violet-100 text-violet-700 border border-violet-200",
  },
  admin_account: {
    label: "Admin Account Application",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
};

const ApplicationTypeBadge = ({ type }: ApplicationTypeBadgeProps) => {
  const config = badgeConfig[type];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default ApplicationTypeBadge;
