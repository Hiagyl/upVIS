import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/api'; // Use the object export
import Sidebar from '../components/layout/Sidebar';
import SummaryCards from '../components/dashboard/SummaryCards';
import TransactionTable from '../components/dashboard/TransactionTable';
import Modal from '../components/shared/Modal';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // 1. FETCH DATA
    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: transactionService.getAll, // Updated to use transactionService
        refetchInterval: 30000,
    });

    // 2. DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: (id: string) => transactionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    // 3. ADD/EDIT MUTATION
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

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 ml-64">
            <div className="text-xl font-medium text-slate-600 animate-pulse">Updating upVIS Data...</div>
        </div>
    );

    if (error) return <div className="ml-64 p-10 text-red-500">Error: {(error as any).message}</div>;

    const summary = data?.summary || { totalDonations: 0, totalExpenses: 0, balance: 0 };
    const transactions = data?.data || [];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500">Real-time financial status</p>
                    </div>
                    <button
                        onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
                    >
                        <Plus size={20} />
                        Add Transaction
                    </button>
                </header>

                <SummaryCards summary={summary} />

                <div className="mt-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
                    <TransactionTable
                        transactions={transactions}
                        onEdit={(t: any) => { setEditingItem(t); setIsModalOpen(true); }}
                        onDelete={(id: string) => {
                            if (window.confirm("Delete this transaction?")) deleteMutation.mutate(id);
                        }}
                    />
                </div>

                {/* --- ADD/EDIT MODAL --- */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingItem ? "Edit Transaction" : "New Transaction"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <input name="description" defaultValue={editingItem?.description} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₱)</label>
                                <input name="amount" type="number" defaultValue={editingItem?.amount} required className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                                <select name="type" defaultValue={editingItem?.type || "donation"} className="w-full border border-gray-300 rounded-lg p-2.5">
                                    <option value="donation">Donation (+)</option>
                                    <option value="expense">Expense (-)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <input name="category" defaultValue={editingItem?.category} required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="e.g., Education" />
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors mt-2"
                        >
                            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default Dashboard;