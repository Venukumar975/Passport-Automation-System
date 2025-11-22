import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added imports
import Header from "./Header.jsx";
import ProgressBar from "./ProgressBar.jsx";
import DocsHeader from "./DocsHeader.jsx";

const ReviewApplication = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get data
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CHANGE: Retrieve data passed from previous steps ---
  const { formData, files } = location.state || { formData: {}, files: {} };

  // Setup display data (fallback to "N/A" if data is missing)
  const displayData = {
    fullName: formData.fullName || "N/A",
    dob: formData.dob || "N/A",
    address: formData.address || "N/A",
    photoName: files.passportPhoto ? files.passportPhoto.name : "Not Uploaded",
    docName: files.supportingDocs ? files.supportingDocs.name : "Not Uploaded"
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // 1. Create FormData object (required for sending files)
    const payload = new FormData();
    payload.append('fullName', formData.fullName);
    payload.append('dob', formData.dob);
    payload.append('address', formData.address);
    payload.append('applicationType', formData.applicationType); // Included type
    
    // Append files if they exist
    if (files.passportPhoto) {
        payload.append('passportPhoto', files.passportPhoto);
    }
    if (files.supportingDocs) {
        payload.append('supportingDoc', files.supportingDocs);
    }

    try {
        // 2. Send to Backend
        // Make sure the URL matches your server port (3001)
        const response = await fetch('http://localhost:3001/api/applications/submit', {
            method: 'POST',
            credentials: 'include', // Important: Sends the Session Cookie
            body: payload // Browser automatically sets Content-Type for FormData
        });

        const result = await response.json();

        if (response.ok) {
            alert("Application Submitted Successfully!");
            navigate('/applications'); // Go to Dashboard
        } else {
            alert("Failed: " + (result.error || result.message));
        }

    } catch (error) {
        console.error("Submission error:", error);
        alert("Server Error. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="content-wrapper">
          <DocsHeader/>
          <ProgressBar progress={100} />

          <main className="review-wrapper">
            
            <div className="section-header">
              <h1>Review & Submit</h1>
              <p>Please review all information before submitting</p>
            </div>

            <div className="review-content">
              
              <div className="review-group">
                <label>FULL NAME</label>
                <div className="review-value">{displayData.fullName}</div>
              </div>

              <div className="review-group">
                <label>DATE OF BIRTH</label>
                <div className="review-value">{displayData.dob}</div>
              </div>

              <div className="review-group">
                <label>PERMANENT ADDRESS</label>
                <div className="review-value address-text">{displayData.address}</div>
              </div>

              <div className="review-group">
                <label>DOCUMENTS</label>
                <div className="review-value doc-list">
                  <p><span className="doc-label">Photo:</span> {displayData.photoName}</p>
                  <p><span className="doc-label">Supporting Document:</span> {displayData.docName}</p>
                </div>
              </div>

            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-tertiary"
                onClick={() => navigate('/uploaddocs', { state: { formData } })} // Pass state back if they go back
              >
                Previous
              </button>
              
              <button
                type="button"
                className="btn-primary submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <span className="submit-icon">➤</span> {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default ReviewApplication;