import React, { useState, useEffect, useCallback } from "react";
import "./globals.css";
import "./Scholars.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scholar {
  _id: string;
  scholarID: string;
  fullname: string;
  email: string;
  contactNo: string;
  picture: string;
  degreeProgram: string;
  yearLevel: number;
  status: "active" | "graduate" | "inactive";
  dateAdded: string;
}

type SortField = "name" | "id" | "program" | "yearLevel" | "status";
type SortDirection = "asc" | "desc";

const API_URL = "http://localhost:5000/api/scholars";

const YEAR_LABELS = ["", "1st", "2nd", "3rd", "4th", "5th"];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ src, name }: { src?: string; name: string }) {
  if (src) return <img src={src} alt={name} className="sc-avatar-img" />;
  return (
    <div className="sc-avatar-placeholder">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

interface ScholarModalProps {
  open: boolean;
  editTarget: Scholar | null;
  onClose: () => void;
  onSave: (data: Omit<Scholar, "_id" | "dateAdded"> & { _id?: string }) => Promise<void>;
}

const emptyForm = {
  scholarID: "",
  fullname: "",
  email: "",
  contactNo: "",
  picture: "",
  degreeProgram: "",
  yearLevel: "",
  status: "active" as Scholar["status"],
};

const PROGRAMS = [
  "BS Computer Science",
  "BS Information Technology",
  "BS Biology",
  "BS Chemistry",
  "BS Mathematics",
  "BA Communication Arts",
  "BA Psychology",
  "BS Business Administration",
  "BS Accountancy",
  "BS Nursing",
];

function ScholarModal({ open, editTarget, onClose, onSave }: ScholarModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editTarget) {
      setForm({
        scholarID: editTarget.scholarID ?? "",
        fullname: editTarget.fullname,
        email: editTarget.email ?? "",
        contactNo: editTarget.contactNo,
        picture: editTarget.picture ?? "",
        degreeProgram: editTarget.degreeProgram,
        yearLevel: String(editTarget.yearLevel),
        status: editTarget.status,
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
      scholarID: form.scholarID,
      fullname: form.fullname,
      email: form.email,
      contactNo: form.contactNo,
      picture: form.picture,
      degreeProgram: form.degreeProgram,
      yearLevel: Number(form.yearLevel),
      status: form.status,
    });
  };

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="fd-modal-backdrop" onClick={handleBackdrop}>
      <div className="fd-modal-content fade-in">
        <div className="fd-modal-header">
          <h3>{editTarget ? "Edit Scholar" : "Add New Scholar"}</h3>
          <button className="fd-close" onClick={onClose}>&times;</button>
        </div>

        <form className="fd-modal-body" onSubmit={handleSubmit}>
          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Scholar ID</label>
              <input type="text" value={form.scholarID} onChange={set("scholarID")} required />
            </div>
            <div className="fd-form-group">
              <label>Full Name *</label>
              <input type="text" value={form.fullname} onChange={set("fullname")} required />
            </div>
            <div className="fd-form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} />
            </div>
          </div>

          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Contact Number *</label>
              <input type="text" value={form.contactNo} onChange={set("contactNo")} required />
            </div>
            <div className="fd-form-group">
              <label>Picture URL</label>
              <input type="text" value={form.picture} onChange={set("picture")} placeholder="https://…" />
            </div>
          </div>

          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Degree Program *</label>
              <select value={form.degreeProgram} onChange={set("degreeProgram")} required>
                <option value="">Select Program</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="fd-form-group">
              <label>Year Level *</label>
              <select value={form.yearLevel} onChange={set("yearLevel")} required>
                <option value="">Select Year</option>
                {[1, 2, 3, 4, 5].map((y) => (
                  <option key={y} value={y}>{y === 1 ? "1st" : y === 2 ? "2nd" : y === 3 ? "3rd" : `${y}th`} Year</option>
                ))}
              </select>
            </div>
          </div>

          <div className="fd-form-group">
            <label>Status</label>
            <select value={form.status} onChange={set("status")}>
              <option value="active">Active</option>
              <option value="graduate">Graduated</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="fd-form-actions">
            <button type="button" className="fd-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="fd-btn-primary">Save Scholar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Details Modal ────────────────────────────────────────────────────────────

interface DetailsModalProps {
  scholar: Scholar | null;
  onClose: () => void;
}

function DetailsModal({ scholar: s, onClose }: DetailsModalProps) {
  if (!s) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fd-modal-backdrop" onClick={handleBackdrop}>
      <div className="fd-modal-content sc-wide-modal fade-in">
        <div className="fd-modal-header">
          <h3>Scholar Details</h3>
          <button className="fd-close" onClick={onClose}>&times;</button>
        </div>

        <div className="fd-modal-body">
          <div className="sc-profile-header">
            <div className="sc-profile-avatar">
              <Avatar src={s.picture} name={s.fullname} />
            </div>
            <div className="sc-profile-info">
              <h2>{s.fullname}</h2>
              <p>Program: {s.degreeProgram}</p>
              <p>Contact: {s.contactNo}</p>
            </div>
          </div>

          <div className="sc-details-grid">
            <div className="sc-detail-item">
              <label>Scholar ID</label>
              <span>{s.scholarID || "N/A"}</span>
            </div>
            <div className="sc-detail-item">
              <label>Year Level</label>
              <span>{YEAR_LABELS[s.yearLevel]} Year</span>
            </div>
            <div className="sc-detail-item">
              <label>Status</label>
              <span className={`fd-badge fd-badge-${s.status}`}>{capitalize(s.status)}</span>
            </div>
            <div className="sc-detail-item">
              <label>Email</label>
              <span>{s.email || "N/A"}</span>
            </div>
            <div className="sc-detail-item">
              <label>Date Added</label>
              <span>{new Date(s.dateAdded).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Scholars() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Scholar | null>(null);
  const [detailScholar, setDetailScholar] = useState<Scholar | null>(null);

  // ── API ──────────────────────────────────────────────────────────────────

  const loadScholars = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Scholar[] = await res.json();
      setScholars(data);
    } catch (err) {
      console.error("Failed to load scholars:", err);
    }
  }, []);

  useEffect(() => {
    loadScholars();
  }, [loadScholars]);

  const saveScholar = async (
    data: Omit<Scholar, "_id" | "dateAdded"> & { _id?: string }
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
      loadScholars();
    } catch (err) {
      console.error("Error saving scholar:", err);
    }
  };

  const viewDetails = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Fetch failed");
      const s: Scholar = await res.json();
      setDetailScholar(s);
    } catch (err) {
      console.error("Error fetching scholar details:", err);
    }
  };

  const deleteScholar = async (id: string) => {
    if (!confirm("Delete this scholar?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadScholars();
    } catch (err) {
      console.error("Error deleting scholar:", err);
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const filtered = scholars.filter((s) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.fullname.toLowerCase().includes(q) ||
      (s.degreeProgram ?? "").toLowerCase().includes(q) ||
      (s.scholarID ?? "").toLowerCase().includes(q) ||
      (s.contactNo ?? "").toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "id") return (a.scholarID ?? "").localeCompare(b.scholarID ?? "") * dir;
    if (sortField === "name") return a.fullname.localeCompare(b.fullname) * dir;
    if (sortField === "program") return a.degreeProgram.localeCompare(b.degreeProgram) * dir;
    if (sortField === "yearLevel") return (a.yearLevel - b.yearLevel) * dir;
    if (sortField === "status") return a.status.localeCompare(b.status) * dir;
    return 0;
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
              placeholder="Search scholars…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* CONTENT */}
        <section className="fd-content">
          <div className="fd-section-title">
            <h3>Organization Scholars</h3>
            <button
              className="fd-btn fd-btn-primary"
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
            >
              + Add Scholar
            </button>
          </div>

          {/* SORT CONTROLS */}
          <div className="fd-sort-controls">
            <label><strong>Sort by:</strong></label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}>
              <option value="name">Name</option>
              <option value="id">ID</option>
              <option value="program">Program</option>
              <option value="yearLevel">Year Level</option>
              <option value="status">Status</option>
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
                  <th>Picture</th>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Year</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s._id} className="fade-in">
                    <td>{s.scholarID || "N/A"}</td>
                    <td>
                      <div className="sc-avatar-wrap">
                        <Avatar src={s.picture} name={s.fullname} />
                      </div>
                    </td>
                    <td><strong>{s.fullname}</strong></td>
                    <td>{s.degreeProgram}</td>
                    <td>{YEAR_LABELS[s.yearLevel]} Year</td>
                    <td>{s.contactNo}</td>
                    <td>
                      <span className={`fd-badge fd-badge-${s.status}`}>
                        {capitalize(s.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="fd-action-btn fd-view-btn"
                        onClick={() => viewDetails(s._id)}
                      >
                        View
                      </button>
                      <button
                        className="fd-action-btn fd-edit-btn"
                        onClick={() => { setEditTarget(s); setModalOpen(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="fd-action-btn fd-delete-btn"
                        onClick={() => deleteScholar(s._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="fd-empty">No scholars found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ADD/EDIT MODAL */}
      <ScholarModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={saveScholar}
      />

      {/* DETAILS MODAL */}
      <DetailsModal
        scholar={detailScholar}
        onClose={() => setDetailScholar(null)}
      />
    </div>
  );
}
