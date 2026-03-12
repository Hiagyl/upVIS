import React from 'react';

// Define the interface for better TypeScript support
interface Transaction {
    _id: string;
    date: string | Date;
    description: string;
    category: string;
    type: 'donation' | 'expense';
    amount: number;
}

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {/* Handle empty state gracefully */}
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                No transactions found.
                            </td>
                        </tr>
                    ) : (
                        transactions.map((t) => (
                            <tr key={t._id} className="hover:bg-gray-50 transition-colors">
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
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// CRITICAL: Exporting the component so Dashboard.tsx can use it
export default TransactionTable;