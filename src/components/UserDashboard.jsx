import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

export default function UserDashboard() {
  const navigate = useNavigate();
  
  // 1. State to hold the Real Data
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("User"); // To store username for Header

  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  // 2. Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // We use 'credentials: include' to send the Session Cookie to the backend
        const response = await fetch('http://localhost:3001/api/applications/my-dashboard', {
            method: 'GET',
            credentials: 'include' 
        });

        if (response.status === 401) {
            // If not logged in, redirect to login
            navigate('/login');
            return;
        }

        const data = await response.json();
        
        // 3. Map Database Columns to UI Structure
        const formattedApps = data.map(item => ({
            id: `APP-${item.application_id}`, // Format ID nicely
            applicant: item.full_name,
            // Logic: If it's a draft, status is 'DRAFT', otherwise use the DB status (Approved/Pending)
            status: item.is_draft ? 'DRAFT' : item.application_status.toUpperCase(),
            // Logic: If submitted, use submitted date, else use creation date
            submittedAt: item.submitted_at 
                ? new Date(item.submitted_at).toLocaleDateString('en-GB') 
                : null
        }));

        setApps(formattedApps);
        
        // Optional: Set the username for the header based on the first application found
        if (formattedApps.length > 0) {
            setCurrentUser(formattedApps[0].applicant.split(' ')[0]); // Get first name
        }

      } catch (error) {
        console.error("Error loading applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 4. Filtering Logic (Updated to match DB Statuses)
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return apps.filter(a => {
      const status = (a.status || '').toUpperCase();
      
      if (filter === 'drafts' && status !== 'DRAFT') return false;
      // 'Active' usually means Submitted/Pending but not yet Finalized
      if (filter === 'active' && !['PENDING'].includes(status)) return false;
      // 'Completed' means a decision was made
      if (filter === 'completed' && !['APPROVED', 'REJECTED', 'VERIFIED'].includes(status)) return false;

      if (!qLower) return true;
      return (a.id && a.id.toLowerCase().includes(qLower)) || (a.applicant && a.applicant.toLowerCase().includes(qLower));
    });
  }, [apps, filter, q]);

  if (loading) return <div style={{padding: 50, textAlign: 'center'}}>Loading your dashboard...</div>;

  return (
    <div className="app-page">
      {/* Pass the fetched name to the Header */}
      <Header showClock={true} userName={currentUser} />

      <main className="container">
        <div className="top-row">
          <div className="title-block">
            <h1>My Applications</h1>
            <p className="subtitle">Track and manage your passport applications</p>
          </div>

          <div className="actions-block">
            <input value={q} onChange={e => setQ(e.target.value)} className="search" placeholder="Search by application ID or name..." />
            <button 
            className="btn primary"
            onClick={()=> navigate('/newapplication')}>
               New Application
               </button>
          </div>
        </div>

        <div className="tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Applications</button>
          <button className={filter === 'drafts' ? 'active' : ''} onClick={() => setFilter('drafts')}>Drafts</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Pending</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <div className="cards-grid">
          {filtered.length === 0 && <div className="empty">No applications found</div>}
          {filtered.map(app => (
            <article key={app.id} className="app-card" data-status={app.status}>
              <div className="card-top">
                  <div className="doc-ico">📄</div>
                  {/* Dynamic class for badge color based on status */}
                  <div className={`badge ${app.status.toLowerCase()}`}>{app.status}</div>
              </div>
              
              <h3 className="app-id">{app.id}</h3>
              
              <div className="label">APPLICANT NAME</div>
              <div className="applicant">{app.applicant || '—'}</div>
              
              <div className="meta">
                  {/* If it is a draft, show 'Not submitted', else show date */}
                  {app.status === 'DRAFT' ? 'Draft - Not Submitted' : `Submitted on ${app.submittedAt}`}
              </div>
              
              <div className="card-actions">
                <button className="btn outline">View Details</button>
                {app.status === 'DRAFT' && <button className="btn primary">Continue</button>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}