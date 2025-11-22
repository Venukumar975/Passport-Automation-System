import React, { useState, useEffect, useRef } from 'react';
import LogoutButton from './LogoutButton';

export default function UserDropdown({ userName }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button 
        className="dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="avatar-circle">
            {userName.charAt(0).toUpperCase()}
        </div>
        <span className="username-text">{userName}</span>
        <span style={{ fontSize: '0.7em', marginLeft: 'auto', opacity: 0.6 }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <div className="menu-header">
            <span>Signed in as</span>
            <strong>{userName}</strong>
          </div>

          {/* Separator Line */}
          <div style={{ height: 1, background: 'var(--border-color, #eee)', margin: '4px 0' }}></div>

          {/* Example Items */}
          <button className="menu-item">
            <span>⚙️</span> Settings
          </button>
          
          {/* Logout Button */}
          <LogoutButton className="menu-item danger">
             <span>🚪</span> Sign Out
          </LogoutButton>
        </div>
      )}
    </div>
  );
}