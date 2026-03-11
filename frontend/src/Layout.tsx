import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {

  const location = useLocation();

  const navLinks = [
    { path: "/finance", label: "Dashboard", icon: "D" },
    { path: "/transactions", label: "Transactions", icon: "T" },
    { path: "/distributions", label: "Distributions", icon: "D" },
    { path: "/scholars", label: "Scholars", icon: "S" },
    { path: "/members", label: "Members", icon: "M" },
  ];

  return (
    <div className="fd-app">

      <aside className="fd-sidebar">

        <div className="fd-brand">
          <div className="fd-logo" />
          <div>
            <h1>UP Vis</h1>
            <div className="fd-sub">
              Scholar Support and Donation Management System
            </div>
          </div>
        </div>

        <nav className="fd-nav">
          <h3>Finance</h3>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={location.pathname === link.path ? "active" : ""}
            >
              <span className="fd-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

      </aside>

      <main className="fd-main">

        <header className="fd-topbar">
          <div className="fd-search-bar">
            <span>🔍</span>
            <input placeholder="Search..." />
          </div>
        </header>

        <section className="fd-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}