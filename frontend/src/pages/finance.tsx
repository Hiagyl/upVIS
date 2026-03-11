import React, { useState, useEffect, useCallback } from "react";
import "../index.css";
import "./finance.css";

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

const API_URL = "http://localhost:5000/api/finance";

const EMPTY_FORM: TransactionForm = {
  type: "",
  description: "",
  amount: "",
  date: "",
};

function formatMoney(v: number) {
  return "₱ " + new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
  }).format(v);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

export default function FinanceDashboard() {
  const [records, setRecords] = useState<Transaction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Transaction | null>(null);

  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const loadTransactions = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      setRecords(await res.json());
    } catch {
      console.error("Backend not running.");
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // CRUD
  const handleSave = async (txn: Partial<Transaction>) => {
    const method = txn._id ? "PUT" : "POST";
    const url = txn._id ? `${API_URL}/${txn._id}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txn),
    });

    setModalOpen(false);
    setEditingRecord(null);
    loadTransactions();
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Delete this transaction?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    loadTransactions();
  };

  const openAdd = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const openEdit = (r: Transaction) => {
    setEditingRecord({ ...r, date: r.date.split("T")[0] });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  // sorting
  const sorted = [...records].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    if (sortField === "amount") return (a.amount - b.amount) * dir;
    if (sortField === "date")
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;

    return String(a[sortField]).localeCompare(String(b[sortField])) * dir;
  });

  // KPI
  let donations = 0;
  let expenses = 0;

  records.forEach((r) => {
    if (r.type === "donation") donations += r.amount;
    else expenses += r.amount;
  });

  return (
    <div className="fd-content">

      <div className="fd-section-title">
        <h3>Finance Dashboard</h3>

        <button className="fd-btn fd-btn-primary" onClick={openAdd}>
          + Record
        </button>
      </div>

      {/* KPI */}
      <div className="fd-kpis">
        <div className="fd-card fd-gradient">
          <h4>Total Donations</h4>
          <div className="fd-value">{formatMoney(donations)}</div>
        </div>

        <div className="fd-card">
          <h4>Total Expenses</h4>
          <div className="fd-value">{formatMoney(expenses)}</div>
        </div>

        <div className="fd-card">
          <h4>Current Balance</h4>
          <div className="fd-value">{formatMoney(donations - expenses)}</div>
        </div>
      </div>

      {/* TABLE */}
      <div className="fd-card fd-stack">
        <h3>Recent Transactions</h3>

        <div className="fd-sort-controls">
          <label>Sort by:</label>

          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as keyof Transaction)
            }
          >
            <option value="date">Date</option>
            <option value="type">Type</option>
            <option value="description">Description</option>
            <option value="amount">Amount</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

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
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="fd-empty">
                  No transactions found.
                </td>
              </tr>
            )}

            {sorted.map((r) => (
              <tr key={r._id} className="fade-in">
                <td>{r._id}</td>

                <td>
                  <span className={`fd-badge fd-badge-${r.type}`}>
                    {r.type}
                  </span>
                </td>

                <td>{r.description}</td>

                <td>{formatMoney(r.amount)}</td>

                <td>{formatDate(r.date)}</td>

                <td>
                  <button
                    className="fd-action-btn fd-edit-btn"
                    onClick={() => openEdit(r)}
                  >
                    Edit
                  </button>

                  <button
                    className="fd-action-btn fd-delete-btn"
                    onClick={() => handleDelete(r._id, r.type)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    initial
      ? { ...initial, amount: String(initial.amount), date: initial.date }
      : EMPTY_FORM
  );

  const isEdit = Boolean(initial?._id);

  const set =
    (field: keyof TransactionForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = () => {
    onSave({
      ...(isEdit && initial ? { _id: initial._id } : {}),
      type: form.type as Transaction["type"],
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
    });
  };

  return (
    <div className="fd-modal-backdrop">
      <div className="fd-modal-content">

        <div className="fd-modal-header">
          <h3>{isEdit ? "Edit Record" : "Add Record"}</h3>
          <button className="fd-close" onClick={onClose}>×</button>
        </div>

        <div className="fd-modal-body">

          <div className="fd-form-row">

            <div className="fd-form-group">
              <label>Type</label>
              <select value={form.type} onChange={set("type")}>
                <option value="">Select</option>
                <option value="donation">Donation</option>
                <option value="expense">Expense</option>
                <option value="purchase">Purchase</option>
              </select>
            </div>

            <div className="fd-form-group">
              <label>Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={set("amount")}
              />
            </div>

          </div>

          <div className="fd-form-group">
            <label>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="fd-form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set("date")} />
          </div>

          <div className="fd-form-actions">
            <button className="fd-btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="fd-btn-primary" onClick={submit}>
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}