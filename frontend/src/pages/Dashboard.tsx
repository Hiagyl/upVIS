import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionTable from "../components/dashboard/TransactionTable";
import Modal from "../components/shared/Modal";
import ConfirmModal from "../components/shared/ConfirmModal";
import ToastContainer, { useToast } from "../components/shared/Toast";
import { PlusCircle, Sun, LayoutDashboard } from "lucide-react";
import { FileDown } from "lucide-react";
import { reportService } from "../services/api";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [entryType, setEntryType] = useState("donation");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  // ── Confirm modal state ──────────────────────────────────────────────────
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  // ── Toast ────────────────────────────────────────────────────────────────
  const { toasts, removeToast, toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", page, search, startDate, endDate],

    queryFn: () =>
      transactionService.getAll(page, 10, search, startDate, endDate),
  });

  const { data: donorsData } = useQuery({
    queryKey: ["donors"],
    queryFn: () => fetch("/api/donors").then((res) => res.json()),
  });
  const donors = donorsData?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setConfirmState({ isOpen: false, id: null });
      toast.success("Entry Deleted", "The transaction has been permanently removed.");
    },
    onError: () => {
      setConfirmState({ isOpen: false, id: null });
      toast.error("Delete Failed", "Something went wrong. Please try again.");
    },
  });

  const saveMutation = useMutation({
    mutationFn: (formData: any) =>
      editingItem
        ? transactionService.update(editingItem._id, formData)
        : transactionService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsModalOpen(false);
      setEditingItem(null);
      toast.success(
        editingItem ? "Entry Updated" : "Entry Added",
        editingItem
          ? "The transaction has been successfully amended."
          : "New transaction has been recorded."
      );
    },
    onError: () => {
      toast.error("Save Failed", "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      description: formData.get("description"),
      amount: Number(formData.get("amount")),
      category: formData.get("category"),
      type: formData.get("type"),
      donorInfo:
        entryType === "donation"
          ? { name: formData.get("donor") }
          : undefined,
      date: editingItem?.date || new Date().toISOString(),
    };
    saveMutation.mutate(payload);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] ml-72">
        <div className="flex flex-col items-center gap-4">
          <Sun className="text-amber-500 animate-spin" size={48} />
          <div className="text-2xl font-sans font-bold text-slate-700">
            Updating the Transaction History...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="ml-72 p-10 text-red-700 font-bold bg-red-50 h-screen">
        Error accessing records: {(error as any).message}
      </div>
    );

  const summary = data?.summary || {
    totalDonations: 0,
    totalExpenses: 0,
    balance: 0,
  };
  const transactions = data?.data || [];
  const currentPage = data?.currentPage || 1;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-sans font-bold text-slate-900 tracking-tight mb-1">
                Dashboard
              </h1>
              <p className="text-lg text-slate-500 font-medium font-sans">
                Financial overview of our organization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => reportService.downloadFinancialSummary()}
              className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              <FileDown size={24} strokeWidth={3} />
              Export PDF
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setEntryType("donation");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              <PlusCircle size={24} strokeWidth={3} />
              Add New Entry
            </button>
          </div>
        </header>

        <SummaryCards summary={summary} />

        <div className="mt-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-sans font-bold text-slate-900 uppercase tracking-wide">
              Recent Transaction Entries
            </h2>
          </div>

          <div className="space-y-6">
            <TransactionTable
              transactions={transactions}
              onEdit={(t: any) => {
                setEditingItem(t);
                setEntryType(t.type || "donation");
                setIsModalOpen(true);
              }}
              onDelete={(id: string) => {
                setConfirmState({ isOpen: true, id });
              }}
            />

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold disabled:bg-slate-300"
              >
                Prev
              </button>

              <div className="font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold disabled:bg-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ── Entry Form Modal ─────────────────────────────────────────────── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Update Entry" : "Record New Entry"}
        >
          <form onSubmit={handleSubmit} className="p-2 space-y-6">
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Description of Event
              </label>
              <input
                name="description"
                defaultValue={editingItem?.description}
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none transition-colors"
                placeholder="e.g., Semester Tuition Grant"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">
                  Amount (₱)
                </label>
                <input
                  name="amount"
                  type="number"
                  defaultValue={editingItem?.amount}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">
                  Entry Type
                </label>
                <select
                  name="type"
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl font-bold bg-white cursor-pointer hover:border-amber-500 transition-colors"
                >
                  <option value="donation">Donation (Increase)</option>
                  <option value="expense">Expense (Decrease)</option>
                </select>
              </div>
            </div>

            {entryType === "donation" && (
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">
                  Donor Name
                </label>
                <input
                  list="donors"
                  name="donor"
                  defaultValue={editingItem?.donorInfo?.name || ""}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                  placeholder="Start typing to search..."
                />
                <datalist id="donors">
                  {donors.map((d: any) => (
                    <option key={d._id} value={d.name} />
                  ))}
                </datalist>
              </div>
            )}

            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Allocation Category
              </label>
              <input
                name="category"
                defaultValue={editingItem?.category}
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g., Medical Assistance"
              />
            </div>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-bold hover:bg-amber-600 disabled:bg-slate-300 transition-all mt-4 shadow-xl"
            >
              {saveMutation.isPending
                ? "Updating the Chronicle..."
                : editingItem
                  ? "Amend Entry"
                  : "Add Entry"}
            </button>
          </form>
        </Modal>

        {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
        <ConfirmModal
          isOpen={confirmState.isOpen}
          onClose={() => setConfirmState({ isOpen: false, id: null })}
          onConfirm={() => {
            if (confirmState.id) deleteMutation.mutate(confirmState.id);
          }}
          title="Delete Entry?"
          message="This transaction will be permanently removed from the chronicle. This action cannot be undone."
          confirmLabel="Yes, Delete"
          isDestructive
          isPending={deleteMutation.isPending}
        />

        {/* ── Toast Notifications ──────────────────────────────────────────── */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </div>
  );
};

export default Dashboard;