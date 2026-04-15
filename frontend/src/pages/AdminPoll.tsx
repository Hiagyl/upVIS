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
} from "lucide-react";

const BASE = "http://localhost:5000/api/v1";

const pollService = {
  getAll: async () => {
    const r = await fetch(`${BASE}/polls`);
    if (!r.ok) throw new Error("Failed to fetch polls");
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
    const r = await fetch(`${BASE}/polls/${id}/close`, {
      method: "PATCH",
    });
    if (!r.ok) throw new Error("Failed to close poll");
    return r.json();
  },
  delete: async (id: string) => {
    const r = await fetch(`${BASE}/polls/${id}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error("Failed to delete poll");
    return r.json();
  },
};

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: string[];
  status: "open" | "closed";
}

const AdminPoll = () => {
  const queryClient = useQueryClient();

  const [modalMode, setModalMode] = useState<"none" | "create" | "edit">("none");
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleOptionChange = (value: string, index: number) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["polls"],
    queryFn: pollService.getAll,
  });

  const polls: Poll[] = data?.data || [];

  const filteredPolls =
    filter === "all"
      ? polls
      : polls.filter((p) => p.status === filter);

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      activePoll && modalMode === "edit"
        ? pollService.update(activePoll._id, payload)
        : pollService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      closeModal();
      setOptions(["", ""]);
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
    setOptions(["", ""]);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] ml-72">
        <Sun className="text-amber-500 animate-spin" size={48} />
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
            className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            <PlusCircle size={24} />
            Create Poll
          </button>
        </header>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-serif font-black text-slate-900 uppercase">
              Poll Records
            </h2>
          </div>

          <div className="flex gap-3">
            {["All", "Open", "Closed"].map((label) => {
              const value = label.toLowerCase();
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value as any)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold ${
                    filter === value
                      ? "bg-slate-900 text-white"
                      : "bg-white border-2 border-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredPolls.length === 0 && (
          <div className="bg-white p-16 rounded-2xl border-2 border-dashed text-center text-slate-500">
            No polls available.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPolls.map((poll) => (
            <div key={poll._id} className="bg-white p-6 rounded-2xl border-2 shadow-sm hover:shadow-lg">
              <div className="flex justify-between">
                <h2 className="font-serif font-bold text-lg">{poll.title}</h2>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-200">
                  {poll.status}
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-2 italic">
                {poll.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {poll.options.map((o) => (
                  <span key={o} className="text-xs bg-amber-50 px-2 py-1 rounded">
                    {o}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-2">
                  <button onClick={() => { setActivePoll(poll); setModalMode("edit"); }}>
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => closeMutation.mutate(poll._id)}>
                    <Lock size={16} />
                  </button>

                  <button onClick={() => deleteMutation.mutate(poll._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedPoll(poll);
                    setResultModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-sm text-amber-600 font-bold"
                >
                  <BarChart3 size={16} />
                  Results
                </button>
              </div>
            </div>
          ))}
        </div>

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
                options: options.filter((o) => o.trim() !== ""),
              });
            }}
            className="space-y-6"
          >
            {/* TITLE (FIXED) */}
            <div className="relative border-2 border-slate-300 rounded-xl p-4">
              <span className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-500">
                Title
              </span>
              <textarea
                name="title"
                rows={1}
                required
                className="w-full outline-none bg-transparent resize-none overflow-hidden"
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="relative border-2 border-slate-300 rounded-xl p-4">
              <span className="absolute -top-2 left-3 bg-white px-1 text-xs text-slate-500">
                Description
              </span>
              <textarea
                name="description"
                rows={1}
                className="w-full outline-none bg-transparent resize-none overflow-hidden"
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
              />
            </div>

            {/* OPTIONS */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-2">
                Options
              </p>

              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt}
                      onChange={(e) => handleOptionChange(e.target.value, i)}
                      placeholder={`Option ${i + 1}`}
                      className="w-full border-2 border-slate-300 p-3 rounded-xl outline-none"
                      required
                    />

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="px-3 bg-red-100 text-red-600 rounded-xl"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addOption}
                className="mt-3 text-sm text-amber-600 font-bold"
              >
                + Add Option
              </button>
            </div>

            <button className="w-full bg-slate-900 hover:bg-amber-600 text-white py-4 rounded-xl font-bold">
              Save Poll
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          title="Poll Results"
        >
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-black">
              {selectedPoll?.title}
            </h2>

            {selectedPoll?.options.map((option) => {
              const votes = Math.floor(Math.random() * 20) + 1;
              const totalVotes = 50;
              const percentage = Math.round((votes / totalVotes) * 100);

              return (
                <div key={option}>
                  <div className="flex justify-between text-sm font-bold">
                    <span>{option}</span>
                    <span>{votes} votes ({percentage}%)</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-amber-500 h-3 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>

      </main>
    </div>
  );
};

export default AdminPoll;