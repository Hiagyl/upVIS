import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import TransactionTable from '../components/dashboard/TransactionTable';
import Modal from '../components/shared/Modal';
import { PlusCircle } from 'lucide-react';

const TransactionsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // 1. FETCH TRANSACTIONS
    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: transactionService.getAll,
    });

    // 2. DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    // 3. SAVE (CREATE/UPDATE) MUTATION
    const saveMutation = useMutation({
        mutationFn: (formData: any) =>
            editingItem
                ? transactionService.update(editingItem._id, formData)
                : transactionService.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            setIsModalOpen(false);
            setEditingItem(null);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            description: formData.get('description'),
            amount: Number(formData.get('amount')),
            category: formData.get('category'),
            type: formData.get('type'),
            date: editingItem?.date || new Date().toISOString(),
        };
        saveMutation.mutate(payload);
    };

    const transactions = data?.data || [];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
                        <p className="text-gray-500">A detailed log of all upVIS financial movements.</p>
                    </div>
                    <button
                        onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                    >
                        <PlusCircle size={20} />
                        New Transaction
                    </button>
                </header>

                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="bg-white h-12 w-full rounded-t-xl border border-gray-200"></div>
                        <div className="bg-white h-64 w-full rounded-b-xl border border-gray-200"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl">
                        Error loading transactions: {(error as any).message}
                    </div>
                ) : (
                    <TransactionTable
                        transactions={transactions}
                        onEdit={(t: any) => { setEditingItem(t); setIsModalOpen(true); }}
                        onDelete={(id: string) => {
                            if (window.confirm("Permanently delete this record?")) deleteMutation.mutate(id);
                        }}
                    />
                )}

                {/* --- ADD/EDIT TRANSACTION MODAL --- */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingItem ? "Edit Transaction" : "Record New Transaction"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <input
                                name="description"
                                defaultValue={editingItem?.description}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g., Annual Youth Donation"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₱)</label>
                                <input
                                    name="amount"
                                    type="number"
                                    defaultValue={editingItem?.amount}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                                <select
                                    name="type"
                                    defaultValue={editingItem?.type || "donation"}
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                >
                                    <option value="donation">Donation (+)</option>
                                    <option value="expense">Expense (-)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <input
                                name="category"
                                defaultValue={editingItem?.category}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g., Logistics, Food, etc."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors mt-2"
                        >
                            {saveMutation.isPending ? 'Saving Record...' : (editingItem ? 'Update Record' : 'Save Transaction')}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default TransactionsPage;