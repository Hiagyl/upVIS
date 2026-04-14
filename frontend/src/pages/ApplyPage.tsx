import { useState } from "react";
import ApplyTabs from "../components/apply/ApplyTabs";

export type RoleTab = "student" | "admin";
export type StudentSubtab = "scholarship" | "account";

const ApplyPage = () => {
  const [roleTab, setRoleTab] = useState<RoleTab>("student");
  const [studentSubtab, setStudentSubtab] =
    useState<StudentSubtab>("scholarship");

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-6 py-12 text-slate-900 sm:px-8 lg:px-12">
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
          />
        </main>
      </div>
    </div>
  );
};

export default ApplyPage;
