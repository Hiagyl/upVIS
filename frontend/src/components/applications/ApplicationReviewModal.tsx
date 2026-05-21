import { useState } from "react";
import ApplicationDetailView from "./ApplicationDetailView";
import type { Application } from "./types";

type ApplicationReviewModalProps = {
  application: Application;
  onClose: () => void;
  onApprove: (id: string, notes: string) => Promise<void>;
  onReject: (id: string, notes: string, reason: string) => Promise<void>;
};

const ApplicationReviewModal = ({
  application,
  onClose,
  onApprove,
  onReject,
}: ApplicationReviewModalProps) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      await onApprove(application._id, reviewNotes);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to approve application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setShowRejectionReason(true);
      setError("Rejection reason is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onReject(application._id, reviewNotes, rejectionReason);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to reject application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border-2 border-amber-100 bg-[#FAF9F6] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-sans font-black text-slate-900">
              Review Application
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mock admin access is enabled for this workflow.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-2xl leading-none text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="rounded-2xl bg-slate-100 p-4 sm:p-6">
          <ApplicationDetailView application={application} />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Review Notes
            </label>
            <textarea
              value={reviewNotes}
              onChange={(event) => setReviewNotes(event.target.value)}
              className="min-h-28 w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-base text-slate-800 outline-none transition focus:border-amber-500"
              placeholder="Enter your review notes..."
            />
          </div>

          {(showRejectionReason || error === "Rejection reason is required.") && (
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                className="min-h-24 w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-base text-slate-800 outline-none transition focus:border-red-500"
                placeholder="Explain why this application is rejected..."
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-white"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRejectionReason(true);
                void handleReject();
              }}
              className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Reject"}
            </button>
            <button
              type="button"
              onClick={() => void handleApprove()}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewModal;
