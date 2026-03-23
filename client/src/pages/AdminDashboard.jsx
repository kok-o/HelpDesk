import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { ShieldCheck, BarChart4, Ticket, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tickets', { params: filter ? { status: filter } : {} });
      setTickets(data);
    } catch (err) {} finally { setLoading(false); }
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status.toLowerCase()}`}>{status.replace('_', ' ')}</span>;
  };

  const getPriorityBadge = (priority) => {
    return <span className={`badge badge-${priority.toLowerCase()}`}>{priority}</span>;
  };

  return (
    <div>
      <div className="flex-space mb-4 glass-panel" style={{ padding: '16px 24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={32} color="var(--brand-primary)" />
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin & Agent Portal</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage all user queries</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" className="btn btn-outline">User View</Link>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%' }}><Ticket size={24} color="var(--brand-primary)" /></div>
            <div><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{tickets.length}</h3><p style={{ color: 'var(--text-secondary)' }}>Total Tickets</p></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%' }}><BarChart4 size={24} color="var(--status-inprog)" /></div>
            <div><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{tickets.filter(t=>t.status === 'IN_PROGRESS').length}</h3><p style={{ color: 'var(--text-secondary)' }}>In Progress</p></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%' }}><CheckCircle size={24} color="var(--status-resolved)" /></div>
            <div><h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{tickets.filter(t=>t.status === 'RESOLVED').length}</h3><p style={{ color: 'var(--text-secondary)' }}>Resolved</p></div>
        </div>
      </div>

      <div className="card">
        <div className="flex-space" style={{ marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Ticket size={20} color="var(--brand-primary)" /> All Tickets queue</h2>
          <select className="input-field" style={{ width: '200px' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {loading ? <p>Loading tickets...</p> : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map(ticket => (
              <Link to={`/ticket/${ticket.id}`} key={ticket.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'background 0.2s' }} 
                     onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                     onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div className="flex-space" style={{ marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{ticket.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {ticket.assignedAgent ? <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: '600' }}>@{ticket.assignedAgent.name}</span> : <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unassigned</span>}
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <div className="flex-space" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>By: <strong>{ticket.creator?.name}</strong> • {ticket.category}</span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
