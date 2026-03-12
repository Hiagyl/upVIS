import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/shared/Modal';
import { UserPlus, Edit2, Trash2, ShieldCheck, ShieldAlert, Loader2, Search } from 'lucide-react';

const MembersPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. FETCH MEMBERS
    const { data: members, isLoading, error } = useQuery({
        queryKey: ['members'],
        queryFn: memberService.getAll,
    });

    // 2. DELETE MUTATION
    const deleteMutation = useMutation({
        mutationFn: (id: string) => memberService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });

    // 3. SAVE MUTATION (Unified Create/Update)
    const saveMutation = useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: any }) =>
            id ? memberService.update(id, payload) : memberService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            setEditingMember(null);
        },
        onError: (err: any) => {
            // Handle the Duplicate Key error specifically
            const errorMsg = err.response?.data?.error || "";
            if (errorMsg.includes("E11000")) {
                alert("Database Error: A duplicate index (likely memberID or Contact) exists. Please check your database indexes.");
            } else {
                alert("Failed to save member. Please try again.");
            }
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        saveMutation.mutate({ id: editingMember?._id, payload });
    };

    // Filter members based on search bar
    const filteredMembers = members?.filter((m: any) =>
        m.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Members</h1>
                        <p className="text-slate-500">Manage your core team and staff directory.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 bg-white w-64 transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                        >
                            <UserPlus size={20} />
                            Add Member
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-white animate-pulse rounded-2xl border border-slate-100" />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="p-4">Full Name</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Join Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredMembers?.map((member: any) => (
                                    <tr key={member._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 font-bold text-slate-900">{member.fullname}</td>
                                        <td className="p-4 text-sm text-slate-600 font-medium">{member.contactNo}</td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(member.joinDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {member.status === 'active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm("Delete member?")) deleteMutation.mutate(member._id) }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
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
                    title={editingMember ? "Edit Member" : "New Member"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input
                                name="fullname"
                                defaultValue={editingMember?.fullname}
                                required
                                className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact No</label>
                                <input name="contactNo" defaultValue={editingMember?.contactNo} required className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                                <select name="status" defaultValue={editingMember?.status || 'active'} className="w-full border border-slate-200 rounded-xl p-3 outline-none">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Join Date</label>
                            <input
                                name="joinDate"
                                type="date"
                                defaultValue={editingMember?.joinDate ? new Date(editingMember.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                className="w-full border border-slate-200 rounded-xl p-3 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex justify-center items-center gap-2"
                        >
                            {saveMutation.isPending && <Loader2 size={18} className="animate-spin" />}
                            {editingMember ? "Update Profile" : "Register Member"}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default MembersPage;