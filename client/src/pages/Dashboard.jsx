import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { Plus, Ticket } from 'lucide-react';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        setTickets(data);
      } catch (err) { } finally { setLoading(false); }
    };
    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status.toLowerCase()}`}>{status.replace('_', ' ')}</span>;
  };

  const getPriorityBadge = (priority) => {
    return <span className={`badge badge-${priority.toLowerCase()}`}>{priority}</span>;
  };

  return (
    <div>
      <div className="flex-space mb-4 glass-panel" style={{ padding: '16px 24px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Welcome, {user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Here are your support tickets</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/new-ticket" className="btn btn-primary"><Plus size={18} /> New Ticket</Link>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ticket size={20} color="var(--brand-primary)" /> Recent Tickets
        </h2>
        {loading ? <p>Loading tickets...</p> : tickets.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            <p>You haven't submitted any tickets yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.map(ticket => (
              <Link to={`/ticket/${ticket.id}`} key={ticket.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'background 0.2s' }} 
                     onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                     onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div className="flex-space" style={{ marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{ticket.title}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <div className="flex-space" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Category: <strong>{ticket.category}</strong></span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
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

export default Dashboard;
