import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/shared/Modal";
import { pollService, voteService } from "../services/api";
import {
  Vote,
  Sun,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  Lock,
  AlertCircle,
} from "lucide-react";
import LogoutButton from "../components/shared/LogoutButton"; 

// ─── Types ────────────────────────────────────────────────────────────────────

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  status: "open" | "closed";
  createdAt: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatusBadge = ({ poll }: { poll: Poll }) => {
  const now = new Date();
  const end = new Date(poll.endDate);
  const start = new Date(poll.startDate);

  if (poll.status === "closed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
        <Lock size={11} /> Closed
      </span>
    );
  }
  if (now < start) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
        <Clock size={11} /> Upcoming
      </span>
    );
  }
  if (now > end) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-500 border border-red-200">
        <XCircle size={11} /> Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-300">
      <CheckCircle2 size={11} /> Active
    </span>
  );
};

// ─── Results View ─────────────────────────────────────────────────────────────

const ResultsView = ({
  pollId,
  onClose,
}: {
  pollId: string;
  onClose: () => void;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["poll-results", pollId],
    queryFn: () => pollService.getResults(pollId),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-16 gap-3">
        <Sun className="animate-spin text-amber-500" size={28} />
        <span className="text-slate-600 font-semibold">Loading results…</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
        <AlertCircle size={20} />
        <span className="font-semibold">Failed to load results.</span>
      </div>
    );

  const { poll, totalVotes, results } = data?.data || {};

  return (
    <div className="p-2 space-y-6">
      <p className="text-slate-500 font-medium">
        {totalVotes ?? 0} total vote{totalVotes !== 1 ? "s" : ""} cast
      </p>

      <div className="space-y-4">
        {poll?.options.map((opt: string) => {
          const count = results?.[opt] ?? 0;
          const pct =
            totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          return (
            <div key={opt}>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                <span>{opt}</span>
                <span>
                  {pct}% ({count})
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="w-full bg-slate-900 text-white py-4 rounded-xl text-lg font-black hover:bg-amber-600 transition-all shadow-lg"
      >
        Close
      </button>
    </div>
  );
};

// ─── Vote View ────────────────────────────────────────────────────────────────

const VoteView = ({
  poll,
  onDone,
}: {
  poll: Poll;
  onDone: () => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { data: existingVoteData, isLoading: checkingVote } = useQuery({
    queryKey: ["my-vote", poll._id],
    queryFn: () => voteService.myVote(poll._id),
  });

  const voteMutation = useMutation({
    mutationFn: () => voteService.cast(poll._id, selected!),
    onSuccess: onDone,
    onError: (err: any) => setError(err.message),
  });

  if (checkingVote)
    return (
      <div className="flex items-center justify-center py-12 gap-3">
        <Sun className="animate-spin text-amber-500" size={24} />
        <span className="text-slate-500">Checking your vote…</span>
      </div>
    );

  const alreadyVoted = existingVoteData?.data != null;

  return (
    <div className="p-2 space-y-5">
      {poll.description && (
        <p className="text-slate-500 font-medium italic">{poll.description}</p>
      )}

      {alreadyVoted ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-5">
          <CheckCircle2 className="text-green-500 shrink-0" size={22} />
          <div>
            <p className="font-bold text-green-700">You've already voted</p>
            <p className="text-sm text-green-600">
              Your response:{" "}
              <span className="font-black">
                {existingVoteData?.data?.selectedOption}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {poll.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold text-slate-700 transition-all ${
                  selected === opt
                    ? "border-amber-500 bg-amber-50 text-amber-800 shadow-md"
                    : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                      selected === opt
                        ? "border-amber-500 bg-amber-500"
                        : "border-slate-300"
                    }`}
                  />
                  {opt}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            onClick={() => voteMutation.mutate()}
            disabled={!selected || voteMutation.isPending}
            className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all shadow-xl mt-2"
          >
            {voteMutation.isPending ? "Submitting…" : "Submit Vote"}
          </button>
        </>
      )}
    </div>
  );
};

// ─── Poll Card ────────────────────────────────────────────────────────────────

const PollCard = ({
  poll,
  onVote,
  onResults,
}: {
  poll: Poll;
  onVote: (p: Poll) => void;
  onResults: (p: Poll) => void;
}) => {
  const now = new Date();

const start = new Date(poll.startDate);
const end = new Date(poll.endDate);

// fallback safety for invalid dates
const isValidDates = !isNaN(start.getTime()) && !isNaN(end.getTime());

const isVotable =
  poll.status?.toLowerCase() === "open" &&
  isValidDates &&
  now >= start &&
  now <= end;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-slate-800 via-amber-500 to-amber-400" />

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif font-black text-slate-900 text-xl leading-snug flex-1">
            {poll.title}
          </h3>
          <StatusBadge poll={poll} />
        </div>

        {poll.description && (
          <p className="text-slate-500 text-sm leading-relaxed">
            {poll.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {poll.options.map((opt) => (
            <span
              key={opt}
              className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
            >
              {opt}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Clock size={12} />
          {fmt(poll.startDate)} – {fmt(poll.endDate)}
        </div>

        <div className="pt-2 flex items-center gap-2 flex-wrap">
          {isVotable && (
            <button
              onClick={() => onVote(poll)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow active:scale-95"
            >
              <Vote size={15} /> Cast Vote
            </button>
          )}
          <button
            onClick={() => onResults(poll)}
            className="flex items-center gap-2 border-2 border-slate-200 hover:border-amber-400 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <BarChart3 size={15} /> Results
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentPoll = () => {
  const queryClient = useQueryClient();

  const [modalMode, setModalMode] = useState<"none" | "vote" | "results">("none");
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["polls"],
    queryFn: pollService.getAll,
  });

  const closeModal = () => {
    setModalMode("none");
    setActivePoll(null);
  };

  const polls: Poll[] = data?.data || [];

  const filteredPolls = polls.filter((p) => {
    if (filter === "open") return p.status === "open";
    if (filter === "closed") return p.status === "closed";
    return true;
  });

  const openCount = polls.filter((p) => p.status === "open").length;
  const closedCount = polls.filter((p) => p.status === "closed").length;

  const modalTitle =
    modalMode === "vote"
      ? activePoll?.title ?? "Cast Your Vote"
      : activePoll?.title ?? "Poll Results";

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-4">
          <Sun className="text-amber-500 animate-spin" size={48} />
          <div className="text-2xl font-serif font-bold text-slate-700">
            Loading Polls…
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-red-700 font-bold bg-red-50 h-screen">
        Error loading polls: {(error as any).message}
      </div>
    );

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <main className="flex-1 p-12">
        {/* ── Header ── */}
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">

          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <Vote size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-1">
                Scholar Polls
              </h1>
              <p className="text-lg text-slate-500 font-medium italic font-serif">
                Vote on active polls and view community results.
              </p>
            </div>
          </div>

           {/* Right side (Logout) */}
          <div className="flex items-center gap-4">
            <LogoutButton />
          </div>

        </header>

        {/* ── Summary chips ── */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Total Polls",
              value: polls.length,
              icon: <BarChart3 size={22} />,
              accent: "slate",
            },
            {
              label: "Active Polls",
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
                <p className="text-3xl font-serif font-black text-slate-900">
                  {value}
                </p>
                <p className="text-sm text-slate-500 font-semibold">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
          <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-wide">
            All Polls
          </h2>
          <div className="ml-auto flex gap-2">
            {(["all", "open", "closed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                  filter === f
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-amber-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Poll grid ── */}
        {filteredPolls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border-2 border-dashed border-amber-200">
            <Vote size={48} className="text-amber-300" />
            <p className="text-xl font-serif font-bold text-slate-400">
              No polls found
            </p>
            <p className="text-slate-400 text-sm">
              {filter !== "all"
                ? `No ${filter} polls at the moment.`
                : "No polls available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll._id}
                poll={poll}
                onVote={(p) => {
                  setActivePoll(p);
                  setModalMode("vote");
                }}
                onResults={(p) => {
                  setActivePoll(p);
                  setModalMode("results");
                }}
              />
            ))}
          </div>
        )}

        {/* ── Modal ── */}
        <Modal
          isOpen={modalMode !== "none"}
          onClose={closeModal}
          title={modalTitle}
        >
          {modalMode === "vote" && activePoll && (
            <VoteView
              poll={activePoll}
              onDone={() => {
                queryClient.invalidateQueries({
                  queryKey: ["my-vote", activePoll._id],
                });
                closeModal();
              }}
            />
          )}
          {modalMode === "results" && activePoll && (
            <ResultsView pollId={activePoll._id} onClose={closeModal} />
          )}
        </Modal>
      </main>
    </div>
  );
};

export default StudentPoll;