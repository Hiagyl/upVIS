import React, { useState, useEffect, useCallback } from "react";
import "./globals.css";
import "./Transactions.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = "donation" | "expense" | "purchase";
type SortField = "date" | "type" | "amount";
type SortDirection = "asc" | "desc";

interface BaseTransaction {
  _id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description?: string;
  remarks?: string;
}

interface DonationTransaction extends BaseTransaction {
  type: "donation";
  donorID: string;
  mode: string;
  dateReceived?: string;
}

interface ExpenseTransaction extends BaseTransaction {
  type: "expense";
  responsibleID: string;
  expenseType: string;
}

interface PurchaseTransaction extends BaseTransaction {
  type: "purchase";
  responsibleID: string;
  paymentMode: string;
  receiptNumber?: string;
}

type Transaction = DonationTransaction | ExpenseTransaction | PurchaseTransaction;

const API_URLS = {
  Donations: "http://localhost:5000/api/donations",
  Expenses: "http://localhost:5000/api/expenses",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(v: number) {
  return "₱ " + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(v);
}

function formatDate(s: string): string {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s.includes("T")) return s.split("T")[0];
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Empty form state ─────────────────────────────────────────────────────────

const emptyForm = {
  type: "" as TransactionType | "",
  amount: "",
  date: "",
  remarks: "",
  // donation
  donorID: "",
  paymentMode: "cash",
  donationDesc: "",
  // expense
  responsibleID: "",
  expenseType: "operational",
  expenseDesc: "",
  // purchase
  purchaseResponsibleID: "",
  purchasePaymentMode: "cash",
  purchaseDesc: "",
  receiptNumber: "",
};

// ─── Modal ────────────────────────────────────────────────────────────────────

interface TransModalProps {
  open: boolean;
  editTarget: Transaction | null;
  onClose: () => void;
  onSave: (type: TransactionType, data: Record<string, unknown>, id?: string) => Promise<void>;
}

function TransModal({ open, editTarget, onClose, onSave }: TransModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editTarget) {
      const base = {
        ...emptyForm,
        type: editTarget.type,
        amount: String(editTarget.amount),
        date: formatDate(editTarget.date),
        remarks: editTarget.remarks ?? "",
      };

      if (editTarget.type === "donation") {
        const d = editTarget as DonationTransaction;
        setForm({ ...base, donorID: d.donorID ?? "", paymentMode: d.mode ?? "cash", donationDesc: d.description ?? "" });
      } else if (editTarget.type === "expense") {
        const e = editTarget as ExpenseTransaction;
        setForm({ ...base, responsibleID: e.responsibleID ?? "", expenseType: e.expenseType ?? "operational", expenseDesc: e.description ?? "" });
      } else {
        const p = editTarget as PurchaseTransaction;
        setForm({ ...base, purchaseResponsibleID: p.responsibleID ?? "", purchasePaymentMode: p.paymentMode ?? "cash", purchaseDesc: p.description ?? "", receiptNumber: p.receiptNumber ?? "" });
      }
    } else {
      setForm(emptyForm);
    }
  }, [editTarget, open]);

  if (!open) return null;

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = form.type as TransactionType;
    if (!type) { alert("Please select a transaction type"); return; }
    if (!form.amount || Number(form.amount) <= 0) { alert("Please enter a valid amount"); return; }
    if (!form.date) { alert("Please select a date"); return; }

    let data: Record<string, unknown> = {};

    if (type === "donation") {
      if (!form.donorID) { alert("Please enter Donor ID"); return; }
      data = { donorID: form.donorID, amount: Number(form.amount), dateReceived: form.date, date: form.date, mode: form.paymentMode, remarks: form.remarks, description: form.donationDesc, type: "donation" };
    } else if (type === "expense") {
      if (!form.responsibleID) { alert("Please enter Responsible Member ID"); return; }
      if (!form.expenseDesc) { alert("Please enter expense description"); return; }
      data = { amount: Number(form.amount), date: form.date, responsibleID: form.responsibleID, remarks: form.remarks, type: form.expenseType, description: form.expenseDesc };
    } else {
      if (!form.purchaseResponsibleID) { alert("Please enter Responsible Member ID"); return; }
      if (!form.purchaseDesc) { alert("Please enter purchase description"); return; }
      data = { amount: Number(form.amount), date: form.date, responsibleID: form.purchaseResponsibleID, remarks: form.remarks, description: form.purchaseDesc, paymentMode: form.purchasePaymentMode, receiptNumber: form.receiptNumber, type: "purchase" };
    }

    await onSave(type, data, editTarget?._id);
  };

  const showDonation = form.type === "donation";
  const showExpense = form.type === "expense";
  const showPurchase = form.type === "purchase";
  const showReceipt = showDonation || showExpense || showPurchase;

  return (
    <div className="fd-modal-backdrop" onClick={handleBackdrop}>
      <div className="fd-modal-content fade-in">
        <div className="fd-modal-header">
          <h3>{editTarget ? "Edit Transaction" : "Add New Transaction"}</h3>
          <button className="fd-close" onClick={onClose}>&times;</button>
        </div>

        <form className="fd-modal-body" onSubmit={handleSubmit}>
          {/* Common top row */}
          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Type *</label>
              <select value={form.type} onChange={set("type")} required>
                <option value="">Select Type</option>
                <option value="donation">Donation</option>
                <option value="expense">Expense</option>
                <option value="purchase">Purchase</option>
              </select>
            </div>
            <div className="fd-form-group">
              <label>Amount *</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={set("amount")} required />
            </div>
          </div>

          {/* Donation Fields */}
          {showDonation && (
            <>
              <div className="fd-form-row">
                <div className="fd-form-group">
                  <label>Donor ID *</label>
                  <input type="text" placeholder="e.g., DON-001" value={form.donorID} onChange={set("donorID")} />
                </div>
                <div className="fd-form-group">
                  <label>Payment Mode *</label>
                  <select value={form.paymentMode} onChange={set("paymentMode")}>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="gcash">GCash</option>
                    <option value="paymaya">PayMaya</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="fd-form-group">
                <label>Description</label>
                <input type="text" placeholder="Optional donation description" value={form.donationDesc} onChange={set("donationDesc")} />
              </div>
            </>
          )}

          {/* Expense Fields */}
          {showExpense && (
            <>
              <div className="fd-form-row">
                <div className="fd-form-group">
                  <label>Responsible Member ID *</label>
                  <input type="text" placeholder="e.g., MEM-001" value={form.responsibleID} onChange={set("responsibleID")} />
                </div>
                <div className="fd-form-group">
                  <label>Expense Type</label>
                  <select value={form.expenseType} onChange={set("expenseType")}>
                    <option value="operational">Operational</option>
                    <option value="event">Event</option>
                    <option value="administrative">Administrative</option>
                    <option value="scholar_support">Scholar Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="fd-form-group">
                <label>Description *</label>
                <input type="text" placeholder="What was this expense for?" value={form.expenseDesc} onChange={set("expenseDesc")} />
              </div>
            </>
          )}

          {/* Purchase Fields */}
          {showPurchase && (
            <>
              <div className="fd-form-row">
                <div className="fd-form-group">
                  <label>Responsible Member ID *</label>
                  <input type="text" placeholder="e.g., MEM-001" value={form.purchaseResponsibleID} onChange={set("purchaseResponsibleID")} />
                </div>
                <div className="fd-form-group">
                  <label>Payment Mode</label>
                  <select value={form.purchasePaymentMode} onChange={set("purchasePaymentMode")}>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="gcash">GCash</option>
                  </select>
                </div>
              </div>
              <div className="fd-form-group">
                <label>Description *</label>
                <input type="text" placeholder="What was purchased?" value={form.purchaseDesc} onChange={set("purchaseDesc")} />
              </div>
              <div className="fd-form-group">
                <label>Receipt Number (Optional)</label>
                <input type="text" placeholder="Receipt number if available" value={form.receiptNumber} onChange={set("receiptNumber")} />
              </div>
            </>
          )}

          {/* Common bottom row */}
          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Date *</label>
              <input type="date" value={form.date} onChange={set("date")} required />
            </div>
            <div className="fd-form-group">
              <label>Remarks (Optional)</label>
              <input type="text" placeholder="Additional notes" value={form.remarks} onChange={set("remarks")} />
            </div>
          </div>

          {/* Receipt placeholder */}
          {showReceipt && (
            <div className="fd-form-group">
              <label>Receipt Upload</label>
              <div className="tr-receipt-placeholder">
                <div className="tr-receipt-icon">📤</div>
                <h4>Coming Soon!</h4>
                <p>Receipt upload feature is under development</p>
              </div>
              <small className="tr-receipt-note">⚠️ Please keep physical/digital receipts for now</small>
            </div>
          )}

          <div className="fd-form-actions">
            <button type="button" className="fd-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="fd-btn-primary">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);

  // ── API ──────────────────────────────────────────────────────────────────

  const fetchTransactions = useCallback(async (): Promise<Transaction[]> => {
    const [donRes, expRes] = await Promise.all([
      fetch(API_URLS.Donations),
      fetch(API_URLS.Expenses),
    ]);
    if (!donRes.ok) throw new Error("Failed to fetch donations");
    if (!expRes.ok) throw new Error("Failed to fetch expenses");

    const donations: DonationTransaction[] = (await donRes.json()).map(
      (d: DonationTransaction) => ({ ...d, type: "donation" as const, date: d.date ?? d.dateReceived })
    );
    const expenses: (ExpenseTransaction | PurchaseTransaction)[] = (await expRes.json()).map(
      (e: ExpenseTransaction & { type?: string }) => ({ ...e, type: (e.type ?? "expense") as TransactionType })
    );

    return [...donations, ...expenses];
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load transactions");
    }
  }, [fetchTransactions]);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const saveTransaction = async (type: TransactionType, data: Record<string, unknown>, id?: string) => {
    try {
      const apiUrl = type === "donation" ? API_URLS.Donations : API_URLS.Expenses;
      const method = id ? "PUT" : "POST";
      const url = id ? `${apiUrl}/${id}` : apiUrl;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setModalOpen(false);
      setEditTarget(null);
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  };

  const deleteTransaction = async (id: string, type: TransactionType) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    const apiUrl = type === "donation" ? API_URLS.Donations : API_URLS.Expenses;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      t._id?.toLowerCase().includes(q) ||
      t.type?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      String(t.amount).includes(q) ||
      t.date?.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "amount") return (a.amount - b.amount) * dir;
    if (sortField === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    return a.type.localeCompare(b.type) * dir;
  });

  // ── Nav ───────────────────────────────────────────────────────────────────

  const navLinks = [
    { href: "finance.html", label: "Dashboard", icon: "D" },
    { href: "transactions.html", label: "Transactions", icon: "T" },
    { href: "distributions.html", label: "Distributions", icon: "D" },
    { href: "scholars.html", label: "Scholars", icon: "S" },
    { href: "members.html", label: "Members", icon: "M" },
  ];

  const currentPage =
    typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fd-app">
      {/* SIDEBAR */}
      <aside className="fd-sidebar">
        <div className="fd-brand">
          <div className="fd-logo" />
          <div>
            <h1>UP Vis</h1>
            <div className="fd-sub">Scholar Support and Donation Management System</div>
          </div>
        </div>
        <nav className="fd-nav">
          <h3>Finance</h3>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={l.href === currentPage ? "active" : ""}>
              <span className="fd-icon">{l.icon}</span> {l.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="fd-main">
        {/* TOPBAR */}
        <header className="fd-topbar">
          <div className="fd-search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* CONTENT */}
        <section className="fd-content">
          <div className="fd-section-title">
            <h3>Transactions</h3>
            <button
              className="fd-btn fd-btn-primary"
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
            >
              + Add Transaction
            </button>
          </div>

          {/* SORT CONTROLS */}
          <div className="fd-sort-controls">
            <label><strong>Sort by:</strong></label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}>
              <option value="date">Date</option>
              <option value="type">Type</option>
              <option value="amount">Amount</option>
            </select>
            <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDirection)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="fd-card">
            <table className="fd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <tr key={t._id} className="fade-in">
                    <td>{t._id}</td>
                    <td>
                      <span className={`fd-badge fd-badge-${t.type}`}>{t.type}</span>
                    </td>
                    <td>{t.description || "—"}</td>
                    <td>{formatMoney(t.amount ?? 0)}</td>
                    <td>{t.date ? new Date(t.date).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <button
                        className="fd-action-btn fd-edit-btn"
                        onClick={() => { setEditTarget(t); setModalOpen(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="fd-action-btn fd-delete-btn"
                        onClick={() => deleteTransaction(t._id, t.type)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="fd-empty">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}
      <TransModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={saveTransaction}
      />
    </div>
  );
}
