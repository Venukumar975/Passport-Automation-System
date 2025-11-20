import React from "react";

export default function ProgressBar({ progress }){
    return (
        <>
            <div className="progress-section">
                    <div className="progress-labels">
                        <span className="step-current">Step 1 of 3</span>
                        <span className="step-name">Personal Details</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style = {{width : `${progress}%`}}></div>
                    </div>
            </div>

        
        
        </>
    )
}