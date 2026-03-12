import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/shared/Modal';
import { UserPlus, Edit2, Trash2, ShieldCheck, ShieldAlert, Loader2, Search, Users } from 'lucide-react';

const MembersPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: members, isLoading, error } = useQuery({
        queryKey: ['members'],
        queryFn: memberService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => memberService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });

    const saveMutation = useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: any }) =>
            id ? memberService.update(id, payload) : memberService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            setEditingMember(null);
        },
        onError: (err: any) => {
            const errorMsg = err.response?.data?.error || "";
            if (errorMsg.includes("E11000")) {
                alert("Database Error: This Member ID or Contact already exists.");
            } else {
                alert("Failed to save member.");
            }
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        saveMutation.mutate({ id: editingMember?._id, payload });
    };

    const filteredMembers = members?.filter((m: any) =>
        m.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-[#FAF9F6] min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-72 p-12">
                {/* Header Box: Consistent with Transactions */}
                <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
                            <Users size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-1">Organization Roster</h1>
                            <p className="text-lg text-slate-500 font-medium italic">Managing the hands that build our community.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Find a member..."
                                className="pl-12 pr-6 py-4 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 bg-[#FAF9F6] w-80 text-lg shadow-inner transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg active:scale-95"
                        >
                            <UserPlus size={24} strokeWidth={2.5} />
                            Add Member
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border-2 border-slate-50" />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl border-2 border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b-2 border-slate-100">
                                    <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Full Name</th>
                                    <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Contact Details</th>
                                    <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tenure Since</th>
                                    <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Security Status</th>
                                    <th className="p-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-center">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-slate-50">
                                {filteredMembers?.map((member: any) => (
                                    <tr key={member._id} className="hover:bg-amber-50/40 transition-colors group">
                                        <td className="p-8">
                                            <div className="text-2xl font-serif font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                                                {member.fullname}
                                            </div>
                                        </td>
                                        <td className="p-8 text-lg text-slate-600 font-bold font-mono">
                                            {member.contactNo}
                                        </td>
                                        <td className="p-8 text-lg text-slate-500 font-medium font-serif">
                                            {new Date(member.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td className="p-8">
                                            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 ${member.status === 'active'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {member.status === 'active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                                                    className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-200 rounded-xl shadow-sm transition-all"
                                                >
                                                    <Edit2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm("Permanently remove this member?")) deleteMutation.mutate(member._id) }}
                                                    className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-xl shadow-sm transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingMember ? "Amend Member Profile" : "Register New Member"}
                >
                    <form onSubmit={handleSubmit} className="p-2 space-y-6">
                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Full Legal Name</label>
                            <input
                                name="fullname"
                                defaultValue={editingMember?.fullname}
                                required
                                className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl outline-none focus:border-amber-500 bg-slate-50 transition-all font-serif"
                                placeholder="e.g., Juan Dela Cruz"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Primary Contact No.</label>
                                <input name="contactNo" defaultValue={editingMember?.contactNo} required className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl outline-none focus:border-amber-500 bg-slate-50 font-mono" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Access Status</label>
                                <select name="status" defaultValue={editingMember?.status || 'active'} className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl font-bold bg-slate-50 cursor-pointer appearance-none focus:border-amber-500">
                                    <option value="active">Active Member</option>
                                    <option value="inactive">Inactive / Archived</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Official Join Date</label>
                            <input
                                name="joinDate"
                                type="date"
                                defaultValue={editingMember?.joinDate ? new Date(editingMember.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                className="w-full border-2 border-slate-100 rounded-xl p-4 text-xl outline-none focus:border-amber-500 bg-slate-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all shadow-xl flex justify-center items-center gap-3 mt-4"
                        >
                            {saveMutation.isPending && <Loader2 size={24} className="animate-spin" />}
                            {editingMember ? "Confirm Update" : "Confirm Registration"}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default MembersPage;