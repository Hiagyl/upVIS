import React,{ useState, useEffect, useCallback } from "react";
import "./globals.css";
import "./finance.css"; //css barely applied to the app yet

// ─── Types ───────────────────────────────────────────────────
interface Transaction { 
  _id: string;
  type: "donation" | "expense" | "purchase";
  description: string;
  amount: number;
  date: string;
}

type TransactionForm = {
  type: string;
  description: string;
  amount: string | number;
  date: string;
};

// ─── Constants ──────────────────────────────────────────────
const API = "http://localhost:5000/api/finance";

const NAV_LINKS = [ // no routing yet
  { href: "finance.html",       icon: "D", label: "Dashboard"     },
  { href: "transactions.html",  icon: "T", label: "Transactions"  },
  { href: "distributions.html", icon: "D", label: "Distributions" },
  { href: "scholars.html",      icon: "S", label: "Scholars"      },
  { href: "members.html",       icon: "M", label: "Members"       },
];

const EMPTY_FORM: TransactionForm = { type: "", description: "", amount: "", date: "" };

// ─── Helpers ─────────────────────────────────────────────────
function formatMoney(v: number): string {
  return "₱ " + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(v);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

// ─── Subcomponents ───────────────────────────────────────────

/** Sidebar navigation */
function Sidebar() {
  const current = window.location.pathname.split("/").pop();
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo" />
        <div>
          <h1>UP Vis</h1>
          <div className="sub">Scholar Support and Donation Management System</div>
        </div>
      </div>
      <nav className="nav">
        <h3>Finance</h3>
        {NAV_LINKS.map(({ href, icon, label }) => (
          <a key={href} href={href} className={current === href ? "active" : ""}>
            <span className="icon">{icon}</span>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/** KPI summary cards */
function KpiCards({ records }: { records: Transaction[] }) {
  let donations = 0, expenses = 0;
  records.forEach((r) => {
    if (r.type === "donation") donations += r.amount;
    else expenses += r.amount;
  });

  return (
    <div className="kpis">
      <div className="card gradient">
        <h4>Total Donations</h4>
        <div className="value">{formatMoney(donations)}</div>
      </div>
      <div className="card">
        <h4>Total Expenses</h4>
        <div className="value">{formatMoney(expenses)}</div>
      </div>
      <div className="card">
        <h4>Current Balance</h4>
        <div className="value">{formatMoney(donations - expenses)}</div>
      </div>
    </div>
  );
}

/** Single table row */
function TransactionRow({
  record,
  onEdit,
  onDelete,
}: {
  record: Transaction;
  onEdit: (r: Transaction) => void;
  onDelete: (id: string, type: string) => void;
}) {
  return (
    <tr className="fade-in">
      <td>{record._id}</td>
      <td>
        <span className={`type-badge type-${record.type}`}>{record.type}</span>
      </td>
      <td>{record.description}</td>
      <td className={`amount-${record.type}`}>{formatMoney(record.amount)}</td>
      <td>{formatDate(record.date)}</td>
      <td>
        <button className="action-btn edit-btn"   onClick={() => onEdit(record)}>Edit</button>
        <button className="action-btn delete-btn" onClick={() => onDelete(record._id, record.type)}>Delete</button>
      </td>
    </tr>
  );
}

/** Transactions table with sort controls */
function TransactionsTable({
  records,
  onEdit,
  onDelete,
}: {
  records: Transaction[];
  onEdit: (r: Transaction) => void;
  onDelete: (id: string, type: string) => void;
}) {
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDir,   setSortDir]   = useState<"asc" | "desc">("desc");

  const sorted = [...records].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "amount") return (a.amount - b.amount) * dir;
    if (sortField === "date")   return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    return String(a[sortField]).localeCompare(String(b[sortField])) * dir;
  });

  return (
    <div className="card stack">
      <h3>Recent Transactions</h3>

      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value as keyof Transaction)}>
          <option value="date">Date</option>
          <option value="type">Type</option>
          <option value="description">Description</option>
          <option value="amount">Amount</option>
        </select>
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <table className="table" id="txnTable">
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Description</th>
            <th>Amount</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={6}>No transactions found.</td>
            </tr>
          ) : (
            sorted.map((r) => (
              <TransactionRow
                key={`${r._id}-${r.type}`}
                record={r}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Add / Edit modal */
function RecordModal({
  initial,
  onSave,
  onClose,
}: {
  initial: Transaction | null;
  onSave: (txn: Partial<Transaction>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<TransactionForm>(
    initial ? { ...initial, amount: String(initial.amount), date: initial.date } : EMPTY_FORM
  );
  const isEdit = Boolean(initial?._id);

  const set = (field: keyof TransactionForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.type || !form.amount || !form.date) {
      alert("Please complete all required fields");
      return;
    }
    onSave({
      ...(isEdit && initial ? { _id: initial._id } : {}),
      type:        form.type as Transaction["type"],
      description: form.description,
      amount:      Number(form.amount),
      date:        form.date,
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Record" : "Add New Record"}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select value={form.type} onChange={set("type")} required>
                <option value="">Select Type</option>
                <option value="donation">Donation</option>
                <option value="expense">Expense</option>
                <option value="purchase">Purchase</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount *</label>
              <input type="number" value={form.amount} onChange={set("amount")} required />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <input type="text" value={form.description} onChange={set("description")} required />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input type="date" value={form.date} onChange={set("date")} required />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn-primary"   onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function FinanceDashboard() {
  const [records,       setRecords]       = useState<Transaction[]>([]);
  const [search,        setSearch]        = useState<string>("");
  const [modalOpen,     setModalOpen]     = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<Transaction | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      setRecords(await res.json());
    } catch (err) {
      console.error(err);
      alert("Failed to load transactions");
    }
  }, []);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const handleSave = async (txn: Partial<Transaction>) => {
    try {
      const method = txn._id ? "PUT" : "POST";
      const url    = txn._id ? `${API}/${txn._id}` : API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save transaction");
      }

      setModalOpen(false);
      setEditingRecord(null);
      loadTransactions();
    } catch (err) {
      console.error("Save failed:", err);
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error("Delete failed");
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to delete record");
    }
  };

  const openAdd = () => { setEditingRecord(null); setModalOpen(true); };

  const openEdit = (record: Transaction) => {
    setEditingRecord({ ...record, date: record.date.split("T")[0] });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingRecord(null); };

  const q = search.toLowerCase();
  const filtered = q
    ? records.filter(
        (r) =>
          r._id?.toLowerCase().includes(q) ||
          r.type?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          String(r.amount).includes(q)
      )
    : records;

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <header className="topbar">
          <div className="search-bar">
            <span style={{ color: "#6b7893" }}>🔍</span>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <section className="content">
          <div className="section-title">
            <h3>Finance Dashboard</h3>
            <button className="btn primary" onClick={openAdd}>+ Record</button>
          </div>

          <KpiCards records={filtered} />

          <TransactionsTable
            records={filtered}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      {modalOpen && (
        <RecordModal
          initial={editingRecord}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
