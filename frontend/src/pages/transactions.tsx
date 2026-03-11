import React, { useState, useEffect, useCallback } from "react";
import "../index.css";
import "./Transactions.css";

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
}

type Transaction =
  | DonationTransaction
  | ExpenseTransaction
  | PurchaseTransaction;

const API_URLS = {
  Donations: "http://localhost:5000/api/donations",
  Expenses: "http://localhost:5000/api/expenses",
};

function formatMoney(v: number) {
  return "₱ " + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(v);
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const fetchTransactions = useCallback(async () => {
    try {
      const [donRes, expRes] = await Promise.all([
        fetch(API_URLS.Donations),
        fetch(API_URLS.Expenses),
      ]);

      const donations = await donRes.json();
      const expenses = await expRes.json();

      const merged = [
        ...donations.map((d: any) => ({
          ...d,
          type: "donation",
          date: d.date ?? d.dateReceived,
        })),
        ...expenses.map((e: any) => ({
          ...e,
          type: e.type ?? "expense",
        })),
      ];

      setTransactions(merged);

    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.type.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      String(t.amount).includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;

    if (sortField === "amount") return (a.amount - b.amount) * dir;
    if (sortField === "date")
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;

    return a.type.localeCompare(b.type) * dir;
  });

  return (
    <>
      <div className="fd-section-title">
        <h3>Transactions</h3>
      </div>

      <div className="fd-sort-controls">
        <label>
          <strong>Sort by:</strong>
        </label>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
        >
          <option value="date">Date</option>
          <option value="type">Type</option>
          <option value="amount">Amount</option>
        </select>

        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as SortDirection)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="fd-card">

        <table className="fd-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="fd-empty">
                  No transactions found.
                </td>
              </tr>
            )}

            {sorted.map((t) => (
              <tr key={t._id}>

                <td>{t._id}</td>

                <td>
                  <span className={`fd-badge fd-badge-${t.type}`}>
                    {t.type}
                  </span>
                </td>

                <td>{t.description || "—"}</td>

                <td>{formatMoney(t.amount)}</td>

                <td>{new Date(t.date).toLocaleDateString()}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}