import type { Dispatch, ReactNode, SetStateAction } from "react";
import ApplyContent from "./ApplyContent";
import type { RoleTab, StudentSubtab } from "../../pages/ApplyPage";

type ApplyTabsProps = {
  roleTab: RoleTab;
  setRoleTab: Dispatch<SetStateAction<RoleTab>>;
  studentSubtab: StudentSubtab;
  setStudentSubtab: Dispatch<SetStateAction<StudentSubtab>>;
  children: ReactNode;
};

const mainTabs: Array<{ key: RoleTab; label: string; description: string }> = [
  {
    key: "student",
    label: "Student",
    description: "Scholarship and student platform applications",
  },
  {
    key: "admin",
    label: "Admin",
    description: "Administrative access requests",
  },
];

const studentTabs: Array<{ key: StudentSubtab; label: string }> = [
  { key: "scholarship", label: "Scholarship Application" },
  { key: "account", label: "Student Account Application" },
];

const ApplyTabs = ({
  roleTab,
  setRoleTab,
  studentSubtab,
  setStudentSubtab,
  children,
}: ApplyTabsProps) => {
  return (
    <section className="rounded-[2rem] border-2 border-amber-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-2">
          {mainTabs.map((tab) => {
            const isActive = roleTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRoleTab(tab.key)}
                className={`rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                    : "border-slate-200 bg-[#FAF9F6] text-slate-600 hover:border-amber-300 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-bold">{tab.label}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      isActive ? "bg-amber-400" : "bg-slate-300"
                    }`}
                  />
                </div>
                <p
                  className={`mt-2 text-sm ${
                    isActive ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#FAF9F6] p-2">
          {roleTab === "student" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {studentTabs.map((tab) => {
                const isActive = studentSubtab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStudentSubtab(tab.key)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 sm:text-base ${
                      isActive
                        ? "bg-white text-amber-700 shadow-sm ring-1 ring-amber-200"
                        : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-amber-700 shadow-sm ring-1 ring-amber-200 sm:text-base">
              Admin Account Application
            </div>
          )}
        </div>

        <ApplyContent roleTab={roleTab} studentSubtab={studentSubtab}>
          {children}
        </ApplyContent>
      </div>
    </section>
  );
};

export default ApplyTabs;
