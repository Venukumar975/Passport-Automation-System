import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import ProgressBar from "./ProgressBar.jsx";
import DocsHeader from "./DocsHeader.jsx";


const ReviewApplication = () => {
  const navigate = useNavigate();

  // Mock data matching your screenshot (In a real app, verify this from Context/State)
  const formData = {
    fullName: "abcdefgh ijklmnop",
    dob: "21/11/2025",
    address: "kvsd skf d, sk\nlksdkd $ ldm vda",
    photoName: "activity-diagram-passport-automation-sys.png",
    docName: "DecisionTree.pdf"
  };

  const handleSubmit = () => {
    console.log("Application Submitted!");
    // Navigate to success page or dashboard
    // navigate('/success'); 
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="content-wrapper">
          <DocsHeader/>
          {/* Step 3 of 3 */}
          <ProgressBar progress={100} />

          <main className="review-wrapper">
            
            {/* Page Title */}
            <div className="section-header">
              <h1>Review & Submit</h1>
              <p>Please review all information before submitting</p>
            </div>

            <div className="review-content">
              
              {/* Personal Details Section */}
              <div className="review-group">
                <label>FULL NAME</label>
                <div className="review-value">{formData.fullName}</div>
              </div>

              <div className="review-group">
                <label>DATE OF BIRTH</label>
                <div className="review-value">{formData.dob}</div>
              </div>

              <div className="review-group">
                <label>PERMANENT ADDRESS</label>
                <div className="review-value address-text">{formData.address}</div>
              </div>

              {/* Documents Section */}
              <div className="review-group">
                <label>DOCUMENTS</label>
                <div className="review-value doc-list">
                  <p><span className="doc-label">Photo:</span> {formData.photoName}</p>
                  <p><span className="doc-label">Supporting Document:</span> {formData.docName}</p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-tertiary"
                onClick={() => navigate('/uploaddocs')} // Go back to Step 2
              >
                Previous
              </button>
              
              <button
                type="button"
                className="btn-primary submit-btn"
                onClick={handleSubmit}
              >
                <span className="submit-icon">➤</span> Submit Application
              </button>
            </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default ReviewApplication;