import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Register from './components/Register';
import Applications from './pages/Applications';

export default function App(){
	return (
		<BrowserRouter>
			<header style={{display:'none'}} />
			<Routes>
				<Route path="/" element={<LoginPage/>} />
				<Route path="/login" element={<LoginPage/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/applications" element={<Applications/>} />
			</Routes>
		</BrowserRouter>
	);
}
