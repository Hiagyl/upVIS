import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scholarService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/shared/Modal';
import { GraduationCap, Edit2, Trash2, UserPlus } from 'lucide-react';

const ScholarsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScholar, setEditingScholar] = useState<any>(null);

    // 1. Fetch Scholars
    const { data, isLoading, error } = useQuery({
        queryKey: ['scholars'],
        queryFn: scholarService.getAll,
    });

    // 2. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => scholarService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scholars'] }),
    });

    // 3. Save Mutation (Create/Update)
    const saveMutation = useMutation({
        mutationFn: (formData: any) =>
            editingScholar
                ? scholarService.update(editingScholar._id, formData)
                : scholarService.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scholars'] });
            setIsModalOpen(false);
            setEditingScholar(null);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);
        saveMutation.mutate(payload);
    };

    const scholars = data?.data || [];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Scholar Directory</h1>
                        <p className="text-gray-500">Manage student profiles and graduation status.</p>
                    </div>
                    <button
                        onClick={() => { setEditingScholar(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <UserPlus size={20} />
                        Add Scholar
                    </button>
                </header>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white animate-pulse rounded-xl border border-gray-100"></div>)}
                    </div>
                ) : error ? (
                    <div className="text-red-500">Error loading scholars: {(error as any).message}</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Student Info</th>
                                    <th className="p-4">Program</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Start Date</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {scholars.map((scholar: any) => (
                                    <tr key={scholar._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{scholar.name}</div>
                                            <div className="text-xs text-gray-500">{scholar.studentNumber}</div>
                                            <div className="text-xs text-indigo-600">{scholar.upMail}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 font-medium">{scholar.program}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${scholar.status === 'Student' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {scholar.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(scholar.scholarshipStartDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => { setEditingScholar(scholar); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600"><Edit2 size={18} /></button>
                                                <button onClick={() => { if (window.confirm('Delete scholar?')) deleteMutation.mutate(scholar._id); }} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingScholar ? "Edit Scholar" : "New Scholar Profile"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input name="name" defaultValue={editingScholar?.name} required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Student Number</label>
                                <input name="studentNumber" defaultValue={editingScholar?.studentNumber} required className="w-full border rounded-lg p-2.5 outline-none" placeholder="20XX-XXXXX" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">UP Mail</label>
                                <input name="upMail" type="email" defaultValue={editingScholar?.upMail} required className="w-full border rounded-lg p-2.5 outline-none" placeholder="@up.edu.ph" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Program</label>
                                <input name="program" defaultValue={editingScholar?.program} required className="w-full border rounded-lg p-2.5 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                <select name="status" defaultValue={editingScholar?.status || "Student"} className="w-full border rounded-lg p-2.5">
                                    <option value="Student">Student</option>
                                    <option value="Graduated">Graduated</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                <input name="scholarshipStartDate" type="date" defaultValue={editingScholar?.scholarshipStartDate ? new Date(editingScholar.scholarshipStartDate).toISOString().split('T')[0] : ""} required className="w-full border rounded-lg p-2.5 outline-none" />
                            </div>
                        </div>
                        <button type="submit" disabled={saveMutation.isPending} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 mt-2">
                            {saveMutation.isPending ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </Modal>
            </main>
        </div>
    );
};

export default ScholarsPage;