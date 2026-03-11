import React, { useState } from "react";
import "../index.css";

interface Member {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: "active" | "inactive";
}

export default function Members() {

  const [members] = useState<Member[]>([
    {
      id: "MEM-001",
      name: "John Doe",
      role: "President",
      contact: "09123456789",
      status: "active",
    },
    {
      id: "MEM-002",
      name: "Jane Smith",
      role: "Treasurer",
      contact: "09987654321",
      status: "active",
    },
  ]);

  return (
    <>

      <div className="fd-section-title">
        <h3>Organization Members</h3>
      </div>

      <div className="fd-card">

        <table className="fd-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {members.map((m) => (

              <tr key={m.id}>

                <td>{m.id}</td>

                <td>
                  <strong>{m.name}</strong>
                </td>

                <td>{m.role}</td>

                <td>{m.contact}</td>

                <td>
                  <span className={`fd-badge fd-badge-${m.status}`}>
                    {m.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>
  );
}