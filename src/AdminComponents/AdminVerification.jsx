import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminVerification = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL param (e.g., 4)

  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminComment, setAdminComment] = useState("");
  const [status, setStatus] = useState("PENDING"); // UI Status state

  // 1. FETCH DATA FROM DB
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/applications/admin/view/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();

        // 2. CONVERT DB DATA TO UI STRUCTURE
        // We construct the 'documents' array dynamically based on what files exist
        const docs = [];
        if (data.photo_file_path) {
            docs.push({ 
                name: "passport_photo.jpg", // You can extract real name if you want
                type: "Applicant Photo", 
                path: data.photo_file_path 
            });
        }
        if (data.pdf_file_path) {
            docs.push({ 
                name: "supporting_docs.pdf", 
                type: "Supporting Document", 
                path: data.pdf_file_path 
            });
        }

        const formattedData = {
            id: `APP-${data.application_id}`,
            fullName: data.full_name,
            dob: new Date(data.date_of_birth).toLocaleDateString("en-GB"),
            email: data.email,
            address: data.permanent_address,
            documents: docs,
            dbStatus: data.application_status // Keep track of real DB status
        };

        setApplicationData(formattedData);
        setStatus(data.application_status); // Set initial status
        if (data.admin_remarks) setAdminComment(data.admin_remarks);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // 3. HANDLE ACTIONS (APPROVE / REJECT)
  const handleAction = async (decision) => {
    // decision = "VERIFIED" (Approved) or "REJECTED"
    
    if (decision === "REJECTED" && !adminComment.trim()) {
        alert("Please provide a rejection reason in the comments.");
        return;
    }

    try {
        // Determine Endpoint
        const endpoint = decision === "VERIFIED" 
            ? 'http://localhost:3001/api/applications/approve' 
            : 'http://localhost:3001/api/applications/reject';

        const body = decision === "VERIFIED" 
            ? { applicationId: id }
            : { applicationId: id, remarks: adminComment };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            setStatus(decision === "VERIFIED" ? "Approved" : "Rejected");
            alert(`Application ${decision === "VERIFIED" ? "Approved" : "Rejected"} successfully!`);
            navigate('/admin-dashboard');
        }
    } catch (error) {
        console.error("Action failed", error);
        alert("Failed to update application status");
    }
  };

  if (loading) return <div style={{padding:40, textAlign:'center'}}>Loading...</div>;
  if (!applicationData) return <div style={{padding:40, textAlign:'center'}}>Application not found</div>;

  return (
    <>
      <div className="page-container admin-container">
        <div className="content-wrapper admin-wrapper">
          
          {/* Top Navigation */}
          <button className="back-link" onClick={() => navigate('/admin-dashboard')}>
            ← Back to Dashboard
          </button>

          <div className="verification-header">
            <div>
              <h1>Application Verification</h1>
              <p className="app-id-display">Application ID: {applicationData.id}</p>
            </div>
            {/* Dynamic Status Class */}
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
                {applicationData.documents.length === 0 && <p style={{color:'#888', fontStyle:'italic'}}>No documents uploaded.</p>}
                
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="doc-preview-item">
                    <div className="doc-icon-placeholder">
                      {doc.name.endsWith('pdf') ? '📄' : '🖼️'}
                    </div>
                    <div className="doc-info">
                      <span className="doc-type">{doc.type}</span>
                      <span className="doc-name">{doc.name}</span>
                      
                      {/* View Button opens the real file URL */}
                      <a 
                        href={doc.path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-view-doc"
                        style={{textDecoration:'none', display:'inline-block', textAlign:'center'}}
                      >
                        View Document
                      </a>
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