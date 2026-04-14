import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, apiUrl, authHeader } from "../api";

const STATUS_CONFIG = {
  Applied: { dot: "#3b82f6", label: "Applied" },
  Interview: { dot: "#a855f7", label: "Interview" },
  Offered: { dot: "#22c55e", label: "Offered" },
  Rejected: { dot: "#ef4444", label: "Rejected" },
};

const hasAnyDocument = (documents = {}) => Boolean(documents.resume || documents.coverLetter || documents.offerLetter);

const buildMapEmbed = (lat, lng) => {
  const delta = 0.08;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat}%2C${lng}&layer=mapnik`;
};

const getReminders = (job) => {
  const reminders = [];
  const now = new Date();

  if (job.deadline) {
    const diffDays = Math.ceil((new Date(job.deadline) - now) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 2) reminders.push(`⏰ Deadline in ${diffDays} day${diffDays === 1 ? "" : "s"}`);
  }

  if (job.status === "Applied" && job.createdAt) {
    const followUpDate = new Date(job.createdAt);
    followUpDate.setDate(followUpDate.getDate() + 7);
    if (followUpDate <= now) reminders.push("📌 Follow-up due (7 days passed)");
  }

  return reminders;
};

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [deleting, setDeleting] = useState(null);

    const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    status: "Applied",
    deadline: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(apiUrl("/api/jobs"), { headers: authHeader() })
      .then(res => setJobs(res.data))
      .catch(() => setToast("⚠ Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const deleteJob = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(apiUrl(`/api/jobs/${id}`), { headers: authHeader() });
      setJobs(prev => prev.filter(job => job._id !== id));
      setToast("🗑 Application removed");
    } catch {
      setToast("⚠ Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const toInputDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  const startEdit = (job) => {
    setEditing(job._id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      status: job.status || "Applied",
      deadline: toInputDate(job.deadline),
      city: job.location?.city || "",
      state: job.location?.state || "",
      lat: job.location?.lat ?? "",
      lng: job.location?.lng ?? "",
    });
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = async (id) => {
    if (!form.title.trim() || !form.company.trim()) {
      setToast("⚠ Title and company are required");
      return;
    }

    setSaving(id);
    try {
      const payload = {
        title: form.title,
        company: form.company,
        status: form.status,
        deadline: form.deadline,
        city: form.city,
        state: form.state,
        lat: form.lat,
        lng: form.lng,
      };

      const res = await axios.put(apiUrl(`/api/jobs/${id}`), payload, { headers: authHeader() });
      setJobs((prev) => prev.map((job) => (job._id === id ? res.data : job)));
      setEditing(null);
      setToast("✅ Application updated");
    } catch {
      setToast("⚠ Failed to update");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>My Applications</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{jobs.length} tracked</p>
        </div>
        <button onClick={() => navigate("/add")}>+ Add Application</button>
      </div>

      {loading && <p>Loading applications...</p>}

      {!loading && jobs.map((job) => {
        const reminders = getReminders(job);
        const docAttached = hasAnyDocument(job.documents);
        const status = STATUS_CONFIG[job.status] || STATUS_CONFIG.Applied;
        const hasMap = typeof job.location?.lat === "number" && typeof job.location?.lng === "number";

        return (
          <div key={job._id} style={{ border: "1px solid var(--border)", borderLeft: `3px solid ${status.dot}`, padding: 16, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{job.company}</div>
                {!!job.location?.city && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    📍 {job.location.city}, {job.location.state}
                  </div>
                )}
              </div>
              <button onClick={() => deleteJob(job._id)} disabled={deleting === job._id}>{deleting === job._id ? "…" : "Delete"}</button>
            </div>

            <div style={{ marginTop: 8, fontSize: 12 }}>
              <span>Status: {status.label}</span>
              <span style={{ marginLeft: 12 }}>{docAttached ? "📎 Documents attached" : "📭 No documents attached"}</span>
            </div>

             <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(job)} style={{ padding: "6px 10px" }}>Edit</button>
            </div>

            {editing === job._id && (
              <div style={{ marginTop: 12, border: "1px solid var(--border)", borderRadius: 8, padding: 10 }}>
                <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  <input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Job title" />
                  <input value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Company" />
                  <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <input type="date" value={form.deadline} onChange={(e) => updateField("deadline", e.target.value)} />
                  <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
                  <input value={form.state} onChange={(e) => updateField("state", e.target.value)} placeholder="State" />
                  <input type="number" value={form.lat} onChange={(e) => updateField("lat", e.target.value)} placeholder="Latitude" step="any" />
                  <input type="number" value={form.lng} onChange={(e) => updateField("lng", e.target.value)} placeholder="Longitude" step="any" />
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button onClick={() => saveEdit(job._id)} disabled={saving === job._id}>
                    {saving === job._id ? "Saving…" : "Save Changes"}
                  </button>
                  <button onClick={() => setEditing(null)} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}


            {docAttached && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8, fontSize: 12 }}>
                {job.documents?.resume && <a href={`${API_BASE_URL}/uploads/${job.documents.resume}`} target="_blank" rel="noreferrer">Resume</a>}
                {job.documents?.coverLetter && <a href={`${API_BASE_URL}/uploads/${job.documents.coverLetter}`} target="_blank" rel="noreferrer">Cover Letter</a>}
                {job.documents?.offerLetter && <a href={`${API_BASE_URL}/uploads/${job.documents.offerLetter}`} target="_blank" rel="noreferrer">Offer Letter</a>}
              </div>
            )}

            {!!reminders.length && (
              <div style={{ marginTop: 10, background: "var(--bg-elevated)", borderRadius: 8, padding: 8, fontSize: 12 }}>
                {reminders.map((reminder) => <div key={reminder}>{reminder}</div>)}
              </div>
            )}

            {hasMap && (
              <div style={{ marginTop: 10 }}>
                <iframe
                  title={`map-${job._id}`}
                  src={buildMapEmbed(job.location.lat, job.location.lng)}
                  style={{ width: "100%", height: 220, border: "1px solid var(--border)", borderRadius: 8 }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        );
      })}

      {toast && <div style={{ position: "fixed", bottom: 18, right: 18 }}>{toast}</div>}
    </div>
  );
}

export default Dashboard;
