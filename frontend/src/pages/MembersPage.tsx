import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/shared/Modal';
import { UserPlus, Edit2, Trash2, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

const MembersPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);

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

    // 3. SAVE MUTATION (Unified for Create and Update)
    const saveMutation = useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: any }) =>
            id
                ? memberService.update(id, payload)
                : memberService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setIsModalOpen(false);
            setEditingMember(null);
        },
        onError: (err: any) => {
            console.error("Save Error:", err);
            alert("Failed to save member. Please check backend console.");
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);

        // Trigger the mutation with the current editing ID if it exists
        saveMutation.mutate({
            id: editingMember?._id,
            payload
        });
    };

    // Helper to format date for input field (YYYY-MM-DD)
    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return new Date().toISOString().split('T')[0];
        return new Date(dateString).toISOString().split('T')[0];
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Members</h1>
                        <p className="text-slate-500">Manage your core team and staff directory.</p>
                    </div>
                    <button
                        onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                        <UserPlus size={20} />
                        Add Member
                    </button>
                </header>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 bg-white animate-pulse rounded-xl border border-slate-100"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                        Failed to load member directory.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="p-4">Full Name</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Join Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {members?.map((member: any) => (
                                    <tr key={member._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-900">{member.fullname}</td>
                                        <td className="p-4 text-sm text-slate-600">{member.contactNo}</td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(member.joinDate).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <div className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${member.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {member.status === 'active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                                {member.status}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { if (window.confirm(`Remove ${member.fullname}?`)) deleteMutation.mutate(member._id); }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    disabled={deleteMutation.isPending}
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
                    onClose={() => { setIsModalOpen(false); setEditingMember(null); }}
                    title={editingMember ? "Edit Member Profile" : "Register New Member"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-tight">Full Name</label>
                                <input
                                    name="fullname"
                                    defaultValue={editingMember?.fullname}
                                    required
                                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-tight">Contact No</label>
                                    <input
                                        name="contactNo"
                                        defaultValue={editingMember?.contactNo}
                                        required
                                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-tight">Status</label>
                                    <select
                                        name="status"
                                        defaultValue={editingMember?.status || 'active'}
                                        className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-tight">Join Date</label>
                                <input
                                    name="joinDate"
                                    type="date"
                                    defaultValue={formatDateForInput(editingMember?.joinDate)}
                                    required
                                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all mt-4 flex justify-center items-center gap-2"
                        >
                            {saveMutation.isPending && <Loader2 size={18} className="animate-spin" />}
                            {saveMutation.isPending ? 'Processing...' : (editingMember ? 'Update Profile' : 'Register Member')}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default MembersPage;