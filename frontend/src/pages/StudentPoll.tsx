import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/shared/Modal";
import { mockPolls } from "../mockPolls";
import {
  Vote,
  Sun,
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  Lock,
} from "lucide-react";

const BASE = "/api/v1";

const pollService = {
  getResults: async (id: string) => {
    const r = await fetch(`${BASE}/polls/${id}/results`);
    if (!r.ok) throw new Error("Failed to fetch results");
    return r.json();
  },
};

const voteService = {
  cast: async (pollId: string, selectedOption: string) => {
    const r = await fetch(`${BASE}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId, selectedOption }),
    });
    if (!r.ok) throw new Error("Failed to vote");
    return r.json();
  },
  myVote: async (pollId: string) => {
    const r = await fetch(`${BASE}/votes/poll/${pollId}/my-vote`);
    if (!r.ok) throw new Error("Failed to fetch vote");
    return r.json();
  },
};

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  status: "open" | "closed";
}

const StatusBadge = ({ poll }: { poll: Poll }) => {
  const now = new Date();
  const end = new Date(poll.endDate);
  const start = new Date(poll.startDate);

  if (poll.status === "closed") return <span className="text-xs">Closed</span>;
  if (now < start) return <span className="text-xs">Upcoming</span>;
  if (now > end) return <span className="text-xs">Expired</span>;
  return <span className="text-xs text-amber-600">Active</span>;
};

const ResultsView = ({ pollId, onClose }: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["results", pollId],
    queryFn: () => pollService.getResults(pollId),
  });

  if (isLoading) return <div>Loading...</div>;

  const { poll, results, totalVotes } = data?.data || {};

  return (
    <div className="space-y-3">
      {poll?.options.map((opt: string) => (
        <div key={opt}>
          {opt}: {results?.[opt] || 0}
        </div>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const VoteView = ({ poll, onDone }: any) => {
  const [selected, setSelected] = useState<string | null>(null);

  const voteMutation = useMutation({
    mutationFn: () => voteService.cast(poll._id, selected!),
    onSuccess: onDone,
  });

  return (
    <div className="space-y-3">
      {poll.options.map((opt: string) => (
        <button key={opt} onClick={() => setSelected(opt)}>
          {opt}
        </button>
      ))}
      <button onClick={() => voteMutation.mutate()}>Submit</button>
    </div>
  );
};

const PollCard = ({
  poll,
  onVote,
  onResults,
}: any) => {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <h3>{poll.title}</h3>
      <StatusBadge poll={poll} />

      <div className="flex gap-2 mt-3">
        <button onClick={() => onVote(poll)}>Vote</button>
        <button onClick={() => onResults(poll)}>Results</button>
      </div>
    </div>
  );
};

const StudentPoll = () => {
  const queryClient = useQueryClient();
  const [modalMode, setModalMode] = useState<"none" | "vote" | "results">("none");
  const [activePoll, setActivePoll] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["polls"],
    queryFn: async () => ({ data: mockPolls }),
  });

  const polls = data?.data || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Student Polls</h1>

      <div className="grid gap-4">
        {polls.map((poll: any) => (
          <PollCard
            key={poll._id}
            poll={poll}
            onVote={(p: any) => {
              setActivePoll(p);
              setModalMode("vote");
            }}
            onResults={(p: any) => {
              setActivePoll(p);
              setModalMode("results");
            }}
          />
        ))}
      </div>

      <Modal
        isOpen={modalMode !== "none"}
        onClose={() => setModalMode("none")}
        title="Poll"
      >
        {modalMode === "vote" && (
          <VoteView
            poll={activePoll}
            onDone={() => setModalMode("none")}
          />
        )}
        {modalMode === "results" && (
          <ResultsView
            pollId={activePoll?._id}
            onClose={() => setModalMode("none")}
          />
        )}
      </Modal>
    </div>
  );
};

export default StudentPoll;