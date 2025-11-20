import React, { useState, useRef, use } from "react"; // Added useRef here
import { useNavigate } from "react-router-dom";

import Header from "./Header.jsx";
import DocsHeader from "./DocsHeader.jsx";
import ProgressBar from "./ProgressBar.jsx";


const UploadDocuments = ({ onContinue, onSaveDraft, onPrevious }) => {
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [supportingDocs, setSupportingDocs] = useState(null);

  // Refs for programmatic click
  const passportPhotoInputRef = useRef(null);
  const supportingDocsInputRef = useRef(null);
  const navigate = useNavigate();
  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.stopPropagation();
  };

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Passport Photo:', passportPhoto);
    console.log('Supporting Documents:', supportingDocs);
    // Call the parent component's continue handler
    if (onContinue) {
      onContinue({ passportPhoto, supportingDocs });
    }
  };   
    return (
        <>
            <Header/>
            <div className="page-container">
            <div className="content-wrapper">
                <DocsHeader/>
                <ProgressBar progress={66}/>
                    <main className="upload-documents-wrapper"> 
                    
                    {/* Page Title */}
                            <div className="section-header">
                                <h1>Upload Documents</h1>
                                <p>Upload clear, recent photographs and supporting documents</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Passport Photo Upload Section */}
                                <div className="form-group">
                                <label className="upload-label">PASSPORT PHOTO <span className="required">*</span></label>
                                <div 
                                    className="drop-zone"
                                    onClick={() => passportPhotoInputRef.current.click()} // Click to open file dialog
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, setPassportPhoto)}
                                >
                                    <input 
                                    type="file" 
                                    ref={passportPhotoInputRef}
                                    className="hidden-file-input" // Hide the default input
                                    accept="image/jpeg,image/png"
                                    onChange={(e) => handleFileChange(e, setPassportPhoto)}
                                    />
                                    <div className="upload-icon">↑</div> {/* Unicode arrow for simple icon */}
                                    <p className="drop-text">
                                    {passportPhoto ? passportPhoto.name : 'Drop file here or click to browse'}
                                    </p>
                                    <p className="upload-hint">Recent color photograph (JPG or PNG, max 5MB)</p>
                                    {passportPhoto && <span className="file-name">{passportPhoto.name}</span>}
                                </div>
                                </div>

                                {/* Supporting Documents Upload Section */}
                                <div className="form-group">
                                <label className="upload-label">SUPPORTING DOCUMENTS <span className="required">*</span></label>
                                <div 
                                    className="drop-zone"
                                    onClick={() => supportingDocsInputRef.current.click()} // Click to open file dialog
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, setSupportingDocs)}
                                >
                                    <input 
                                    type="file" 
                                    ref={supportingDocsInputRef}
                                    className="hidden-file-input" // Hide the default input
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

                                {/* Action Buttons */}
                                <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-tertiary" // New style for "Previous"
                                    onClick={() => navigate('/newapplication')}
                                >
                                    Previous
                                </button>
                            {/* Should add functionality to draft application */}
                                <button 
                                    type="button" 
                                    className="btn-secondary save-draft" // Added 'save-draft' for specific styling
                                    onClick={onSaveDraft}
                                >
                                    <span className="save-icon">🖫</span> Save Draft
                                </button>
                                <button 
                                type="submit" 
                                className="btn-primary"
                                onClick={()=>navigate('/reviewapplication')}
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