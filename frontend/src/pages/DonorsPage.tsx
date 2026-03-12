import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donorService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/shared/Modal';
import { Edit2, Trash2, UserPlus } from 'lucide-react';

const DonorsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<any>(null);

    // 1. FETCH DONORS
    const { data, isLoading, error } = useQuery({
        queryKey: ['donors'],
        queryFn: donorService.getAll,
    });

    // 2. DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: (id: string) => donorService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donors'] });
        },
    });

    // 3. SAVE (CREATE/UPDATE) MUTATION
    const saveMutation = useMutation({
        mutationFn: (formData: any) =>
            editingDonor
                ? donorService.update(editingDonor._id, formData)
                : donorService.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donors'] });
            setIsModalOpen(false);
            setEditingDonor(null);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        saveMutation.mutate(payload);
    };

    const donors = data?.data || [];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
                        <p className="text-gray-500">Manage and view all contributors to upVIS.</p>
                    </div>
                    <button
                        onClick={() => { setEditingDonor(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                    >
                        <UserPlus size={20} />
                        Add New Donor
                    </button>
                </header>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white animate-pulse rounded-xl border border-gray-100"></div>)}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                        Error loading donors: {(error as any).message}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold uppercase">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {donors.map((donor: any) => (
                                    <tr key={donor._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 font-medium text-gray-900">{donor.name}</td>
                                        <td className="p-4 text-gray-600">{donor.email}</td>
                                        <td className="p-4 text-gray-500">{donor.phone}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => { setEditingDonor(donor); setIsModalOpen(true); }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { if (window.confirm(`Delete ${donor.name}?`)) deleteMutation.mutate(donor._id); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {donors.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-400">
                                            <p className="italic">No donors registered yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- ADD/EDIT DONOR MODAL --- */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingDonor ? "Edit Donor Profile" : "Register New Donor"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                                name="name"
                                defaultValue={editingDonor?.name}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={editingDonor?.email}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input
                                name="phone"
                                defaultValue={editingDonor?.phone}
                                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+63 9XX XXX XXXX"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors mt-2"
                        >
                            {saveMutation.isPending ? 'Saving...' : (editingDonor ? 'Update Donor' : 'Register Donor')}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default DonorsPage;