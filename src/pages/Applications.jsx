import React, { useMemo, useState } from 'react';
import '../../styles/applications.css';
import '../../styles/login.css';
import Header from '../components/Header';
const SAMPLE = [
  { id: 'REQ-2024-00123', applicant: 'John Doe', status: 'VERIFIED', submittedAt: '15/1/2024' },
  { id: 'REQ-2024-00098', applicant: 'Jane Roe', status: 'APPROVED', submittedAt: '20/12/2023' },
  { id: 'REQ-2024-00145', applicant: '', status: 'DRAFT', submittedAt: null }
];

export default function Applications() {
  const [apps] = useState(SAMPLE);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return apps.filter(a => {
      const status = (a.status || '').toUpperCase();
      if (filter === 'drafts' && status !== 'DRAFT') return false;
      if (filter === 'active' && !['SUBMITTED', 'VERIFIED'].includes(status)) return false;
      if (filter === 'completed' && !['APPROVED', 'REJECTED'].includes(status)) return false;
      if (!qLower) return true;
      return (a.id && a.id.toLowerCase().includes(qLower)) || (a.applicant && a.applicant.toLowerCase().includes(qLower));
    });
  }, [apps, filter, q]);

  return (
    <div className="app-page">
      <Header showClock={true} userName={"ksoawm"} />

      <main className="container">
        <div className="top-row">
          <div className="title-block">
            <h1>My Applications</h1>
            <p className="subtitle">Track and manage your passport applications</p>
          </div>

          <div className="actions-block">
            <input value={q} onChange={e => setQ(e.target.value)} className="search" placeholder="Search by application ID or name..." />
            <button className="btn primary">+ New Application</button>
          </div>
        </div>

        <div className="tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Applications</button>
          <button className={filter === 'drafts' ? 'active' : ''} onClick={() => setFilter('drafts')}>Drafts</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <div className="cards-grid">
          {filtered.length === 0 && <div className="empty">No applications found</div>}
          {filtered.map(app => (
            <article key={app.id} className="app-card" data-status={app.status} data-id={app.id} data-name={app.applicant}>
              <div className="card-top"><div className="doc-ico">📄</div><div className={`badge ${app.status.toLowerCase()}`}>{app.status}</div></div>
              <h3 className="app-id">{app.id}</h3>
              <div className="label">APPLICANT NAME</div>
              <div className="applicant">{app.applicant || '—'}</div>
              <div className="meta">{app.submittedAt ? `Submitted on ${app.submittedAt}` : 'Not submitted'}</div>
              <div className="card-actions">
                <button className="btn outline">View Details</button>
                {app.status.toUpperCase() === 'DRAFT' && <button className="btn primary">Continue</button>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
