import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import  LoginPage  from './components/LoginPage';
import  Register  from './components/Register';
import Applications from './components/Applications';
import NewApplication from './components/NewApplication.jsx';
import UploadDocs from './components/UploadDocuments.jsx';
export default function App(){
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage/>} />
				<Route path="/login" element={<LoginPage/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/applications" element={<Applications/>} />
				<Route path="/newapplication" element={<NewApplication/>} />
				<Route path="/uploaddocs" element={<UploadDocs/>} />

			</Routes>
		</BrowserRouter>
	);
}
