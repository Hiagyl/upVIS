import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import TransactionTable from "../components/dashboard/TransactionTable";
import Modal from "../components/shared/Modal";
import { PlusCircle, History, Receipt } from "lucide-react";

const TransactionsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionService.getAll,
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

  const transactions = data?.data || [];

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-12">
        {/* Header: High Contrast Landmark */}
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400">
              <Receipt size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-2">
                Transaction History
              </h1>
              <p className="text-lg text-slate-500 font-medium font-serif italic">
                A permanent chronicle of all scholarship movements.
              </p>
            </div>
          </div>

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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
            <History
              className="text-amber-500 animate-spin-reverse mb-2"
              size={48}
            />
            <p className="text-2xl font-serif font-bold text-slate-400 tracking-wide">
              Consulting the Records...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl text-xl font-bold">
            The transaction history is currently unavailable:{" "}
            {(error as any).message}
          </div>
        ) : (
          /* Table rendered directly on the background without an extra nested container box */
          <TransactionTable
            transactions={transactions}
            onEdit={(t: any) => {
              setEditingItem(t);
              setIsModalOpen(true);
            }}
            onDelete={(id: string) => {
              if (
                window.confirm(
                  "Do you wish to strike this entry from the records?",
                )
              )
                deleteMutation.mutate(id);
            }}
          />
        )}

        {/* --- CHRONICLE ENTRY MODAL --- */}
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
                  defaultValue={editingItem?.type || "donation"}
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl font-bold bg-white cursor-pointer hover:border-amber-500 transition-colors"
                >
                  <option value="donation">Donation (Increase)</option>
                  <option value="expense">Expense (Decrease)</option>
                </select>
              </div>
            </div>

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
              className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all mt-4 shadow-xl"
            >
              {saveMutation.isPending
                ? "Updating Transactions..."
                : editingItem
                  ? "Update Entry"
                  : "Add Entry"}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default TransactionsPage;
