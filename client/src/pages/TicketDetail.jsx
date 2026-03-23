import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const { data } = await api.get(`/tickets/${id}`);
      setTicket(data);
      setStatus(data.status);
    } catch (err) {
      setError('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/tickets/${id}/comments`, { content: commentText });
      setCommentText('');
      fetchTicket();
    } catch (err) {}
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.put(`/tickets/${id}/status`, { status: newStatus });
      setStatus(newStatus);
      fetchTicket();
    } catch (err) {}
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div className="card text-center" style={{ color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline mb-4" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card mb-4">
        <div className="flex-space" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{ticket.title}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className={`badge badge-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
            <span className={`badge badge-${ticket.status.toLowerCase()}`}>{ticket.status.replace('_', ' ')}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Opened by <strong>{ticket.creator?.name}</strong> on {new Date(ticket.createdAt).toLocaleString()}
        </p>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'AGENT') && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', marginTop: '16px' }}>
            <h4 style={{ marginBottom: '12px' }}>Agent Controls</h4>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label className="label" style={{ marginBottom: 0 }}>Update Status:</label>
              <select className="input-field" style={{ width: 'auto' }} value={status} onChange={handleStatusChange}>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="var(--brand-primary)" /> Comments ({ticket.comments?.length || 0})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {ticket.comments?.map(comment => (
            <div key={comment.id} style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div className="flex-space" style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.95rem' }}>{comment.author?.name} {comment.author?.role !== 'USER' && <span className="badge badge-resolved" style={{ fontSize: '0.65rem', marginLeft: '6px' }}>{comment.author?.role}</span>}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: '0.95rem' }}>{comment.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type your message..." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary"><Send size={18} /> Reply</button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
