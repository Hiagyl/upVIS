import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import SummaryCards from '../components/dashboard/SummaryCards';
import TransactionTable from '../components/dashboard/TransactionTable';

const Dashboard = () => {
    // useQuery handles the fetch, the 'loading' state, and the 'error' state
    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions'], // Unique key to cache this specific data
        queryFn: fetchTransactions,
        refetchInterval: 30000,     // Automatically refresh every 30 seconds
    });

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50 ml-64">
            <div className="text-xl font-medium text-slate-600 animate-pulse">
                Updating upVIS Data...
            </div>
        </div>
    );

    if (error) return <div className="ml-64 p-10 text-red-500">Error: {(error as any).message}</div>;

    // result.summary and result.data from your backend structure
    const summary = data?.summary || { totalDonations: 0, totalExpenses: 0, balance: 0 };
    const transactions = data?.data || [];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Real-time financial status</p>
                    </div>
                    <div className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
                        Last synced: {new Date().toLocaleTimeString()}
                    </div>
                </header>

                <SummaryCards summary={summary} />

                <div className="mt-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
                    <TransactionTable transactions={transactions} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;