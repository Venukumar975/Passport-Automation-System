import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // 1. State to hold REAL database data
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  // 2. Fetch Data from Backend on Load
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/applications/admin/all-applications');
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // 3. Filter Logic (Applied to Real Data)
  const filteredApps = applications.filter((app) => {
    // Handle null values safely
    const name = app.full_name || "";
    const idString = app.application_id ? app.application_id.toString() : "";

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idString.includes(searchTerm.toLowerCase());
                          
    const matchesFilter = filter === "ALL" || app.application_status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // 4. Stats Calculation
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.application_status === "Pending").length,
    verified: applications.filter(a => ["Approved", "Verified"].includes(a.application_status)).length
  };

  // Helper to format date nicely
  const formatDate = (isoString) => {
    if (!isoString) return "Not Submitted";
    return new Date(isoString).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
    });
  };

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="app-page">
      <AdminHeader />

      <div className="page-container admin-container">
        <div className="content-wrapper admin-wrapper">
          
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

          {/* Search & Filter */}
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Real Data Table */}
          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                    <tr key={app.application_id}>
                      <td className="font-mono">#{app.application_id}</td>
                      <td className="font-bold">{app.full_name}</td>
                      <td>{formatDate(app.submitted_at)}</td>
                      {/* This now comes from DB */}
                      <td>{app.application_type}</td> 
                      <td>
                        <span className={`status-badge ${app.application_status ? app.application_status.toLowerCase() : 'pending'}`}>
                          {app.application_status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-table-action"
                          onClick={() => navigate(`/admin-verification/${app.application_id}`)}
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