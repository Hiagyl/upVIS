import React, { useState, useEffect, useCallback } from "react";
import "./globals.css";
import "./distributions.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Distribution {
  _id: string;
  distributionID: string;
  scholar: string;
  type: "Cash" | "Allowance" | "Subsidy";
  amount: number;
  location: string;
  proof: string;
}

type SortField = "id" | "scholar" | "type" | "amount" | "location";
type SortDirection = "asc" | "desc";

const API_URL = "http://localhost:5000/api/distributions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(v: number): string {
  return "₱ " + v.toLocaleString();
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface DistModalProps {
  open: boolean;
  editTarget: Distribution | null;
  onClose: () => void;
  onSave: (data: Omit<Distribution, "_id" | "distributionID"> & { _id?: string }) => Promise<void>;
}

const emptyForm = {
  scholar: "",
  type: "" as Distribution["type"] | "",
  amount: "",
  location: "",
  proof: "",
};

function DistModal({ open, editTarget, onClose, onSave }: DistModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editTarget) {
      setForm({
        scholar: editTarget.scholar,
        type: editTarget.type,
        amount: String(editTarget.amount),
        location: editTarget.location ?? "",
        proof: editTarget.proof ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editTarget, open]);

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      _id: editTarget?._id,
      scholar: form.scholar,
      type: form.type as Distribution["type"],
      amount: Number(form.amount),
      location: form.location,
      proof: form.proof,
    });
  };

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="fd-modal-backdrop" onClick={handleBackdrop}>
      <div className="fd-modal-content fade-in">
        <div className="fd-modal-header">
          <h3>{editTarget ? "Edit Distribution" : "Add New Distribution"}</h3>
          <button className="fd-close" onClick={onClose}>&times;</button>
        </div>

        <form className="fd-modal-body" onSubmit={handleSubmit}>
          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Scholar *</label>
              <input type="text" value={form.scholar} onChange={set("scholar")} required />
            </div>
            <div className="fd-form-group">
              <label>Type *</label>
              <select value={form.type} onChange={set("type")} required>
                <option value="">Select Type</option>
                <option value="Cash">Cash</option>
                <option value="Allowance">Allowance</option>
                <option value="Subsidy">Subsidy</option>
              </select>
            </div>
          </div>

          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Amount *</label>
              <input type="number" value={form.amount} onChange={set("amount")} required />
            </div>
            <div className="fd-form-group">
              <label>Location</label>
              <input type="text" value={form.location} onChange={set("location")} />
            </div>
          </div>

          <div className="fd-form-group">
            <label>Proof (URL)</label>
            <input type="text" value={form.proof} onChange={set("proof")} />
          </div>

          <div className="fd-form-actions">
            <button type="button" className="fd-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="fd-btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Distributions() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Distribution | null>(null);

  // ── API ──────────────────────────────────────────────────────────────────

  const loadDistributions = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Distribution[] = await res.json();
      setDistributions(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load distributions");
    }
  }, []);

  useEffect(() => {
    loadDistributions();
  }, [loadDistributions]);

  const saveDistribution = async (
    data: Omit<Distribution, "_id" | "distributionID"> & { _id?: string }
  ) => {
    try {
      const method = data._id ? "PUT" : "POST";
      const url = data._id ? `${API_URL}/${data._id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      setEditTarget(null);
      loadDistributions();
    } catch (err) {
      console.error(err);
      alert("Failed to save distribution");
    }
  };

  const deleteDist = async (id: string) => {
    if (!confirm("Delete this distribution?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadDistributions();
    } catch (err) {
      console.error(err);
      alert("Failed to delete distribution");
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const filtered = distributions.filter((d) =>
    d.scholar.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "amount") return (a.amount - b.amount) * dir;
    if (sortField === "id") return a.distributionID.localeCompare(b.distributionID) * dir;
    return (a[sortField] ?? "").localeCompare(b[sortField] ?? "") * dir;
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
              placeholder="Search distributions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* CONTENT */}
        <section className="fd-content">
          <div className="fd-section-title">
            <h3>Distributions</h3>
            <button
              className="fd-btn fd-btn-primary"
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
            >
              + Add Distribution
            </button>
          </div>

          {/* SORT CONTROLS */}
          <div className="fd-sort-controls">
            <label><strong>Sort by:</strong></label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}>
              <option value="id">ID</option>
              <option value="scholar">Scholar</option>
              <option value="type">Type</option>
              <option value="amount">Amount</option>
              <option value="location">Location</option>
            </select>
            <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDirection)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="fd-card">
            <table className="fd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Scholar</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Proof</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((d) => (
                  <tr key={d._id} className="fade-in">
                    <td>{d.distributionID}</td>
                    <td>{d.scholar}</td>
                    <td>
                      <span className={`fd-badge fd-badge-${d.type.toLowerCase()}`}>
                        {d.type}
                      </span>
                    </td>
                    <td>{formatMoney(d.amount)}</td>
                    <td>{d.location || "—"}</td>
                    <td>
                      {d.proof
                        ? <a href={d.proof} target="_blank" rel="noreferrer" className="fd-link">View</a>
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="fd-action-btn fd-edit-btn"
                        onClick={() => { setEditTarget(d); setModalOpen(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="fd-action-btn fd-delete-btn"
                        onClick={() => deleteDist(d._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="fd-empty">No distributions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}
      <DistModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={saveDistribution}
      />
    </div>
  );
}
