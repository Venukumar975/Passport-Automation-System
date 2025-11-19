import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DocsHeader(){
    const navigate = useNavigate();
    const [active,setActive] = useState(false);
    
    function handleClick(){
    setActive(!active);
    setTimeout(() =>{
        navigate('/applications');
    },200

    );
  }
    return (
        <>
            <button 
                className={active ? "back-btn active" : "back-btn"}
                onClick={handleClick}>
                    ← Back to Dashboard
            </button>

            {/* Page Header */}
            <div className="header-section">
                <h1>New Passport Application</h1>
                <p>Complete all steps to submit your application</p>
            </div>

        
        </>
    )
}