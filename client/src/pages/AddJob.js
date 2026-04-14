import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl, authHeader } from "../api";

const STATUS_OPTIONS = [
  { value: "Applied", label: "Applied", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { value: "Interview", label: "Interview", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
  { value: "Offered", label: "Offered", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { value: "Rejected", label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
];

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve("");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

function AddJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [deadline, setDeadline] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [offerLetter, setOfferLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addJob = async () => {
    if (!title.trim() || !company.trim()) {
      setError("Please fill in title and company.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        company,
        status,
        deadline,
        city,
        state,
        lat,
        lng,
        resumeFile: await fileToBase64(resume),
        coverLetterFile: await fileToBase64(coverLetter),
        offerLetterFile: await fileToBase64(offerLetter)
      };

      await axios.post(apiUrl("/api/jobs"), payload, { headers: authHeader() });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const message = err?.response?.data || "Failed to add job. Please try again.";
      setError(typeof message === "string" ? message : "Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "48px auto", padding: "0 24px" }}>
      <button onClick={() => navigate("/dashboard")} style={{ background: "transparent", border: "none", marginBottom: 24 }}>
        ← Back to dashboard
      </button>
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "36px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Add Application</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
          Include location, documents and reminders to make this tracker feel like a real product.
        </p>

        {success && <div style={{ marginBottom: 16, color: "var(--offered-text)" }}>✓ Application added! Redirecting…</div>}
        {error && <div style={{ marginBottom: 16, color: "var(--rejected-text)" }}>⚠ {error}</div>}

        <label>Job / Role Title</label>
        <input type="text" onChange={e => setTitle(e.target.value)} />
        <label style={{ marginTop: 12, display: "block" }}>Company Name</label>
        <input type="text" onChange={e => setCompany(e.target.value)} />
        <label style={{ marginTop: 12, display: "block" }}>Deadline</label>
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />

        <label style={{ marginTop: 16, display: "block" }}>Application Status</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STATUS_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setStatus(opt.value)} style={{
              padding: "8px 14px",
              borderRadius: 99,
              background: status === opt.value ? opt.bg : "transparent",
              color: status === opt.value ? opt.color : "var(--text-muted)",
              border: `1px solid ${status === opt.value ? opt.color : "var(--border)"}`
            }}>
              {opt.label}
            </button>
          ))}
        </div>

        <h3 style={{ marginTop: 20, marginBottom: 8 }}>Location</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
          <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} />
          <input type="number" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)} step="any" />
          <input type="number" placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)} step="any" />
        </div>

        <h3 style={{ marginTop: 20, marginBottom: 8 }}>Documents</h3>
        <label>Resume</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResume(e.target.files?.[0] || null)} />
        <label style={{ marginTop: 8, display: "block" }}>Cover Letter</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setCoverLetter(e.target.files?.[0] || null)} />
        <label style={{ marginTop: 8, display: "block" }}>Offer Letter</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setOfferLetter(e.target.files?.[0] || null)} />

        <button onClick={addJob} disabled={loading || success} style={{ width: "100%", marginTop: 22, padding: "13px" }}>
          {loading ? "Saving…" : success ? "✓ Saved!" : "Save Application →"}
        </button>
      </div>
    </div>
  );
}

export default AddJob;
