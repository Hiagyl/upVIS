import { useEffect, useState } from "react";
import { ClipboardCheck, Loader2, ShieldCheck, XCircle } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import ApplicationCard from "../components/applications/ApplicationCard";
import ApplicationReviewModal from "../components/applications/ApplicationReviewModal";
import FilterSelect from "../components/applications/filters/FilterSelect";
import type {
  Application,
  ApplicationStatus,
  ApplicationType,
} from "../components/applications/types";
import { applicationService, getApiErrorMessage } from "../services/api";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Student Scholarship", value: "student_scholarship" },
  { label: "Student Account", value: "student_account" },
  { label: "Admin Account", value: "admin_account" },
];

const statCards = [
  {
    key: "pending",
    label: "Pending",
    icon: ClipboardCheck,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    key: "approved",
    label: "Approved",
    icon: ShieldCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    accent: "bg-red-100 text-red-700",
  },
] as const;

const ApplicationsReviewPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("pending");
  const [typeFilter, setTypeFilter] = useState<"all" | ApplicationType>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await applicationService.getAll();
      setApplications(response.data || []);
    } catch (fetchError) {
      setError(await getApiErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchApplications();
  }, []);

  useEffect(() => {
    const nextApplications = applications.filter((application) => {
      const matchesStatus = application.status === statusFilter;
      const matchesType = typeFilter === "all" || application.type === typeFilter;
      return matchesStatus && matchesType;
    });

    setFilteredApplications(nextApplications);
  }, [applications, statusFilter, typeFilter]);

  const handleOpenReview = (application: Application) => {
    setSelectedApplication(application);
    setShowReviewModal(true);
  };

  const handleApprove = async (id: string, notes: string) => {
    const response = await applicationService.review(id, {
      status: "approved",
      reviewNotes: notes,
    });

    setActionMessage(response.message || "Application approved");
    setShowReviewModal(false);
    setSelectedApplication(null);
    await fetchApplications();
  };

  const handleReject = async (
    id: string,
    notes: string,
    reason: string,
  ) => {
    const response = await applicationService.review(id, {
      status: "rejected",
      reviewNotes: notes,
      rejectionReason: reason,
    });

    setActionMessage(response.message || "Application rejected");
    setShowReviewModal(false);
    setSelectedApplication(null);
    await fetchApplications();
  };

  const counts = applications.reduce(
    (summary, application) => {
      summary[application.status] += 1;
      return summary;
    },
    { pending: 0, approved: 0, rejected: 0 } as Record<ApplicationStatus, number>,
  );

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <Sidebar />

      <main className="flex-1 ml-72 p-6 sm:p-8 lg:p-12">
        <header className="mb-8 rounded-[1.75rem] border-2 border-amber-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-slate-900 p-4 text-amber-400 shadow-xl">
                <ClipboardCheck size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-sans font-bold text-slate-900">
                  Review Applications
                </h1>
                <p className="mt-2 text-base text-slate-500 sm:text-lg">
                  {counts.pending} pending applications are waiting for review.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF9F6] px-5 py-4 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Review Queue
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {filteredApplications.length}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-[1.75rem] border-2 border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row">
              <FilterSelect
                label="Status"
                value={statusFilter}
                options={statusOptions}
                onChange={(value) => setStatusFilter(value as ApplicationStatus)}
              />
              <FilterSelect
                label="Type"
                value={typeFilter}
                options={typeOptions}
                onChange={(value) =>
                  setTypeFilter(value as "all" | ApplicationType)
                }
              />
            </div>

            <button
              type="button"
              onClick={() => void fetchApplications()}
              className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-amber-600"
            >
              Refresh List
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="rounded-2xl border border-slate-200 bg-[#FAF9F6] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {counts[card.key]}
                      </p>
                    </div>
                    <div className={`rounded-2xl p-3 ${card.accent}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {actionMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {actionMessage}
          </div>
        )}

        {error ? (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-6 py-5 text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[1.75rem] border-2 border-amber-100 bg-white shadow-sm">
            <Loader2 className="animate-spin text-amber-500" size={40} />
            <p className="text-lg font-semibold text-slate-500">
              Loading applications...
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-[1.75rem] border-2 border-amber-100 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-2xl font-sans font-bold text-slate-900">
              No applications found
            </p>
            <p className="mt-3 text-slate-500">
              Try another status or type filter to inspect a different queue.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                onReview={() => handleOpenReview(application)}
              />
            ))}
          </div>
        )}

        {showReviewModal && selectedApplication && (
          <ApplicationReviewModal
            application={selectedApplication}
            onClose={() => {
              setShowReviewModal(false);
              setSelectedApplication(null);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>
    </div>
  );
};

export default ApplicationsReviewPage;
