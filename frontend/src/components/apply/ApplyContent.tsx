import {
  ArrowRight,
  KeyRound,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import type { RoleTab, StudentSubtab } from "../../pages/ApplyPage";

type ApplyContentProps = {
  roleTab: RoleTab;
  studentSubtab: StudentSubtab;
};

type PanelConfig = {
  badge: string;
  title: string;
  description: string;
  placeholder: string;
  accentClasses: string;
  icon: typeof GraduationCap;
};

const panelConfigs: Record<
  "scholarship" | "account" | "admin",
  PanelConfig
> = {
  scholarship: {
    badge: "Student Application",
    title: "Scholarship Application",
    description: "Apply to become a scholarship recipient",
    placeholder: "Scholarship form component will go here",
    accentClasses: "bg-amber-100 text-amber-700",
    icon: GraduationCap,
  },
  account: {
    badge: "Student Access",
    title: "Student Account Application",
    description: "Apply for a system account to access the platform",
    placeholder: "Student account form component will go here",
    accentClasses: "bg-sky-100 text-sky-700",
    icon: KeyRound,
  },
  admin: {
    badge: "Administrative Access",
    title: "Admin Account Application",
    description: "Apply for admin access to the system",
    placeholder: "Admin account form component will go here",
    accentClasses: "bg-emerald-100 text-emerald-700",
    icon: ShieldCheck,
  },
};

const ApplyContent = ({ roleTab, studentSubtab }: ApplyContentProps) => {
  const panelKey = roleTab === "admin" ? "admin" : studentSubtab;
  const panel = panelConfigs[panelKey];
  const Icon = panel.icon;

  return (
    <div className="rounded-[1.75rem] border-2 border-amber-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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

        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white opacity-60 shadow-md transition sm:w-fit"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-[#FAF9F6] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Placeholder
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-700">
            {panel.placeholder}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This panel is intentionally prepared as a UI shell only. The
            application form workflow and backend integration can be dropped
            into this area in the next phase.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Current Scope
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <p>Navigation between application types is active.</p>
            <p>Selected tabs update instantly without page reloads.</p>
            <p>Submission actions remain disabled until forms are added.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyContent;
