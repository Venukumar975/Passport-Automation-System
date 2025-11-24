import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

export default function UserDashboard() {
  const navigate = useNavigate();
  
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("User");
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/applications/my-dashboard', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            navigate('/login');
            return;
        }

        const data = await response.json();

        const formattedApps = data.map(item => {
          const rawStatus = item.is_draft 
              ? "DRAFT"
              : (item.application_status || "").toUpperCase();

          const allowedStatuses = ["DRAFT","PENDING","APPROVED","VERIFIED","REJECTED"];
          const finalStatus = allowedStatuses.includes(rawStatus) ? rawStatus : "PENDING";

          return {
            id: `APP-${item.application_id}`,
            applicant: item.full_name,
            status: finalStatus,
            submittedAt: item.submitted_at
                ? new Date(item.submitted_at).toLocaleDateString('en-GB')
                : null
          };
        });

        setApps(formattedApps);

        if (formattedApps.length > 0) {
          setCurrentUser(formattedApps[0].applicant.split(" ")[0]);
        }

      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    return apps.filter(a => {
      const status = a.status.toUpperCase();

      if (filter === "drafts" && status !== "DRAFT") return false;
      if (filter === "active" && status !== "PENDING") return false;
      if (filter === "completed" && !["APPROVED","REJECTED","VERIFIED"].includes(status)) return false;

      if (!qLower) return true;

      return (
        a.id.toLowerCase().includes(qLower) ||
        a.applicant.toLowerCase().includes(qLower)
      );
    });
  }, [apps, filter, q]);

  if (loading)
    return <div style={{ padding: 50, textAlign: "center" }}>Loading your dashboard...</div>;

  return (
    <div className="app-page">
      <Header showClock={true} userName={currentUser} />

      <main className="container">
        <div className="top-row">
          <div className="title-block">
            <h1>My Applications</h1>
            <p className="subtitle">Track and manage your passport applications</p>
          </div>

          <div className="actions-block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="search"
              placeholder="Search by application ID or name..."
            />
            <button className="btn primary" onClick={() => navigate('/newapplication')}>
              New Application
            </button>
          </div>
        </div>

        <div className="tabs">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All Applications
          </button>
          <button className={filter === "drafts" ? "active" : ""} onClick={() => setFilter("drafts")}>
            Drafts
          </button>
          <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
            Pending
          </button>
          <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>
            Completed
          </button>
        </div>

        {/* ✅ SCROLL CONTAINER ADDED HERE */}
        <div className="apps-scroll-box">

          <div className="cards-grid">
            {filtered.length === 0 && <div className="empty">No applications found</div>}

            {filtered.map(app => (
              <article key={app.id} className="app-card" data-status={app.status}>
                <div className="card-top">
                  <div className="doc-ico">📄</div>
                  <div className={`badge ${app.status.toLowerCase()}`}>{app.status}</div>
                </div>

                <h3 className="app-id">{app.id}</h3>

                <div className="label">APPLICANT NAME</div>
                <div className="applicant">{app.applicant}</div>

                <div className="meta">
                  {app.status === "DRAFT"
                    ? "Draft - Not Submitted"
                    : `Submitted on ${app.submittedAt}`}
                </div>

                <div className="card-actions">
                  <button className="btn outline" onClick={() => navigate(`/application/${app.id}`)}>
                    View Details
                  </button>

                  {app.status === "DRAFT" && (
                    <button className="btn primary">Continue</button>
                  )}
                </div>
              </article>
            ))}
          </div>

        </div>
        {/* END SCROLL BOX */}

      </main>
    </div>
  );
}
