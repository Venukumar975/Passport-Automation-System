import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import  LoginPage  from './components/LoginPage';
import  Register  from './components/Register';
import UserDashboard from './components/UserDashboard.jsx';
import NewApplication from './components/NewApplication.jsx';
import UploadDocs from './components/UploadDocuments.jsx';
import ReviewApplication from './components/ReviewApplication.jsx';

import AdminDashboard from './AdminComponents/AdminDashboard.jsx';
import AdminVerification from './AdminComponents/AdminVerification.jsx';

export default function App(){
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage/>} />
				<Route path="/login" element={<LoginPage/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/applications" element={<UserDashboard/>} />
				<Route path="/newapplication" element={<NewApplication/>} />
				<Route path="/uploaddocs" element={<UploadDocs/>} />
                <Route path="/reviewapplication" element={<ReviewApplication/>} />


				<Route path="/admin-dashboard" element={<AdminDashboard/>} />
				<Route path="/admin-verification" element={<AdminVerification/>} />

			</Routes>
		</BrowserRouter>
	);
}
