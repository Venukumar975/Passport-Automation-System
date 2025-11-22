import React from 'react';

export default function AdminHeader() {

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) window.location.href = '/login'; 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="app-header admin-mode">
      
      {/* LEFT: Professional SVG Logo + Typography */}
      <div className="brand-container">
        {/* SVG Shield Icon */}
        <svg className="logo-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        
        <div className="brand-titles">
            <span className="brand-main">Passport Control</span>
            <span className="brand-sub">Official Admin Portal</span>
        </div>
      </div>

      {/* RIGHT: Control Panel */}
      <div className="admin-controls">
        
        {/* Optional Notification Bell for "Design" look */}
        <button className="icon-btn" title="Notifications">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
        </button>

        <div className="divider-vertical"></div>

        {/* Profile Section */}
        <div className="admin-profile">
            <div className="avatar-initial">A</div>
            <div className="admin-info">
                <span className="admin-name">Super Admin</span>
                <span className="admin-role">● Online</span>
            </div>
        </div>

        {/* Sleek Logout Icon Button */}
        <button className="logout-icon-btn" onClick={handleLogout} title="Sign Out">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        </button>

      </div>
    </header>
  );
}