import React, { useEffect, useState } from 'react';

/**
 * Reusable Header component
 * Props:
 * - title: main title text (default: 'Passport Services')
 * - subtitle: small subtitle (default: 'Official Portal')
 * - showClock: boolean to show live date/time in header (default: false)
 * - userName: string to display in the user pill
 */
export default function Header({ title = 'Passport Services', subtitle = 'Official Portal', showClock = false, userName = 'user' }) {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('pa_dark') === '1'; } catch { return false; }
    });

    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        // Apply theme
        document.documentElement.classList.toggle('dark', dark);
        try { localStorage.setItem('pa_dark', dark ? '1' : '0'); } catch (e) {}
    }, [dark]);

    useEffect(() => {
        if (!showClock) return undefined;
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, [showClock]);

    function toggleDark() { setDark(d => !d); }

    function formatDate(d) {
        return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    }

    return (
        <header className="app-header">
            <div className="brand">
                <div className="logo">
                    <img src="/icons/passport.webp" alt="Passport icon" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </div>
                <div className="brand-text">
                    <div className="name">{title}</div>
                    <div className="subtitle">{subtitle}</div>
                </div>
            </div>

            <div className="header-actions">
                {showClock && <div aria-live="polite" style={{ marginRight: 8 }}>{formatDate(now)}</div>}
                <button onClick={toggleDark} id="mode-toggle" className="icon-btn" aria-pressed={dark} title="Toggle color mode">{dark ? '🌙' : '☀️'}</button>
                <div className="user-pill">{userName} ▾</div>
            </div>
        </header>
    );
}
