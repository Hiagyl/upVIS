import type { ReactNode } from "react";
import { KeyRound, ShieldCheck, GraduationCap, ListChecks } from "lucide-react";
import type { RoleTab, StudentSubtab } from "../../pages/ApplyPage";

type ApplyContentProps = {
  roleTab: RoleTab;
  studentSubtab: StudentSubtab;
  children: ReactNode;
};

type PanelConfig = {
  badge: string;
  title: string;
  description: string;
  accentClasses: string;
  icon: typeof GraduationCap;
  helperTitle: string;
  helperPoints: string[];
};

const panelConfigs: Record<
  "scholarship" | "account" | "admin",
  PanelConfig
> = {
  scholarship: {
    badge: "Student Application",
    title: "Scholarship Application",
    description: "Apply to become a scholarship recipient",
    accentClasses: "bg-amber-100 text-amber-700",
    icon: GraduationCap,
    helperTitle: "Before you submit",
    helperPoints: [
      "Use your UP Mail so your application can be matched correctly.",
      "Prepare a clear explanation of your current financial need.",
      "Review all required student details before sending the form.",
    ],
  },
  account: {
    badge: "Student Access",
    title: "Student Account Application",
    description: "Apply for a system account to access the platform",
    accentClasses: "bg-sky-100 text-sky-700",
    icon: KeyRound,
    helperTitle: "What this request covers",
    helperPoints: [
      "Student accounts are reviewed before they are activated.",
      "Use the same student information you expect the admins to verify.",
      "Explain your intended platform use in a concise but complete way.",
    ],
  },
  admin: {
    badge: "Administrative Access",
    title: "Admin Account Application",
    description: "Apply for admin access to the system",
    accentClasses: "bg-emerald-100 text-emerald-700",
    icon: ShieldCheck,
    helperTitle: "Review expectations",
    helperPoints: [
      "Admin requests require a stronger justification than regular accounts.",
      "State your affiliation and the responsibilities tied to admin access.",
      "Provide optional notes if another team or office is endorsing the request.",
    ],
  },
};

const ApplyContent = ({ roleTab, studentSubtab, children }: ApplyContentProps) => {
  const panelKey = roleTab === "admin" ? "admin" : studentSubtab;
  const panel = panelConfigs[panelKey];
  const Icon = panel.icon;

  return (
    <div className="rounded-[1.75rem] border-2 border-amber-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4">
        <div className="max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${panel.accentClasses}`}
          >
            <Icon size={16} />
            <span>{panel.badge}</span>
          </div>
          <h2 className="mt-5 font-serif text-3xl font-black text-slate-900">
            {panel.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            {panel.description}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div>{children}</div>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <ListChecks className="text-amber-300" size={20} />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              {panel.helperTitle}
            </p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            {panel.helperPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyContent;
