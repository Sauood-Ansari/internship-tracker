import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: "var(--radius-sm)",
    fontSize: 14,
    fontWeight: 500,
    color: isActive(path) ? "var(--accent-bright)" : "var(--text-secondary)",
    background: isActive(path) ? "var(--accent-soft)" : "transparent",
    border: isActive(path) ? "1px solid var(--applied-border)" : "1px solid transparent",
    textDecoration: "none",
    transition: "all 0.2s",
  });

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(7, 8, 13, 0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 32px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{
          width: 30,
          height: 30,
          background: "linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          boxShadow: "0 2px 12px var(--accent-glow)",
        }}>
          📋
        </div>
        <span style={{
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "-0.3px",
          color: "var(--text-primary)",
        }}>
          Intern<span style={{ color: "var(--accent-bright)" }}>Track</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Link to="/dashboard" style={linkStyle("/dashboard")}>
          <span>⊞</span> Dashboard
        </Link>
        <Link to="/add" style={linkStyle("/add")}>
          <span>＋</span> Add Job
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          padding: "6px 14px",
          borderRadius: "var(--radius-sm)",
          fontSize: 13,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.target.style.borderColor = "var(--rejected-border)";
          e.target.style.color = "var(--rejected-text)";
          e.target.style.background = "var(--rejected-bg)";
        }}
        onMouseLeave={e => {
          e.target.style.borderColor = "var(--border)";
          e.target.style.color = "var(--text-secondary)";
          e.target.style.background = "transparent";
        }}
      >
        ↩ Logout
      </button>
    </nav>
  );
}

export default Navbar;