import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import DocsHeader from './DocsHeader';
import ProgressBar from './ProgressBar';

const NewApplication = () => {
  const navigate = useNavigate();
  
  // 1. UPDATE STATE: Add applicationType with a default value
  const [formData, setFormData] = useState({
    applicationType: 'New Passport', // Default matches DB
    fullName: '',
    dob: '',
    address: ''
  });

const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    // --- CHANGE: Pass data to the next page via 'state' ---
    navigate('/uploaddocs', { state: { formData } });
  };

  return (
    <>
       <Header/>
        <div className="page-container">
            <div className="content-wrapper">
                <DocsHeader/>
                <ProgressBar progress={33}/>
                
                <div className="form-card">
                <div className="card-header">
                    <h2>Personal Information</h2>
                    <p>Enter your details as they appear on official documents</p>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* 3. NEW DROPDOWN FIELD */}
                    <div className="form-group">
                        <label htmlFor="applicationType">
                            Application Type
                        </label>
                        {/* Note: No 'required' needed here because it has a default value */}
                        <select 
                            id="applicationType"
                            name="applicationType"
                            value={formData.applicationType}
                            onChange={handleChange}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '1px solid #d1d5db', 
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="New Passport">New Passport</option>
                            <option value="Renewal">Renewal</option>
                            <option value="Lost/Damaged">Lost/Damaged</option>
                            <option value="Address Change">Address Change</option>
                        </select>
                    </div>

                    {/* Full Name */}
                    <div className="form-group">
                    <label htmlFor="fullName">
                        Full Name <span className="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full legal name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required // This now works because we fixed the button!
                    />
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group">
                    <label htmlFor="dob">
                        Date of Birth <span className="required">*</span>
                    </label>
                    <input 
                        type="date" 
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    {/* Permanent Address */}
                    <div className="form-group">
                    <label htmlFor="address">
                        Permanent Address <span className="required">*</span>
                    </label>
                    <textarea 
                        id="address"
                        name="address"
                        rows="4" 
                        placeholder="Enter your complete permanent address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="button" className="btn-secondary">Save Draft</button>
                        
                        {/* 4. FIXED BUTTON: Removed onClick navigation */}
                        <button 
                            type="submit" 
                            className="btn-primary"
                        >
                            Continue
                        </button>
                    </div>

                </form>
                </div>

            </div>
        </div>
    </>
  );
};

export default NewApplication;