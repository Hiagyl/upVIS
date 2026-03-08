import React, { useState, useEffect, useCallback } from "react";
import "./globals.css";
import "./members.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  _id: string;
  memberID: string;
  fullname: string;
  contactNo: string;
  joinDate: string;
  status: "active" | "inactive";
}

type SortField = "memberID" | "fullname" | "joinDate" | "status";
type SortDirection = "asc" | "desc";

const API_URL = "http://localhost:5000/api/members";

// ─── Modal ────────────────────────────────────────────────────────────────────

interface MemberModalProps {
  open: boolean;
  editTarget: Member | null;
  onClose: () => void;
  onSave: (data: Omit<Member, "_id"> & { _id?: string }) => Promise<void>;
}

const emptyForm = {
  memberID: "",
  fullname: "",
  contactNo: "",
  joinDate: "",
  status: "active" as Member["status"],
};

function MemberModal({ open, editTarget, onClose, onSave }: MemberModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editTarget) {
      setForm({
        memberID: editTarget.memberID,
        fullname: editTarget.fullname,
        contactNo: editTarget.contactNo,
        joinDate: editTarget.joinDate.split("T")[0],
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
    await onSave({ _id: editTarget?._id, ...form });
  };

  const set = (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="fd-modal-backdrop" onClick={handleBackdrop}>
      <div className="fd-modal-content fade-in">
        <div className="fd-modal-header">
          <h3>{editTarget ? "Edit Member" : "Add New Member"}</h3>
          <button className="fd-close" onClick={onClose}>&times;</button>
        </div>

        <form className="fd-modal-body" onSubmit={handleSubmit}>
          <div className="fd-form-group">
            <label>Member ID *</label>
            <input type="text" value={form.memberID} onChange={set("memberID")} required />
          </div>

          <div className="fd-form-group">
            <label>Full Name *</label>
            <input type="text" value={form.fullname} onChange={set("fullname")} required />
          </div>

          <div className="fd-form-group">
            <label>Contact Number *</label>
            <input type="text" value={form.contactNo} onChange={set("contactNo")} required />
          </div>

          <div className="fd-form-row">
            <div className="fd-form-group">
              <label>Join Date</label>
              <input type="date" value={form.joinDate} onChange={set("joinDate")} />
            </div>

            <div className="fd-form-group">
              <label>Status</label>
              <select value={form.status} onChange={set("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="fd-form-actions">
            <button type="button" className="fd-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="fd-btn-primary">Save Member</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("memberID");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Member | null>(null);

  // ── API ──────────────────────────────────────────────────────────────────

  const loadMembers = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Member[] = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Error loading members:", err);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const saveMember = async (data: Omit<Member, "_id"> & { _id?: string }) => {
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
      loadMembers();
    } catch (err) {
      console.error("Error saving member:", err);
    }
  };

  const openEdit = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Fetch failed");
      const member: Member = await res.json();
      setEditTarget(member);
      setModalOpen(true);
    } catch (err) {
      console.error("Error loading member:", err);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      loadMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.fullname.toLowerCase().includes(q) ||
      m.memberID.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "joinDate") {
      return (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()) * dir;
    }
    return a[sortField].localeCompare(b[sortField]) * dir;
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
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* CONTENT */}
        <section className="fd-content">
          <div className="fd-section-title">
            <h3>Organization Members</h3>
            <button
              className="fd-btn fd-btn-primary"
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
            >
              + Add Member
            </button>
          </div>

          {/* SORT CONTROLS */}
          <div className="fd-sort-controls">
            <label><strong>Sort by:</strong></label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}>
              <option value="memberID">ID</option>
              <option value="fullname">Name</option>
              <option value="joinDate">Join Date</option>
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
                  <th>Name</th>
                  <th>Contact #</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr key={m._id} className="fade-in">
                    <td>{m.memberID}</td>
                    <td>{m.fullname}</td>
                    <td>{m.contactNo}</td>
                    <td>{new Date(m.joinDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`fd-badge fd-badge-${m.status}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="fd-action-btn fd-edit-btn"
                        onClick={() => openEdit(m._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="fd-action-btn fd-delete-btn"
                        onClick={() => deleteMember(m._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={6} className="fd-empty">No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL */}
      <MemberModal
        open={modalOpen}
        editTarget={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={saveMember}
      />
    </div>
  );
}
