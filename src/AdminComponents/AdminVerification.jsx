import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminVerification = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Grabs the ID from the URL (e.g., APP-2025-001)

  // Mock Data - In a real app, you'd fetch this using the 'id'
  const applicationData = {
    id: id || "APP-2025-001",
    fullName: "John Doe",
    dob: "1995-08-15",
    email: "john.doe@example.com",
    address: "123 Main St, Apt 4B\nNew York, NY 10012",
    documents: [
      { name: "passport_photo.jpg", type: "Photo" },
      { name: "birth_certificate.pdf", type: "Proof of Birth" },
      { name: "aadhar_card_front.jpg", type: "ID Proof" }
    ]
  };

  const [status, setStatus] = useState("PENDING");
  const [adminComment, setAdminComment] = useState("");

  const handleAction = (newStatus) => {
    setStatus(newStatus);
    console.log(`Application ${id} marked as ${newStatus}`);
    alert(`Application marked as ${newStatus}`);
    // Optional: Navigate back to dashboard after action
    // navigate('/admin/dashboard'); 
  };

  return (
    <>
      <div className="page-container admin-container">
        <div className="content-wrapper admin-wrapper">
          
          {/* Top Navigation */}
          <button className="back-link" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>

          <div className="verification-header">
            <div>
              <h1>Application Verification</h1>
              <p className="app-id-display">Application ID: {applicationData.id}</p>
            </div>
            <div className={`status-tag ${status.toLowerCase()}`}>{status}</div>
          </div>

          <div className="admin-grid-layout">
            
            {/* LEFT COLUMN: Applicant Details */}
            <div className="admin-card details-card">
              <h2>Applicant Details</h2>
              
              <div className="detail-row">
                <label>Full Name</label>
                <p>{applicationData.fullName}</p>
              </div>
              <div className="detail-row">
                <label>Date of Birth</label>
                <p>{applicationData.dob}</p>
              </div>
              <div className="detail-row">
                <label>Email</label>
                <p>{applicationData.email}</p>
              </div>
              <div className="detail-row">
                <label>Permanent Address</label>
                <p className="address-block">{applicationData.address}</p>
              </div>

              {/* Admin Actions Section */}
              <div className="admin-actions-section">
                <h3>Admin Decision</h3>
                <textarea 
                  placeholder="Add comments or rejection reason..." 
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  className="admin-comment-box"
                ></textarea>
                
                <div className="decision-buttons">
                  <button 
                    className="btn-reject" 
                    onClick={() => handleAction("REJECTED")}
                  >
                    Reject Application
                  </button>
                  <button 
                    className="btn-approve" 
                    onClick={() => handleAction("VERIFIED")}
                  >
                    Approve & Verify
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Documents */}
            <div className="admin-card documents-card">
              <h2>Submitted Documents</h2>
              <div className="doc-grid">
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="doc-preview-item">
                    <div className="doc-icon-placeholder">
                      {doc.name.endsWith('pdf') ? '📄' : '🖼️'}
                    </div>
                    <div className="doc-info">
                      <span className="doc-type">{doc.type}</span>
                      <span className="doc-name">{doc.name}</span>
                      <button className="btn-view-doc">View Document</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminVerification;