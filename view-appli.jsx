import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

export default function ViewApplication() {
  const { id } = useParams(); // Get ID from URL (e.g., /application/APP-10)
  const navigate = useNavigate();

  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: Extract numeric ID from "APP-10" string if necessary, 
  // or just pass the ID if your router uses clean IDs. 
  // Assuming URL is /view/10
  const cleanId = id.replace('APP-', '');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/applications/${cleanId}`, {
          method: 'GET',
          credentials: 'include' // Sends the session cookie
        });

        if (response.status === 401) {
          navigate('/login'); // Security Redirect
          return;
        }

        if (response.status === 404) {
          setError("Application not found or you do not have permission to view it.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setAppData(data);
      } catch (err) {
        setError("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [cleanId, navigate]);

  // --- Render Helpers ---

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'draft';
    return <span className={`status-pill ${s}`}>{status || 'DRAFT'}</span>;
  };

  if (loading) return <div className="loading-state">Loading application details...</div>;
  if (error) return <div className="error-state">⚠️ {error} <button onClick={() => navigate('/dashboard')}>Go Back</button></div>;

  return (
    <div className="view-page">
      {/* Reusing your Header */}
      <Header showClock={true} userName={appData.full_name ? appData.full_name.split(' ')[0] : 'User'} />

      <main className="view-container">
        
        {/* Breadcrumb / Back Navigation */}
        <button className="back-btn" onClick={() => navigate('/applications')}>
          ← Back to Dashboard
        </button>

        <div className="detail-card">
          
          {/* 1. Header Section */}
          <div className="detail-header">
            <div>
              <h1 className="page-title">Application #{appData.application_id}</h1>
              <p className="sub-text">View and track your current status</p>
            </div>
            <div className="status-container">
              {getStatusBadge(appData.is_draft ? 'DRAFT' : appData.application_status)}
            </div>
          </div>

          <hr className="divider" />

          {/* 2. Dynamic Status Feedback (Rejection/Approval/Draft) */}
          
          {/* CASE: REJECTED */}
          {appData.application_status === 'Rejected' && (
            <div className="alert-box error">
              <h3>❌ Application Rejected</h3>
              <p><strong>Reason provided by Admin:</strong></p>
              <p className="remarks">"{appData.admin_remarks || 'No specific reason provided. Please contact support.'}"</p>
              <p className="instruction">You may need to submit a new application correcting these errors.</p>
            </div>
          )}

          {/* CASE: APPROVED */}
          {appData.application_status === 'Approved' && (
            <div className="alert-box success">
              <h3>✅ Passport Approved</h3>
              <div className="expiry-row">
                <span>Passport is valid until:</span>
                <strong>{formatDate(appData.expiry_date)}</strong>
              </div>
              <p className="instruction">Your physical passport has been dispatched to your permanent address.</p>
            </div>
          )}

          {/* CASE: DRAFT */}
          {appData.is_draft === 1 && (
            <div className="alert-box info">
              <h3>📝 Application in Draft</h3>
              <p>This application has not been submitted yet.</p>
              <button className="action-btn" onClick={() => navigate(`/newapplication?resume=${appData.application_id}`)}>
                Continue Application &rarr;
              </button>
            </div>
          )}

          {/* 3. Applicant Information Grid */}
          <div className="info-grid">
            
            <div className="grid-section">
              <h3>Applicant Details</h3>
              
              <div className="field-group">
                <label>Full Name</label>
                <div className="value">{appData.full_name}</div>
              </div>

              <div className="field-group">
                <label>Date of Birth</label>
                <div className="value">{formatDate(appData.date_of_birth)}</div>
              </div>

              <div className="field-group">
                <label>Permanent Address</label>
                <div className="value address-block">{appData.permanent_address}</div>
              </div>
            </div>

            <div className="grid-section">
              <h3>Application Meta</h3>

              <div className="field-group">
                <label>Application Type</label>
                <div className="value">{appData.application_type}</div>
              </div>

              <div className="field-group">
                <label>Submission Date</label>
                <div className="value">
                  {appData.is_draft ? 'Not Submitted Yet' : formatDate(appData.submitted_at)}
                </div>
              </div>

              <div className="field-group">
                <label>Created On</label>
                <div className="value">{formatDate(appData.created_at)}</div>
              </div>
            </div>

          </div>

          {/* 4. Documents Section */}
          <div className="docs-section">
            <h3>Uploaded Documents</h3>
            <div className="docs-row">
              <div className="doc-item">
                <span className="icon">📷</span>
                <span>Passport Photo</span>
                {appData.photo_file_path ? <span className="check">✔ Uploaded</span> : <span className="missing">⚠ Missing</span>}
              </div>
              <div className="doc-item">
                <span className="icon">📄</span>
                <span>Supporting Document</span>
                {appData.pdf_file_path ? <span className="check">✔ Uploaded</span> : <span className="missing">⚠ Missing</span>}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}