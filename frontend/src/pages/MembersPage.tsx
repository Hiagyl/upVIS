import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import ToastContainer, { useToast } from "../components/shared/Toast";
import {
  UserPlus,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Search,
  History,
} from "lucide-react";

const MembersPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ── Confirm modal state ──────────────────────────────────────────────────
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({ isOpen: false, id: null, name: "" });

  // ── Toast ────────────────────────────────────────────────────────────────
  const { toasts, removeToast, toast } = useToast();

  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: memberService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => memberService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setConfirmState({ isOpen: false, id: null, name: "" });
      toast.success("Member Removed", "The member has been removed from the roster.");
    },
    onError: () => {
      setConfirmState({ isOpen: false, id: null, name: "" });
      toast.error("Delete Failed", "Something went wrong. Please try again.");
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: any }) =>
      id ? memberService.update(id, payload) : memberService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsModalOpen(false);
      setEditingMember(null);
      toast.success(
        editingMember ? "Profile Updated" : "Member Registered",
        editingMember
          ? "The member's profile has been successfully amended."
          : "New member has been added to the roster."
      );
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.error || "";
      if (errorMsg.includes("E11000")) {
        toast.error("Duplicate Entry", "This Member ID or Contact already exists.");
      } else {
        toast.error("Save Failed", "Failed to save member. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    saveMutation.mutate({ id: editingMember?._id, payload });
  };

  const filteredMembers = members?.filter((m: any) =>
    m.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-sans font-bold text-slate-900 tracking-tight mb-1">
                Organization Roster
              </h1>
              <p className="text-lg text-slate-500 font-medium font-sans">
                Managing the hands that build our community.
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
                placeholder="Find a member..."
                className="pl-12 pr-6 py-4 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 bg-[#FAF9F6] w-80 text-lg shadow-inner transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setEditingMember(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg active:scale-95"
            >
              <UserPlus size={24} strokeWidth={2.5} />
              Add Member
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-white animate-pulse rounded-2xl border-2 border-slate-50"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-slate-100 text-sm font-bold uppercase tracking-wide">
                <tr>
                  <th className="p-6 border-b-2 border-slate-800">Full Name</th>
                  <th className="p-6 border-b-2 border-slate-800">Contact Details</th>
                  <th className="p-6 border-b-2 border-slate-800">Tenure Since</th>
                  <th className="p-6 border-b-2 border-slate-800">Security Status</th>
                  <th className="p-6 border-b-2 border-slate-800 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filteredMembers?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <History size={48} strokeWidth={1.5} className="opacity-20" />
                        <p className="text-xl font-medium italic font-sans text-slate-500">
                          The member directory is currently empty.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member: any) => (
                    <tr
                      key={member._id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-6">
                        <span className="text-lg font-bold font-sans text-slate-900">
                          {member.fullname}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1 text-slate-700 font-bold">
                          <span>{member.contactNo}</span>
                          <span className="text-sm text-slate-500">
                            {member.email || "No email listed"}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-lg font-medium font-sans text-slate-500">
                          {new Date(member.joinDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                            member.status === "active"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {member.status === "active" ? (
                            <ShieldCheck size={14} />
                          ) : (
                            <ShieldAlert size={14} />
                          )}
                          {member.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              setEditingMember(member);
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
                                id: member._id,
                                name: member.fullname,
                              })
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border-2 border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                          >
                            <Trash2 size={18} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>
                    <div className="p-6 bg-slate-50 border-t-2 border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                          upVIS
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 italic font-sans">
                        "From a little spark may burst a flame."
                      </p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* ── Member Form Modal ────────────────────────────────────────────── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMember ? "Amend Member Profile" : "Register New Member"}
        >
          <form onSubmit={handleSubmit} className="p-2 space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                Full Legal Name
              </label>
              <input
                name="fullname"
                defaultValue={editingMember?.fullname}
                required
                className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl outline-none focus:border-amber-500 bg-slate-50 transition-all font-sans"
                placeholder="e.g., Juan Dela Cruz"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Primary Contact No.
                </label>
                <input
                  name="contactNo"
                  defaultValue={editingMember?.contactNo}
                  required
                  className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl outline-none focus:border-amber-500 bg-slate-50 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Access Status
                </label>
                <select
                  name="status"
                  defaultValue={editingMember?.status || "active"}
                  className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl font-bold bg-slate-50 cursor-pointer appearance-none focus:border-amber-500"
                >
                  <option value="active">Active Member</option>
                  <option value="inactive">Inactive / Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                Official Join Date
              </label>
              <input
                name="joinDate"
                type="date"
                defaultValue={
                  editingMember?.joinDate
                    ? new Date(editingMember.joinDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl outline-none focus:border-amber-500 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xl font-bold hover:bg-amber-600 disabled:bg-slate-300 transition-all shadow-xl flex justify-center items-center gap-3 mt-4"
            >
              {saveMutation.isPending && <Loader2 size={24} className="animate-spin" />}
              {editingMember ? "Confirm Update" : "Confirm Registration"}
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
          title="Remove This Member?"
          message={`${confirmState.name} will be permanently removed from the roster. This action cannot be undone.`}
          confirmLabel="Yes, Remove"
          isDestructive
          isPending={deleteMutation.isPending}
        />

        {/* ── Toast Notifications ──────────────────────────────────────────── */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </div>
  );
};

export default MembersPage;