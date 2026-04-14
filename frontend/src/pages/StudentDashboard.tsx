import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { pollService } from "../services/api";
import { LayoutDashboard, BarChart3, Sun } from "lucide-react";

type PollOption = {
  _id: string;
  text: string;
  votes: number;
};

type Poll = {
  _id: string;
  question: string;
  options: PollOption[];
};

const StudentDashboard = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await pollService.getPolls();
        setPolls(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] ml-72">
        <div className="flex flex-col items-center gap-4">
          <Sun className="text-amber-500 animate-spin" size={48} />
          <div className="text-2xl font-serif font-bold text-slate-700">
            Loading student dashboard...
          </div>
        </div>
      </div>
    );

  const totalPolls = polls.length;
  const totalVotes = polls.reduce(
    (sum, poll) =>
      sum + poll.options.reduce((s, o) => s + o.votes, 0),
    0
  );

  const activePolls = polls.filter((p) => p.options.length > 0).length;

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      {/* Sidebar (ONLY POLL NAV INSIDE IT) */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 ml-72 p-12">
        {/* HEADER */}
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <LayoutDashboard size={32} />
            </div>

            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900">
                Student Dashboard
              </h1>
              <p className="text-lg text-slate-500 italic font-serif">
                Your voting activity and polls overview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-100 text-amber-800 px-6 py-3 rounded-xl font-bold">
            <BarChart3 />
            Live Poll System
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm">
            <h3 className="text-slate-500 font-bold">Total Polls</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">
              {totalPolls}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm">
            <h3 className="text-slate-500 font-bold">Active Polls</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">
              {activePolls}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm">
            <h3 className="text-slate-500 font-bold">Total Votes</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">
              {totalVotes}
            </p>
          </div>
        </div>

        {/* RECENT POLLS */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-serif font-black text-slate-900 uppercase">
              Recent Poll Activity
            </h2>
          </div>

          <div className="space-y-6">
            {polls.slice(0, 3).map((poll) => {
              const totalVotes = poll.options.reduce(
                (sum, o) => sum + o.votes,
                0
              );

              return (
                <div
                  key={poll._id}
                  className="bg-white border-2 border-slate-100 rounded-2xl p-8 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    {poll.question}
                  </h3>

                  <div className="space-y-3">
                    {poll.options.slice(0, 3).map((opt) => {
                      const percent =
                        totalVotes > 0
                          ? Math.round((opt.votes / totalVotes) * 100)
                          : 0;

                      return (
                        <div key={opt._id}>
                          <div className="flex justify-between text-sm font-semibold">
                            <span>{opt.text}</span>
                            <span className="text-slate-500">
                              {percent}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;