import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Transaction {
    _id: string;
    date: string | Date;
    description: string;
    category: string;
    type: 'donation' | 'expense';
    amount: number;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

const TransactionTable = ({ transactions, onEdit, onDelete }: TransactionTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                                No transactions found.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((t) => (
                            <tr key={t._id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-medium text-gray-900">{t.description}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 uppercase">
                                        {t.category}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold ${t.type === 'donation' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'donation' ? '+' : '-'} ₱{t.amount.toLocaleString()}
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(t)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Transaction"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(t._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Transaction"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;