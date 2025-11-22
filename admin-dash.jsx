import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader.jsx"; // <--- 1. Import the new Header

const MOCK_DATA = [
  { id: "APP-2025-001", name: "John Doe", date: "2025-11-20", status: "PENDING", type: "New Passport" },
  { id: "APP-2025-002", name: "Sarah Smith", date: "2025-11-19", status: "VERIFIED", type: "Renewal" },
  { id: "APP-2025-003", name: "Michael Brown", date: "2025-11-18", status: "REJECTED", type: "New Passport" },
  { id: "APP-2025-004", name: "Emily Davis", date: "2025-11-20", status: "PENDING", type: "Address Change" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Filter logic
  const filteredApps = MOCK_DATA.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "ALL" || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const stats = {
    total: MOCK_DATA.length,
    pending: MOCK_DATA.filter(a => a.status === "PENDING").length,
    verified: MOCK_DATA.filter(a => a.status === "VERIFIED").length
  };

  return (
    <div className="app-page">
      {/* 2. Use the Header Component here */}
      <AdminHeader />

      <div className="page-container admin-container">
        <div className="content-wrapper admin-wrapper">
          
          {/* 3. I removed the old <div className="admin-header"> with the logout button 
                 because it is now inside AdminHeader. 
                 I kept just the Title for the content area. */}
          <div className="dashboard-title-section" style={{ marginBottom: '20px' }}>
             <h1>Dashboard Overview</h1>
             <p style={{ color: '#6b7280' }}>Manage and verify citizen applications</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <h3>Total Applications</h3>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card yellow">
              <h3>Pending Review</h3>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="stat-card green">
              <h3>Verified</h3>
              <div className="stat-value">{stats.verified}</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="toolbar">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by Name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Applications Table */}
          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Date Submitted</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <tr key={app.id}>
                      <td className="font-mono">{app.id}</td>
                      <td className="font-bold">{app.name}</td>
                      <td>{app.date}</td>
                      <td>{app.type}</td>
                      <td>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-table-action"
                          onClick={() => navigate('/admin-verification')}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">No applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;