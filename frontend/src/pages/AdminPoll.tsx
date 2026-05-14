import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/shared/Modal";
import Sidebar from "../components/layout/Sidebar";
import {
  PlusCircle,
  Sun,
  Lock,
  Trash2,
  Pencil,
  BarChart3,
  BarChart,
  AlertCircle,
} from "lucide-react";

// ─── API ─────────────────────────────────────────────────────────────────────

const BASE = "/api/v1"; // ← update to your backend base URL if needed

const pollService = {
  getAll: async () => {
    const r = await fetch(`${BASE}/polls`);
    if (!r.ok) throw new Error("Failed to fetch polls");
    return r.json();
  },
  getResults: async (id: string) => {
    const r = await fetch(`${BASE}/polls/${id}/results`);
    if (!r.ok) throw new Error("Failed to fetch results");
    return r.json();
  },
  create: async (body: any) => {
    const r = await fetch(`${BASE}/polls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error("Failed to create poll");
    return r.json();
  },
  update: async (id: string, body: any) => {
    const r = await fetch(`${BASE}/polls/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error("Failed to update poll");
    return r.json();
  },
  close: async (id: string) => {
    const r = await fetch(`${BASE}/polls/${id}/close`, { method: "PATCH" });
    if (!r.ok) throw new Error("Failed to close poll");
    return r.json();
  },
  delete: async (id: string) => {
    const r = await fetch(`${BASE}/polls/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("Failed to delete poll");
    return r.json();
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: string[];
  status: "open" | "closed";
}

interface PollResults {
  poll: Poll;
  totalVotes: number;
  results: Record<string, number>;
}

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
                <span>
                  {count} votes ({pct}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-700"
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

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["polls"],
    queryFn: pollService.getAll,
  });

  const polls: Poll[] = data?.data || [];
  const filteredPolls =
    filter === "all" ? polls : polls.filter((p) => p.status === filter);

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
  };

  /* LOADING */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] ml-72">
        <Sun className="text-amber-500 animate-spin" size={48} />
      </div>
    );
  }

  /* ERROR */
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
              <h1 className="text-4xl font-serif font-black text-slate-900">
                Poll Management
              </h1>
              <p className="text-lg text-slate-500 italic font-serif">
                Manage polls, responses, and voting history.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalMode("create")}
            className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
          >
            <PlusCircle size={24} />
            Create Poll
          </button>
        </header>

        {/* TITLE + FILTER */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
            <h2 className="text-2xl font-serif font-black text-slate-900 uppercase">
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
                      : "bg-white border-slate-200 hover:border-amber-300"
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
          <div className="bg-white p-16 rounded-2xl border-2 border-dashed text-center text-slate-500">
            No polls available.
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPolls.map((poll) => (
            <div
              key={poll._id}
              className="bg-white p-6 rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-serif font-bold text-lg">{poll.title}</h2>
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

              <p className="text-sm text-slate-500 mt-2 italic">
                {poll.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {poll.options.map((o) => (
                  <span
                    key={o}
                    className="text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100"
                  >
                    {o}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    title="Edit"
                    onClick={() => {
                      setActivePoll(poll);
                      setModalMode("edit");
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    title="Close poll"
                    onClick={() => closeMutation.mutate(poll._id)}
                    disabled={poll.status === "closed"}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                  >
                    <Lock size={16} />
                  </button>

                  <button
                    title="Delete"
                    onClick={() => {
                      if (window.confirm("Delete this poll?"))
                        deleteMutation.mutate(poll._id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedPoll(poll);
                    setResultModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-sm text-amber-600 font-bold hover:text-amber-800 transition-colors"
                >
                  <BarChart3 size={16} />
                  Results
                </button>
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
              saveMutation.mutate({
                title: fd.get("title"),
                description: fd.get("description"),
                options: (fd.get("options") as string)
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean),
                startDate: fd.get("startDate"),
                endDate: fd.get("endDate"),
              });
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
                className="w-full border-2 p-4 rounded-xl outline-none focus:border-amber-500 transition-colors"
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
                className="w-full border-2 p-4 rounded-xl outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Options{" "}
                <span className="font-normal text-slate-400">
                  (comma-separated)
                </span>
              </label>
              <input
                name="options"
                defaultValue={activePoll?.options?.join(", ")}
                placeholder="Option A, Option B, Option C"
                required
                className="w-full border-2 p-4 rounded-xl outline-none focus:border-amber-500 transition-colors"
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
                  className="w-full border-2 p-4 rounded-xl outline-none focus:border-amber-500 transition-colors"
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
                  className="w-full border-2 p-4 rounded-xl outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 disabled:bg-slate-300 transition-all"
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