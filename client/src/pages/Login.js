import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    const normalizedPassword = password;

    if (!normalizedEmail || !normalizedPassword) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        apiUrl("/api/auth/login"),
        { email: normalizedEmail, password: normalizedPassword }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const serverMessage = err.response?.data?.message || "";
      if (/otp|one[- ]?time|verification code|2fa|mfa/i.test(serverMessage)) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(serverMessage || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "var(--bg-base)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "15%",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "10%",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "40px",
        boxShadow: "var(--shadow-lg), 0 0 60px rgba(59,130,246,0.05)",
        animation: "fadeUp 0.4s ease forwards",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo mark */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52,
            height: 52,
            background: "linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)",
            borderRadius: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: "0 4px 20px var(--accent-glow)",
            marginBottom: 16,
          }}>📋</div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "var(--text-primary)",
            marginBottom: 6,
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Sign in to your InternTrack account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "var(--rejected-bg)",
            border: "1px solid var(--rejected-border)",
            color: "var(--rejected-text)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 16,
            animation: "fadeIn 0.2s ease",
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: "block",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: 6,
          }}>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: "block",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: 6,
          }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: loading
              ? "var(--bg-elevated)"
              : "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)",
            color: loading ? "var(--text-muted)" : "white",
            borderRadius: "var(--radius-sm)",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.2px",
            boxShadow: loading ? "none" : "0 4px 20px var(--accent-glow)",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (!loading) e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
          }}
        >
          {loading ? "Signing in…" : "Sign in →"}
        </button>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "24px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
          No account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "var(--accent-bright)",
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "underline",
              textDecorationColor: "transparent",
              transition: "text-decoration-color 0.2s",
            }}
            onMouseEnter={e => e.target.style.textDecorationColor = "var(--accent-bright)"}
            onMouseLeave={e => e.target.style.textDecorationColor = "transparent"}
          >
            Create one free
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
