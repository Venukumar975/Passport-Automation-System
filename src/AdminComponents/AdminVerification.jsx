import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminVerification = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminComment, setAdminComment] = useState("");
  const [status, setStatus] = useState("PENDING");

  // --- HELPER: Fixes File Paths (Windows \ -> URL /) ---
  const getFileUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.replace(/\\/g, "/"); 
    return `http://localhost:3001/${cleanPath}`; 
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/applications/admin/view/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();

        // 1. EXTRACT PHOTO
        const photoUrl = getFileUrl(data.photo_file_path);

        // 2. EXTRACT DOCUMENTS (Excluding photo)
        const docs = [];
        if (data.pdf_file_path) {
            docs.push({ 
                name: "Supporting Document", 
                type: "PDF / Document", 
                path: getFileUrl(data.pdf_file_path)
            });
        }

        const formattedData = {
            id: `APP-${data.application_id}`,
            fullName: data.full_name,
            dob: new Date(data.date_of_birth).toLocaleDateString("en-GB"),
            email: data.email,
            address: data.permanent_address,
            photo: photoUrl, // Store photo separately
            documents: docs, // Store other docs list
            dbStatus: data.application_status
        };

        setApplicationData(formattedData);
        setStatus(data.application_status);
        if (data.admin_remarks) setAdminComment(data.admin_remarks);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleAction = async (decision) => {
    if (decision === "REJECTED" && !adminComment.trim()) {
        alert("Please provide a rejection reason in the comments.");
        return;
    }

    try {
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
            
            <div className="doc-grid" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                
                {/* 1. APPLICANT PHOTO SECTION (Static, Not Clickable) */}
                <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #eee'
                }}>
                    <div style={{
                        width: '150px',
                        height: '200px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#f0f0f0',
                        marginBottom: '10px'
                    }}>
                        {applicationData.photo ? (
                            <img 
                                src={applicationData.photo} 
                                alt="Applicant" 
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        ) : (
                            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>
                                No Photo
                            </div>
                        )}
                    </div>
                    <span style={{fontWeight: 'bold', color: '#555'}}>Applicant Photo</span>
                </div>

                {/* 2. SUPPORTING DOCUMENTS LIST (Clickable) */}
                <div>
                    <h3 style={{fontSize: '1rem', marginBottom: '10px', color: '#444'}}>Documents</h3>
                    
                    {applicationData.documents.length === 0 && (
                        <p style={{color:'#888', fontStyle:'italic'}}>No supporting documents.</p>
                    )}

                    {applicationData.documents.map((doc, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            marginBottom: '10px'
                        }}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <span style={{fontSize: '1.5rem'}}>📄</span>
                                <div>
                                    <div style={{fontWeight:'600', fontSize:'0.9rem'}}>{doc.name}</div>
                                    <div style={{fontSize:'0.8rem', color:'#666'}}>{doc.type}</div>
                                </div>
                            </div>
                            
                            <a 
                                href={doc.path} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #ddd',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    color: '#333',
                                    fontWeight: '500'
                                }}
                            >
                                View Document ↗
                            </a>
                        </div>
                    ))}
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminVerification;