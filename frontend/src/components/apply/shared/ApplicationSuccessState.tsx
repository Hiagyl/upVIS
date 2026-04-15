import { CheckCircle2, ClipboardList, Clock3 } from "lucide-react";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

interface ApplicationSuccessStateProps {
  applicationTitle: string;
  successMessage: string;
  refNumber?: string;
  status: "pending";
  onReturn: () => void;
}

const ApplicationSuccessState = ({
  applicationTitle,
  successMessage,
  refNumber,
  status,
  onReturn,
}: ApplicationSuccessStateProps) => {
  return (
    <div className="rounded-[1.5rem] border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} />
              Application Received
            </div>
            <h3 className="mt-4 font-serif text-3xl font-black text-slate-900">
              {applicationTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              {successMessage}
            </p>
          </div>

          <ApplicationStatusBadge status={status} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#F6FBF7] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Reference Number
            </p>
            <p className="mt-3 text-lg font-bold text-slate-900">
              {refNumber || "To be generated"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FAF9F6] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              What Happens Next
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <ClipboardList size={18} className="mt-0.5 text-amber-600" />
                <p>Our team logs your application and checks the submitted details.</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 size={18} className="mt-0.5 text-amber-600" />
                <p>Initial review is typically completed within 3 to 5 working days.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 text-amber-600" />
                <p>You will be contacted once the application moves past pending review.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onReturn}
            className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-amber-600"
          >
            Return to Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessState;
