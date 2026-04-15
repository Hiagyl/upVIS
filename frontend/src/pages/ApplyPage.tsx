import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyTabs from "../components/apply/ApplyTabs";
import StudentScholarshipForm from "../components/apply/forms/StudentScholarshipForm";
import StudentAccountForm from "../components/apply/forms/StudentAccountForm";
import AdminAccountForm from "../components/apply/forms/AdminAccountForm";

export type RoleTab = "student" | "admin";
export type StudentSubtab = "scholarship" | "account";

const ApplyPage = () => {
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState<RoleTab>("student");
  const [studentSubtab, setStudentSubtab] =
    useState<StudentSubtab>("scholarship");
  const activeForm =
    roleTab === "student" && studentSubtab === "scholarship" ? (
      <StudentScholarshipForm />
    ) : roleTab === "student" && studentSubtab === "account" ? (
      <StudentAccountForm />
    ) : (
      <AdminAccountForm />
    );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      <nav className="sticky top-0 z-50 mx-auto flex max-w-7xl items-center justify-between bg-[#FAF9F6]/90 px-6 py-6 backdrop-blur sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xl font-serif font-black tracking-wide"
        >
          UPVIS
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/apply")}
            className="font-semibold text-amber-600"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-slate-600 transition hover:text-amber-600"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="rounded-xl bg-slate-900 px-5 py-2 font-bold text-white shadow-md transition hover:bg-amber-600"
          >
            Join Now
          </button>
        </div>
      </nav>

      <div className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <section className="rounded-[2rem] border-2 border-amber-100 bg-white px-6 py-10 shadow-sm sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
                Application Portal
              </span>
              <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Apply to upVIS
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                Choose your application type and get started.
              </p>
            </div>
          </section>

          <main>
            <ApplyTabs
              roleTab={roleTab}
              setRoleTab={setRoleTab}
              studentSubtab={studentSubtab}
              setStudentSubtab={setStudentSubtab}
            >
              {activeForm}
            </ApplyTabs>
          </main>
        </div>
      </div>

      <footer className="mt-8 bg-slate-900 px-6 py-16 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
              upVIS
            </p>
            <h2 className="mt-4 font-serif text-3xl font-black leading-tight sm:text-4xl">
              Start your application with the right path.
            </h2>
            <p className="mt-4 text-base text-amber-100 sm:text-lg">
              Choose the application type that fits your role and continue when
              the next phase opens the full submission flow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900 shadow-md transition hover:bg-amber-100"
            >
              Create an Account
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-xl border border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Back to Home
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApplyPage;
