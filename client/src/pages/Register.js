import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedPassword = password;

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/@gmail\.com$/i.test(normalizedEmail)) {
      setError("Please use a valid Gmail address so deadline reminders can be sent.");
      return;
    }
    if (normalizedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(apiUrl("/api/auth/register"), {
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
      });
      setSuccess(res.data.message || "Registration successful.");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const serverMessage = err.response?.data?.message || "";
      if (/otp|one[- ]?time|verification code|2fa|mfa/i.test(serverMessage)) {
        setError("Registration failed. Please try again.");
      } else {
        setError(serverMessage || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleRegister();
    }
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
      <div style={{
        position: "absolute",
        top: "20%",
        right: "20%",
        width: 350,
        height: 350,
        background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "40px",
        boxShadow: "var(--shadow-lg)",
        animation: "fadeUp 0.4s ease forwards",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52,
            height: 52,
            background: "linear-gradient(135deg, #818cf8 0%, var(--accent) 100%)",
            borderRadius: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: "0 4px 20px rgba(129, 140, 248, 0.3)",
            marginBottom: 16,
          }}>🚀</div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "var(--text-primary)",
            marginBottom: 6,
          }}>
            Create account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Start tracking your internship journey
          </p>
        </div>

        {error && (
          <div style={{
            background: "var(--rejected-bg)",
            border: "1px solid var(--rejected-border)",
            color: "var(--rejected-text)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 16,
          }}>
            ⚠ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "var(--offered-bg)",
            border: "1px solid var(--offered-border)",
            color: "var(--offered-text)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 16,
          }}>
            ✓ {success}
          </div>
        )}

        {[
          { label: "Full name", placeholder: "Alex Johnson", type: "text", setter: setName },
          { label: "Email address", placeholder: "you@example.com", type: "email", setter: setEmail },
          { label: "Password", placeholder: "Min. 6 characters", type: "password", setter: setPassword },
        ].map(({ label, placeholder, type, setter }, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              marginBottom: 6,
            }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              onChange={e => setter(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        ))}

        <div style={{ marginBottom: 24 }} />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: loading
              ? "var(--bg-elevated)"
              : "linear-gradient(135deg, #818cf8 0%, var(--accent) 100%)",
            color: loading ? "var(--text-muted)" : "white",
            borderRadius: "var(--radius-sm)",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: loading ? "none" : "0 4px 20px rgba(129, 140, 248, 0.25)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account…" : "Create account →"}
        </button>

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
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{
              color: "var(--accent-bright)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
