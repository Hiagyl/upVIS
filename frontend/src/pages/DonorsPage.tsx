import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { donorService, transactionService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Modal from "../components/shared/Modal";
import { reportService } from "../services/api";
import {
  Edit2,
  Trash2,
  UserPlus,
  Heart,
  Mail,
  Phone,
  History,
  Users,
  Receipt,
  FileText,
} from "lucide-react";

const DonorsPage = () => {
  const queryClient = useQueryClient();

  // Donor modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);

  // Donation modal state
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["donors"],
    queryFn: donorService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => donorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: (formData: any) =>
      editingDonor
        ? donorService.update(editingDonor._id, formData)
        : donorService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      setIsModalOpen(false);
      setEditingDonor(null);
    },
  });

  const donationMutation = useMutation({
    mutationFn: (formData: any) => transactionService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      setIsDonationModalOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);
    saveMutation.mutate(payload);
  };

  const handleDonationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const donorName = formData.get("donor") as string;
    const matchedDonor = donors.find(
      (d: any) => d.name.toLowerCase() === donorName.toLowerCase()
    );

    const payload = {
      description: formData.get("description"),
      amount: Number(formData.get("amount")),
      category: formData.get("category"),
      type: "donation",
      date: new Date().toISOString(),
      donorInfo: {
        name: matchedDonor?.name || donorName,
        email: matchedDonor?.email || "",
      },
    };

    donationMutation.mutate(payload);
  };

  const donors = data?.data || [];

  return (
    <div className="flex bg-[#FAF9F6] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12 flex justify-between items-center bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-900 rounded-2xl text-amber-400 shadow-xl">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight mb-1">
                Donors
              </h1>
              <p className="text-lg text-slate-500 font-medium italic font-serif">
                Tracking the generosity that powers our programs.
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => reportService.downloadMonthlyReport()}
              className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              <FileText size={24} strokeWidth={3} />
              Generate Report
            </button>
            <button
              onClick={() => {
                setEditingDonor(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              <UserPlus size={24} strokeWidth={3} />
              Add Donor
            </button>
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className="flex items-center gap-3 bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              <Receipt size={24} strokeWidth={3} />
              Add Donation
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white animate-pulse rounded-2xl border-2 border-amber-50"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-xl border-2 border-red-200 text-lg font-bold">
            Error accessing the registry: {(error as any).message}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-slate-100 text-sm font-black uppercase tracking-widest">
                <tr>
                  <th className="p-6 border-b-2 border-slate-800">Donor Name</th>
                  <th className="p-6 border-b-2 border-slate-800">Contact Information</th>
                  <th className="p-6 border-b-2 border-slate-800">Total Donations</th>
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
                          <span className="text-sm">
                            {donor.phone || "No phone listed"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xl font-bold text-slate-900">
                        ₱{donor.totalDonations?.toLocaleString() ?? 0}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setEditingDonor(donor);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-xl hover:bg-white hover:border-amber-500 transition-all font-bold"
                        >
                          <Edit2 size={18} />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently remove ${donor.name}?`))
                              deleteMutation.mutate(donor._id);
                          }}
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
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <History size={48} strokeWidth={1.5} className="opacity-20" />
                        <p className="text-xl font-medium italic font-serif text-slate-500">
                          The donor directory is currently empty.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <div className="p-6 bg-slate-50 border-t-2 border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                          upVIS
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 italic font-serif">
                        "Behold the light that leads the way."
                      </p>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* --- DONOR REGISTRATION MODAL --- */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingDonor ? "Update Profile" : "Register New Donor"}
        >
          <form onSubmit={handleSubmit} className="p-2 space-y-6">
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Full Name
              </label>
              <input
                name="name"
                defaultValue={editingDonor?.name}
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none"
                placeholder="e.g., Augustus Caesar"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Email Address
              </label>
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
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Phone Number
              </label>
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
              {saveMutation.isPending
                ? "Loading..."
                : editingDonor
                  ? "Update Profile"
                  : "Register Donor"}
            </button>
          </form>
        </Modal>

        {/* --- ADD DONATION MODAL --- */}
        <Modal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
          title="Record New Donation"
        >
          <form onSubmit={handleDonationSubmit} className="p-2 space-y-6">
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Description of Event
              </label>
              <input
                name="description"
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl focus:border-amber-500 outline-none transition-colors"
                placeholder="e.g., Semester Tuition Grant"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">
                  Amount (₱)
                </label>
                <input
                  name="amount"
                  type="number"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-800 mb-2">
                  Entry Type
                </label>
                <div className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed select-none">
                  Donation (Increase)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Donor Name
              </label>
              <input
                list="donors-list"
                name="donor"
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="Start typing to search..."
              />
              <datalist id="donors-list">
                {donors.map((d: any) => (
                  <option key={d._id} value={d.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-lg font-bold text-slate-800 mb-2">
                Allocation Category
              </label>
              <input
                name="category"
                required
                className="w-full border-2 border-slate-200 rounded-xl p-4 text-xl outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g., Medical Assistance"
              />
            </div>

            <button
              type="submit"
              disabled={donationMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-xl text-xl font-black hover:bg-amber-600 disabled:bg-slate-300 transition-all mt-4 shadow-xl"
            >
              {donationMutation.isPending ? "Recording..." : "Add Donation"}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default DonorsPage;