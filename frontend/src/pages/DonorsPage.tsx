import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donorService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/shared/Modal';
import { Edit2, Trash2, UserPlus, Heart, Mail, Phone } from 'lucide-react';

const DonorsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<any>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['donors'],
        queryFn: donorService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => donorService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donors'] });
        },
    });

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
        <div className="flex bg-[#FAF9F6] min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-72 p-12">

                {/* Header: High Contrast with Warm Accents */}
                <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
                    <div>
                        <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-2">
                            The Donors of upVIS
                        </h1>
                        <p className="text-lg text-slate-500 font-medium font-serif italic">
                            Honoring those whose generosity lights the path.
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingDonor(null); setIsModalOpen(true); }}
                        className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
                    >
                        <UserPlus size={24} strokeWidth={3} />
                        Add New Donor
                    </button>
                </header>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border-2 border-amber-50"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-800 p-6 rounded-xl border-2 border-red-200 text-lg font-bold">
                        Error accessing the registry: {(error as any).message}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900 text-slate-100 text-sm font-black uppercase tracking-widest">
                                <tr>
                                    <th className="p-6 border-b-2 border-slate-800">Donor Name</th>
                                    <th className="p-6 border-b-2 border-slate-800">Contact Information</th>
                                    <th className="p-6 border-b-2 border-slate-800 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-slate-100">
                                {donors.map((donor: any) => (
                                    <tr key={donor._id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-amber-100 rounded-full text-amber-700">
                                                    <Heart size={20} fill="currentColor" />
                                                </div>
                                                <span className="text-xl font-bold text-slate-900 font-serif">
                                                    {donor.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                    <Mail size={16} className="text-slate-400" />
                                                    <span className="text-base">{donor.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                    <Phone size={16} className="text-slate-400" />
                                                    <span className="text-sm">{donor.phone || "No phone listed"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    onClick={() => { setEditingDonor(donor); setIsModalOpen(true); }}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-xl hover:bg-white hover:border-amber-500 transition-all font-bold"
                                                >
                                                    <Edit2 size={18} />
                                                    <span>Edit Profile</span>
                                                </button>
                                                <button
                                                    onClick={() => { if (window.confirm(`Permanently remove ${donor.name}?`)) deleteMutation.mutate(donor._id); }}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border-2 border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold"
                                                >
                                                    <Trash2 size={18} />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {donors.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center">
                                            <p className="text-2xl font-serif italic text-slate-400">
                                                The registry of donors is currently empty.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- REGISTRATION MODAL --- */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingDonor ? "Update Profile" : "Register New Donor"}
                >
                    <form onSubmit={handleSubmit} className="p-2 space-y-6">
                        <div>
                            <label className="block text-lg font-bold text-slate-800 mb-2">Full Name</label>
                            <input
                                name="name"
                                defaultValue={editingDonor?.name}
                                required
                                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none"
                                placeholder="e.g., Augustus Caesar"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-slate-800 mb-2">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={editingDonor?.email}
                                required
                                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none"
                                placeholder="augustus@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-slate-800 mb-2">Phone Number</label>
                            <input
                                name="phone"
                                defaultValue={editingDonor?.phone}
                                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none"
                                placeholder="+63 9XX XXX XXXX"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all mt-4 shadow-xl"
                        >
                            {saveMutation.isPending ? 'Loading...' : (editingDonor ? 'Update Profile' : 'Register Donor')}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default DonorsPage;