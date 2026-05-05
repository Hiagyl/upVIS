import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionTable from "../components/dashboard/TransactionTable";
import Modal from "../components/shared/Modal";
import { PlusCircle, Sun, LayoutDashboard } from "lucide-react";
import { FileDown } from "lucide-react";
import { reportService } from "../services/api";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionService.getAll,
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
      date: editingItem?.date || new Date().toISOString(),
    };
    saveMutation.mutate(payload);
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF9F6] ml-72">
        <div className="flex flex-col items-center gap-4">
          <Sun className="text-amber-500 animate-spin" size={48} />
          <div className="text-2xl font-serif font-bold text-slate-700">
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

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />

      {/* Main Content: Increased margin for the wider sidebar */}
      <main className="flex-1 ml-72 p-12">
        {/* Header Section: Bold and High Contrast */}
        {/* Header Section: Consistent with MembersPage */}
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Icon container: same style as MembersPage */}
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <LayoutDashboard size={32} />
            </div>
            {/* Title and subtitle */}
            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-1">
                Dashboard
              </h1>
              <p className="text-lg text-slate-500 font-medium italic font-serif">
                Financial overview of our organization.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => reportService.downloadFinancialSummary()}
                  className="flex items-center gap-3 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95"
                >
                  <FileDown size={24} strokeWidth={3} />
                  Export PDF
                </button>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
                >
                  <PlusCircle size={24} strokeWidth={3} />
                  Add New Entry
                </button>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
          >
            <PlusCircle size={24} strokeWidth={3} />
            Add New Entry
          </button>
        </header>

        {/* Summaries Section */}
        <SummaryCards summary={summary} />

        {/* Transaction Section */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
            <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-wide">
              Recent Transaction Entries
            </h2>
          </div>

          <TransactionTable
            transactions={transactions}
            onEdit={(t: any) => {
              setEditingItem(t);
              setIsModalOpen(true);
            }}
            onDelete={(id: string) => {
              if (
                window.confirm(
                  "Are you sure you want to permanently remove this entry?",
                )
              )
                deleteMutation.mutate(id);
            }}
          />
        </div>

        {/* --- ACCESSIBLE MODAL --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Update Transaction" : "Record New Transaction"}
        >
          <form onSubmit={handleSubmit} className="p-2 space-y-6">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                Description of Transaction
              </label>
              <input
                name="description"
                defaultValue={editingItem?.description}
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-bold text-slate-800 mb-2">
                  Amount (₱)
                </label>
                <input
                  name="amount"
                  type="number"
                  defaultValue={editingItem?.amount}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg"
                />
              </div>
              <div>
                <label className="block text-base font-bold text-slate-800 mb-2">
                  Type of Entry
                </label>
                <select
                  name="type"
                  defaultValue={editingItem?.type || "donation"}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg font-bold bg-white"
                >
                  <option value="donation">Donation (+)</option>
                  <option value="expense">Expense (-)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                Category
              </label>
              <input
                name="category"
                defaultValue={editingItem?.category}
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg"
                placeholder="e.g., General Scholarship Fund"
              />
            </div>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all mt-4 shadow-xl"
            >
              {saveMutation.isPending
                ? "Loading..."
                : editingItem
                  ? "Update Transaction"
                  : "Record Transaction"}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default Dashboard;