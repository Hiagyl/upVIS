import React, { useState, useEffect, useCallback } from "react";
import "../index.css";
import "./Scholars.css";

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

function Avatar({ src, name }: { src?: string; name: string }) {
  if (src) return <img src={src} alt={name} className="sc-avatar-img" />;

  return (
    <div className="sc-avatar-placeholder">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function Scholars() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const loadScholars = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setScholars(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadScholars();
  }, [loadScholars]);

  const filtered = scholars.filter((s) => {
    const q = search.toLowerCase();

    return (
      s.fullname.toLowerCase().includes(q) ||
      (s.degreeProgram ?? "").toLowerCase().includes(q) ||
      (s.scholarID ?? "").toLowerCase().includes(q) ||
      (s.contactNo ?? "").toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    if (sortField === "id")
      return (a.scholarID ?? "").localeCompare(b.scholarID ?? "") * dir;

    if (sortField === "name")
      return a.fullname.localeCompare(b.fullname) * dir;

    if (sortField === "program")
      return a.degreeProgram.localeCompare(b.degreeProgram) * dir;

    if (sortField === "yearLevel")
      return (a.yearLevel - b.yearLevel) * dir;

    if (sortField === "status")
      return a.status.localeCompare(b.status) * dir;

    return 0;
  });

  return (
    <>

      <div className="fd-section-title">

        <h3>Organization Scholars</h3>

      </div>

      <div className="fd-sort-controls">

        <label><strong>Sort by:</strong></label>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
        >
          <option value="name">Name</option>
          <option value="id">ID</option>
          <option value="program">Program</option>
          <option value="yearLevel">Year Level</option>
          <option value="status">Status</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as SortDirection)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

      </div>

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

              </tr>

            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="fd-empty">
                  No scholars found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </>
  );
}