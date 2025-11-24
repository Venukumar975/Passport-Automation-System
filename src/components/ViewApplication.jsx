import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

export default function ViewApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cleanId = id.replace('APP-', '');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/applications/${cleanId}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.status === 401) { navigate('/login'); return; }
        if (response.status === 404) { setError("Application not found"); setLoading(false); return; }
        const data = await response.json();
        setAppData(data);
      } catch (err) { setError("Failed to load details."); } 
      finally { setLoading(false); }
    };
    fetchDetails();
  }, [cleanId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="view-page">
      <Header showClock={true} userName={appData.full_name?.split(' ')[0]} />

      <main className="dashboard-container">
        
        {/* Top Navigation Row */}
        <div className="top-nav">
          <button className="back-link" onClick={() => navigate('/applications')}>
             &larr; Back to Dashboard
          </button>
          <div className="app-id-badge">APP #{appData.application_id}</div>
        </div>

        {/* --- STATUS BANNER (Conditional) --- */}
        {appData.application_status === 'Rejected' && (
           <div className="floating-banner error">
             <div className="banner-icon">🚫</div>
             <div>
                <h3>Application Rejected</h3>
                <p>Reason: "{appData.admin_remarks || 'Contact Support'}"</p>
             </div>
           </div>
        )}
        
        {appData.application_status === 'Approved' && (
           <div className="floating-banner success">
             <div className="banner-icon">✅</div>
             <div>
                <h3>Passport Approved</h3>
                <p>Valid until {formatDate(appData.expiry_date)}. Dispatched to permanent address.</p>
             </div>
           </div>
        )}

        {appData.is_draft === 1 && (
           <div className="floating-banner info">
             <div className="banner-icon">📝</div>
             <div>
                <h3>Draft Application</h3>
                <p>This application is not submitted yet.</p>
             </div>
             <button className="banner-btn" onClick={() => navigate(`/newapplication?resume=${appData.application_id}`)}>
               Continue Filling &rarr;
             </button>
           </div>
        )}

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="bento-grid">
            
            {/* COLUMN 1: APPLICANT IDENTITY (The "Paper" view) */}
            <div className="card profile-card">
               <div className="card-header">
                  <span className="icon-bg">👤</span>
                  <h2>Applicant Identity</h2>
               </div>
               
               <div className="field-row">
                  <label>Full Name</label>
                  <div className="data-xl">{appData.full_name}</div>
               </div>

               <div className="field-row">
                  <label>Date of Birth</label>
                  <div className="data-lg">{formatDate(appData.date_of_birth)}</div>
               </div>

               <div className="field-row">
                  <label>Permanent Address</label>
                  <div className="data-text">{appData.permanent_address}</div>
               </div>
            </div>

            {/* COLUMN 2: FLOATING WIDGETS */}
            <div className="widgets-column">
                
                {/* Widget A: Status */}
                <div className={`card widget status-widget ${appData.is_draft ? 'draft' : appData.application_status.toLowerCase()}`}>
                    <label>Current Status</label>
                    <div className="status-text">
                        {appData.is_draft ? 'DRAFT' : appData.application_status.toUpperCase()}
                    </div>
                </div>

                {/* Widget B: The Dates (Floating Window) */}
                <div className="card widget date-widget">
                    <div className="date-item">
                        <label>Submission Date</label>
                        <div className="date-val">{appData.is_draft ? 'Pending' : formatDate(appData.submitted_at)}</div>
                    </div>
                    <div className="date-divider"></div>
                    <div className="date-item">
                        <label>Application Type</label>
                        <div className="date-val type">{appData.application_type}</div>
                    </div>
                </div>

                {/* Widget C: Documents */}
                <div className="card widget docs-widget">
                    <label style={{marginBottom: '15px', display:'block'}}>Attachments</label>
                    <div className="doc-pill">
                        <span className="doc-icon">📷</span> Photo
                        {appData.photo_file_path ? <span className="tick">✔</span> : <span className="cross">✖</span>}
                    </div>
                    <div className="doc-pill">
                        <span className="doc-icon">📄</span> Document
                        {appData.pdf_file_path ? <span className="tick">✔</span> : <span className="cross">✖</span>}
                    </div>
                </div>

            </div>
        </div>

      </main>
    </div>
  );
}