import React, { useState, useEffect, useCallback } from "react";
import "../index.css";
import "./distributions.css";

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

function formatMoney(v: number) {
  return "₱ " + v.toLocaleString();
}

export default function Distributions() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const loadDistributions = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setDistributions(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadDistributions();
  }, [loadDistributions]);

  const filtered = distributions.filter((d) =>
    d.scholar.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    if (sortField === "amount") return (a.amount - b.amount) * dir;

    if (sortField === "id")
      return a.distributionID.localeCompare(b.distributionID) * dir;

    return (a[sortField] ?? "").localeCompare(b[sortField] ?? "") * dir;
  });

  return (
    <>
      <div className="fd-section-title">
        <h3>Distributions</h3>
      </div>

      <div className="fd-sort-controls">
        <label>
          <strong>Sort by:</strong>
        </label>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
        >
          <option value="id">ID</option>
          <option value="scholar">Scholar</option>
          <option value="type">Type</option>
          <option value="amount">Amount</option>
          <option value="location">Location</option>
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
              <th>Scholar</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Proof</th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="fd-empty">
                  No distributions found.
                </td>
              </tr>
            )}

            {sorted.map((d) => (
              <tr key={d._id}>
                <td>{d.distributionID}</td>

                <td>{d.scholar}</td>

                <td>
                  <span
                    className={`fd-badge fd-badge-${d.type.toLowerCase()}`}
                  >
                    {d.type}
                  </span>
                </td>

                <td>{formatMoney(d.amount)}</td>

                <td>{d.location || "—"}</td>

                <td>
                  {d.proof ? (
                    <a
                      href={d.proof}
                      target="_blank"
                      rel="noreferrer"
                      className="fd-link"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}