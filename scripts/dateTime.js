// dateTime.js
// Simple module that updates the #dateTime element every second.
document.addEventListener('DOMContentLoaded', () => {
    const currentTime = document.getElementById('dateTime');
    if (!currentTime) return;

    function updateDateTime() {
        const now = new Date();
        currentTime.textContent = formatDateTime(now);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});

/**
 * Format a Date into: "DD - Month YYYY hh:mm:ss AM/PM"
 * Example: 18 - November 2025 10:23:45 AM
 */
function formatDateTime(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString(undefined, { month: 'long' });
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hourStr = String(hours).padStart(2, '0');

    return `${day} ${month} ${year},  ${hourStr}:${minutes}:${seconds} ${ampm} `;
}