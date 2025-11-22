import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation

import Header from "./Header.jsx";
import DocsHeader from "./DocsHeader.jsx";
import ProgressBar from "./ProgressBar.jsx";

const UploadDocuments = ({ onSaveDraft }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get data from previous page

  // Retrieve data passed from NewApplication
  const previousFormData = location.state?.formData || {};

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [supportingDocs, setSupportingDocs] = useState(null);

  const passportPhotoInputRef = useRef(null);
  const supportingDocsInputRef = useRef(null);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // --- CHANGE: Handle Continue logic manually ---
  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!passportPhoto || !supportingDocs) {
        alert("Please upload both required documents.");
        return;
    }

    // Pass previous data AND new files to the Review page
    navigate('/reviewapplication', { 
        state: { 
            formData: previousFormData,
            files: {
                passportPhoto: passportPhoto,
                supportingDocs: supportingDocs
            }
        } 
    });
  };   

    return (
        <>
            <Header/>
            <div className="page-container">
            <div className="content-wrapper">
                <DocsHeader/>
                <ProgressBar progress={66}/>
                    <main className="upload-documents-wrapper"> 
                    
                        <div className="section-header">
                            <h1>Upload Documents</h1>
                            <p>Upload clear, recent photographs and supporting documents</p>
                        </div>

                        <form>
                            {/* Passport Photo Section */}
                            <div className="form-group">
                            <label className="upload-label">PASSPORT PHOTO <span className="required">*</span></label>
                            <div 
                                className="drop-zone"
                                onClick={() => passportPhotoInputRef.current.click()} 
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, setPassportPhoto)}
                            >
                                <input 
                                type="file" 
                                ref={passportPhotoInputRef}
                                className="hidden-file-input" 
                                accept="image/jpeg,image/png"
                                onChange={(e) => handleFileChange(e, setPassportPhoto)}
                                />
                                <div className="upload-icon">↑</div> 
                                <p className="drop-text">
                                {passportPhoto ? passportPhoto.name : 'Drop file here or click to browse'}
                                </p>
                                <p className="upload-hint">Recent color photograph (JPG or PNG, max 5MB)</p>
                                {passportPhoto && <span className="file-name">{passportPhoto.name}</span>}
                            </div>
                            </div>

                            {/* Supporting Docs Section */}
                            <div className="form-group">
                            <label className="upload-label">SUPPORTING DOCUMENTS <span className="required">*</span></label>
                            <div 
                                className="drop-zone"
                                onClick={() => supportingDocsInputRef.current.click()} 
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, setSupportingDocs)}
                            >
                                <input 
                                type="file" 
                                ref={supportingDocsInputRef}
                                className="hidden-file-input" 
                                accept=".pdf,.doc,.docx,image/jpeg,image/png"
                                onChange={(e) => handleFileChange(e, setSupportingDocs)}
                                />
                                <div className="upload-icon">↑</div>
                                <p className="drop-text">
                                {supportingDocs ? supportingDocs.name : 'Drop file here or click to browse'}
                                </p>
                                <p className="upload-hint">Birth certificate, ID proof, or other required documents (PDF or Word)</p>
                                {supportingDocs && <span className="file-name">{supportingDocs.name}</span>}
                            </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-tertiary" 
                                    onClick={() => navigate('/newapplication')}
                                >
                                    Previous
                                </button>
                            
                                <button 
                                    type="button" 
                                    className="btn-secondary save-draft"
                                    onClick={onSaveDraft}
                                >
                                    <span className="save-icon">🖫</span> Save Draft
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="btn-primary"
                                    onClick={handleContinue}
                                >Continue</button>
                            </div>
                        </form>
                    </main>
            
            </div>
            </div>
        </>
    )
}

export default UploadDocuments;