import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/shared/Modal";
import Sidebar from "../components/layout/Sidebar";
import { pollService } from "../services/api";
import {
  PlusCircle,
  Sun,
  Lock,
  Trash2,
  Pencil,
  BarChart3,
  BarChart,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: string[];
  status: "open" | "closed";
  startDate: string;
  endDate: string;
}

interface PollResults {
  poll: Poll;
  totalVotes: number;
  results: Record<string, number>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatDateLabel = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ─── Results Modal Content ────────────────────────────────────────────────────

const ResultsView = ({ pollId }: { pollId: string }) => {
  const { data, isLoading, error } = useQuery<{ data: PollResults }>({
    queryKey: ["poll-results", pollId],
    queryFn: () => pollService.getResults(pollId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Sun className="animate-spin text-amber-500" size={28} />
        <span className="text-slate-600 font-semibold">Loading results…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
        <AlertCircle size={20} />
        <span className="font-semibold">Failed to load results.</span>
      </div>
    );
  }

  const { poll, totalVotes, results } = data?.data ?? {};

  return (
    <div className="space-y-6">
      <p className="text-slate-500 font-medium">
        {totalVotes ?? 0} total vote{totalVotes !== 1 ? "s" : ""} cast
      </p>

      <div className="space-y-4">
        {poll?.options.map((option) => {
          const count = results?.[option] ?? 0;
          const pct =
            totalVotes && totalVotes > 0
              ? Math.round((count / totalVotes) * 100)
              : 0;
          return (
            <div key={option}>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                <span>{option}</span>
                <span>{count} votes ({pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminPoll = () => {
  const queryClient = useQueryClient();

  const [modalMode, setModalMode] = useState<"none" | "create" | "edit">("none");
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const [formError, setFormError] = useState<string | null>(null);

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["polls"],
    queryFn: pollService.getAll,
  });

  const polls: Poll[] = data?.data || [];
  const filteredPolls =
    filter === "all" ? polls : polls.filter((p) => p.status === filter);

  const openCount = polls.filter((p) => p.status === "open").length;
  const closedCount = polls.filter((p) => p.status === "closed").length;

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      activePoll && modalMode === "edit"
        ? pollService.update(activePoll._id, payload)
        : pollService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pollService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["polls"] }),
  });

  const closeMutation = useMutation({
    mutationFn: (id: string) => pollService.close(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["polls"] }),
  });

  const closeModal = () => {
    setModalMode("none");
    setActivePoll(null);
    setFormError(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] ml-72">
        <div className="flex flex-col items-center gap-4">
          <Sun className="text-amber-500 animate-spin" size={48} />
          <div className="text-2xl font-serif font-bold text-slate-700">
            Loading Polls…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-72 p-10 text-red-700 font-bold bg-red-50 h-screen">
        Failed to load polls: {(error as any).message}
      </div>
    );
  }

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-72 p-12">

        {/* HEADER */}
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <BarChart size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-1">
                Poll Management
              </h1>
              <p className="text-lg text-slate-500 font-medium italic font-serif">
                Manage polls, responses, and voting history.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalMode("create")}
            className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
          >
            <PlusCircle size={24} strokeWidth={3} />
            Create Poll
          </button>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Total Polls",
              value: polls.length,
              icon: <BarChart3 size={22} />,
              accent: "slate",
            },
            {
              label: "Open Polls",
              value: openCount,
              icon: <CheckCircle2 size={22} />,
              accent: "amber",
            },
            {
              label: "Closed Polls",
              value: closedCount,
              icon: <Lock size={22} />,
              accent: "slate",
            },
          ].map(({ label, value, icon, accent }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border-2 border-amber-100 shadow-sm p-7 flex items-center gap-5"
            >
              <div
                className={`p-3 rounded-xl shadow-md ${
                  accent === "amber"
                    ? "bg-amber-500 text-white"
                    : "bg-slate-900 text-amber-400"
                }`}
              >
                {icon}
              </div>
              <div>
                <p className="text-3xl font-serif font-black text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 font-semibold">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TITLE + FILTER */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
            <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-wide">
              Poll Records
            </h2>
          </div>

          <div className="flex gap-3">
            {(["All", "Open", "Closed"] as const).map((label) => {
              const value = label.toLowerCase() as "all" | "open" | "closed";
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    filter === value
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white border-slate-200 hover:border-amber-300 text-slate-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* EMPTY */}
        {filteredPolls.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border-2 border-dashed border-amber-200">
            <BarChart3 size={48} className="text-amber-300" />
            <p className="text-xl font-serif font-bold text-slate-400">No polls found</p>
            <p className="text-slate-400 text-sm">
              {filter !== "all"
                ? `No ${filter} polls at the moment.`
                : "Create a poll to get started."}
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPolls.map((poll) => (
            <div
              key={poll._id}
              className="bg-white rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-slate-800 via-amber-500 to-amber-400" />

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="font-serif font-black text-slate-900 text-lg leading-snug flex-1">
                    {poll.title}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold shrink-0 ${
                      poll.status === "open"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {poll.status}
                  </span>
                </div>

                {poll.description && (
                  <p className="text-sm text-slate-500 italic leading-relaxed">
                    {poll.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {poll.options.map((o) => (
                    <span
                      key={o}
                      className="text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg font-semibold text-slate-600"
                    >
                      {o}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-slate-500 space-y-1 pt-1">
                  <div>
                    <span className="font-semibold text-slate-700">Start:</span>{" "}
                    {formatDateLabel(poll.startDate)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">End:</span>{" "}
                    {formatDateLabel(poll.endDate)}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <div className="flex gap-1">
                    <button
                      title="Edit"
                      onClick={() => {
                        setActivePoll(poll);
                        setModalMode("edit");
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      title="Close poll"
                      onClick={() => closeMutation.mutate(poll._id)}
                      disabled={poll.status === "closed"}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
                    >
                      <Lock size={16} />
                    </button>

                    <button
                      title="Delete"
                      onClick={() => {
                        if (window.confirm("Delete this poll?"))
                          deleteMutation.mutate(poll._id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPoll(poll);
                      setResultModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    <BarChart3 size={15} />
                    Results
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE / EDIT MODAL */}
        <Modal
          isOpen={modalMode !== "none"}
          onClose={closeModal}
          title={modalMode === "edit" ? "Edit Poll" : "Create Poll"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const title = fd.get("title");
              const description = fd.get("description");
              const options = (fd.get("options") as string)
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean);
              const startDate = fd.get("startDate") as string;
              const endDate = fd.get("endDate") as string;

              if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                setFormError("Start date must be earlier than end date.");
                return;
              }

              setFormError(null);
              saveMutation.mutate({ title, description, options, startDate, endDate });
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Title
              </label>
              <input
                name="title"
                defaultValue={activePoll?.title}
                placeholder="Poll title"
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={activePoll?.description}
                placeholder="Optional description"
                rows={3}
                className="w-full border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors resize-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Options{" "}
                <span className="font-normal text-slate-400">(comma-separated)</span>
              </label>
              <input
                name="options"
                defaultValue={activePoll?.options?.join(", ")}
                placeholder="Option A, Option B, Option C"
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  name="startDate"
                  type="date"
                  required
                  defaultValue={formatDateInputValue(activePoll?.startDate ?? null)}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  name="endDate"
                  type="date"
                  required
                  defaultValue={formatDateInputValue(activePoll?.endDate ?? null)}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-slate-900"
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 disabled:bg-slate-300 transition-all shadow-xl active:scale-95"
            >
              {saveMutation.isPending ? "Saving…" : "Save Poll"}
            </button>
          </form>
        </Modal>

        {/* RESULTS MODAL */}
        <Modal
          isOpen={resultModalOpen}
          onClose={() => {
            setResultModalOpen(false);
            setSelectedPoll(null);
          }}
          title={selectedPoll?.title ?? "Poll Results"}
        >
          {selectedPoll && <ResultsView pollId={selectedPoll._id} />}
        </Modal>
      </main>
    </div>
  );
};

export default AdminPoll;