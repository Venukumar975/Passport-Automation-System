import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import DocsHeader from './DocsHeader';
import ProgressBar from './ProgressBar';


const NewApplication = () => {
  // Optional: Simple state management to capture inputs
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    e.preventDefault(); // Stops page refresh
    console.log('Form Data Submitted:', formData);
    // TODO: Add your API call here
  };

  

  return (
    <>
       <Header/>
        <div className="page-container">
            <div className="content-wrapper">
                <DocsHeader/>
                <ProgressBar progress={33}/>
                
                {/* The Form Card */}
                <div className="form-card">
                <div className="card-header">
                    <h2>Personal Information</h2>
                    <p>Enter your details as they appear on official documents</p>
                </div>

                {/* Actual HTML Form */}
                <form onSubmit={handleSubmit}>
                    
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
                        required
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
                    <button 
                    type="submit" 
                    className="btn-primary"
                    onClick={()=>navigate('/uploaddocs')}>
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