import React from "react"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "./Header.jsx"
import DocsHeader from "./DocsHeader.jsx";
import ProgressBar from "./ProgressBar.jsx";


export default function UploadDocs(){
   
    return (
        <>
        <Header/>
        <DocsHeader/>
        <ProgressBar/>
        
        
        </>
    )
}