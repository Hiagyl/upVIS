import {
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  History,
} from "lucide-react";

interface Transaction {
  _id: string;
  date: string | Date;
  description: string;
  category: string;
  type: "donation" | "expense";
  amount: number;
  attachmentUrl?: string;
  donorInfo?: {
    donorId: string;
    name: string;
    email: string;
  };
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable = ({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        {/* High Contrast Header: Dark slate with bold white/gray text */}
        <thead className="bg-slate-900 text-slate-100 text-sm font-bold uppercase tracking-wide">
          <tr>
            <th className="p-6 border-b-2 border-slate-800">Date</th>
            <th className="p-6 border-b-2 border-slate-800">Description</th>
            <th className="p-6 border-b-2 border-slate-800">Category</th>
            <th className="p-6 border-b-2 border-slate-800">Donor</th>
            <th className="p-6 border-b-2 border-slate-800 text-right">
              Amount
            </th>
            <th className="p-6 border-b-2 border-slate-800 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-slate-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-20 text-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                  <History size={48} strokeWidth={1.5} className="opacity-20" />
                  <p className="text-xl font-medium italic font-serif text-slate-500">
                    The ledger is currently empty.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                {/* Date: Increased size and switched to high-contrast black */}
                <td className="p-6">
                  <span className="text-base font-bold text-slate-900">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </td>

                {/* Description with Visual Indicator */}
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-full border-2 ${
                        t.type === "donation"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {t.type === "donation" ? (
                        <ArrowUpRight size={20} />
                      ) : (
                        <ArrowDownLeft size={20} />
                      )}
                    </div>
                    <span className="text-lg font-bold text-slate-900 font-serif">
                      {t.description}
                    </span>
                  </div>
                </td>

                {/* Category: Clearer, high-contrast badges */}
                <td className="p-6">
                  <span className="px-4 py-1.5 text-xs font-black rounded-full bg-slate-100 text-slate-700 border-2 border-slate-200 uppercase tracking-wider">
                    {t.category}
                  </span>
                </td>

<td className="p-6">
  <span className="text-slate-700 font-semibold">
    {t.type === "donation" ? t.donorInfo?.name || "Anonymous" : "-"}
  </span>
</td>
                {/* Amount: Very large and bold for poor eyesight */}
                <td
                  className={`p-6 text-right font-black text-2xl tracking-tight ${
                    t.type === "donation" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {t.type === "donation" ? "+" : "-"} ₱
                  {t.amount.toLocaleString()}
                </td>

                {/* Actions: Persistent buttons (no more hover dependency) */}
                <td className="p-6">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => onEdit(t)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 border-2 border-slate-200 rounded-lg hover:bg-white hover:border-amber-500 transition-all font-bold text-sm"
                      aria-label="Edit Entry"
                    >
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(t._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border-2 border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                      aria-label="Delete Entry"
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Accessible Footer */}
      <div className="p-6 bg-slate-50 border-t-2 border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            upVIS
          </p>
        </div>
        <p className="text-xs text-slate-400 italic font-serif">
          "From a little spark may burst a flame."
        </p>
      </div>
    </div>
  );
};

export default TransactionTable;
