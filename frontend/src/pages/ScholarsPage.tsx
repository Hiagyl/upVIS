import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scholarService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import ToastContainer, { useToast } from "../components/shared/Toast";
import {
  GraduationCap,
  Edit2,
  Trash2,
  Loader2,
  UserPlus,
  BookOpen,
  History,
  Search,
} from "lucide-react";

const ScholarsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholar, setEditingScholar] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ── Confirm modal state ──────────────────────────────────────────────────
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({ isOpen: false, id: null, name: "" });

  // ── Toast ────────────────────────────────────────────────────────────────
  const { toasts, removeToast, toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["scholars"],
    queryFn: scholarService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scholarService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholars"] });
      setConfirmState({ isOpen: false, id: null, name: "" });
      toast.success("Scholar Removed", "The record has been struck from the directory.");
    },
    onError: () => {
      setConfirmState({ isOpen: false, id: null, name: "" });
      toast.error("Delete Failed", "Something went wrong. Please try again.");
    },
  });

  const saveMutation = useMutation({
    mutationFn: (formData: any) =>
      editingScholar
        ? scholarService.update(editingScholar._id, formData)
        : scholarService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholars"] });
      setIsModalOpen(false);
      setEditingScholar(null);
      toast.success(
        editingScholar ? "Profile Updated" : "Scholar Registered",
        editingScholar
          ? "The scholar's record has been successfully amended."
          : "New scholar has been added to the directory."
      );
    },
    onError: () => {
      toast.error("Save Failed", "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    saveMutation.mutate(payload);
  };

  const scholars = data?.data || [];

  const filteredScholars = scholars.filter(
    (s: any) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-2">
                Scholar Directory
              </h1>
              <p className="text-lg text-slate-500 font-medium font-serif italic">
                A permanent chronicle of academic excellence and potential.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Find a scholar..."
                className="pl-12 pr-6 py-4 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 bg-[#FAF9F6] w-80 text-lg shadow-inner transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setEditingScholar(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              <UserPlus size={24} strokeWidth={3} />
              Add Scholar
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
            <History className="text-amber-500 animate-spin-reverse mb-2" size={48} />
            <p className="text-2xl font-serif font-bold text-slate-400 tracking-wide">
              Consulting the Records...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl text-xl font-bold">
            The directory is currently unavailable: {(error as any).message}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-slate-100 text-sm font-bold uppercase tracking-wide">
                <tr>
                  <th className="p-6 border-b-2 border-slate-800">Student Profile</th>
                  <th className="p-6 border-b-2 border-slate-800">Academic Program</th>
                  <th className="p-6 border-b-2 border-slate-800">Status</th>
                  <th className="p-6 border-b-2 border-slate-800 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filteredScholars.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <History size={48} strokeWidth={1.5} className="opacity-20" />
                        <p className="text-xl font-medium italic font-serif text-slate-500">
                          {searchTerm
                            ? `No records matching "${searchTerm}" found.`
                            : "The scholar directory is currently empty."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredScholars.map((scholar: any) => (
                    <tr
                      key={scholar._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="text-lg font-bold text-slate-900 font-serif">
                          {scholar.name}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="px-3 py-1.5 text-xs font-black rounded-full bg-slate-100 text-slate-700 border-2 border-slate-200 uppercase tracking-wider">
                            {scholar.studentNumber}
                          </span>
                          <span className="px-3 py-1.5 text-xs font-black rounded-full bg-amber-50 text-amber-700 border-2 border-amber-200 uppercase tracking-wider">
                            {scholar.upMail}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-full border-2 bg-slate-100 border-slate-200 text-slate-400">
                            <BookOpen size={20} />
                          </div>
                          <span className="text-lg font-bold text-slate-900">
                            {scholar.program}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border-2 ${
                            scholar.status === "Student"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                        >
                          {scholar.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              setEditingScholar(scholar);
                              setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-lg hover:bg-white hover:border-amber-500 transition-all font-bold text-sm"
                          >
                            <Edit2 size={18} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() =>
                              setConfirmState({
                                isOpen: true,
                                id: scholar._id,
                                name: scholar.name,
                              })
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border-2 border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                          >
                            <Trash2 size={18} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <div className="p-6 bg-slate-50 border-t-2 border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                          upVIS
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 italic font-serif">
                        "Behold the light that leads the way."
                      </p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* ── Entry Form Modal ─────────────────────────────────────────────── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingScholar ? "Update Scholar Profile" : "Register New Scholar"}
        >
          <form onSubmit={handleSubmit} className="p-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-slate-800 mb-2">Full Legal Name</label>
                <input
                  name="name"
                  defaultValue={editingScholar?.name}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">Student ID Number</label>
                <input
                  name="studentNumber"
                  defaultValue={editingScholar?.studentNumber}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                  placeholder="20XX-XXXXX"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">University Email</label>
                <input
                  name="upMail"
                  type="email"
                  defaultValue={editingScholar?.upMail}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                  placeholder="@up.edu.ph"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-bold text-slate-800 mb-2">Degree Program</label>
                <input
                  name="program"
                  defaultValue={editingScholar?.program}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                  placeholder="e.g., BS Computer Science"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">Academic Status</label>
                <select
                  name="status"
                  defaultValue={editingScholar?.status || "Student"}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl font-bold bg-white cursor-pointer hover:border-amber-500 transition-colors"
                >
                  <option value="Student">Active Student</option>
                  <option value="Graduated">Distinguished Alumni</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">Scholarship Start Date</label>
                <input
                  name="scholarshipStartDate"
                  type="date"
                  defaultValue={
                    editingScholar?.scholarshipStartDate
                      ? new Date(editingScholar.scholarshipStartDate).toISOString().split("T")[0]
                      : ""
                  }
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all shadow-xl mt-4"
            >
              {saveMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={24} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : editingScholar ? (
                "Confirm Update"
              ) : (
                "Confirm Registration"
              )}
            </button>
          </form>
        </Modal>

        {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
        <ConfirmModal
          isOpen={confirmState.isOpen}
          onClose={() => setConfirmState({ isOpen: false, id: null, name: "" })}
          onConfirm={() => {
            if (confirmState.id) deleteMutation.mutate(confirmState.id);
          }}
          title="Strike This Scholar?"
          message={`${confirmState.name} will be permanently struck from the active directory. This action cannot be undone.`}
          confirmLabel="Yes, Strike It"
          isDestructive
          isPending={deleteMutation.isPending}
        />

        {/* ── Toast Notifications ──────────────────────────────────────────── */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </div>
  );
};

export default ScholarsPage;