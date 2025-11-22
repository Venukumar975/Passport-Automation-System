// frontend/src/components/LogoutButton.jsx
import React from 'react';

export default function LogoutButton({ className, children }) {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/login'; 
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // NOTE: Passing 'className' here is what applies the CSS from Dropdown.css
  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}