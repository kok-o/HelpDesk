import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Send, ArrowLeft } from 'lucide-react';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('IT');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets', { title, description, category, priority });
      navigate('/');
    } catch (err) {
      alert('Failed to create ticket: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline mb-4" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card">
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Submit a Request</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Provide details about the issue you are facing.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="label">Subject</label>
            <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Brief description of the issue" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label className="label">Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="IT">IT Support</option>
                <option value="HR">Human Resources</option>
                <option value="ACCOUNTING">Accounting</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Priority</label>
              <select className="input-field" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input-field" rows="6" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Provide as much detail as possible..." style={{ resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span>Submitting...</span> : <span><Send size={18} /> Submit Ticket</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
