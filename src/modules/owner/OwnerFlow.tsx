import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { MOCK_SERVICES } from '../../data/mockData';
import BackButton from '../../components/BackButton';

function OwnerServices() {
  const [services] = useState(MOCK_SERVICES);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800 }}>
      <div style={{ marginTop: 16 }}>
        <BackButton to="/" label="Home" />
      </div>

      <div className="ios-header">
        <div className="ios-header-date">Owner Dashboard</div>
        <div className="ios-header-title">Service Menu</div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
        <p className="body">Manage the services offered at your salon.</p>
        <button className="btn-primary" style={{ width: 'auto', padding: '12px 18px', fontSize: 14, gap: 6 }}>
          <Plus size={15} /> Add
        </button>
      </div>

      <div className="flex-col" style={{ gap: 16 }}>
        {services.map(svc => (
          <div key={svc.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '20px 24px' }}>
            <div>
              <div className="h3" style={{ fontSize: 18 }}>{svc.name}</div>
              <div className="caption" style={{ marginTop: 4 }}>{svc.durationMinutes} minutes</div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h3" style={{ fontSize: 18, color: 'var(--primary)' }}>₹{svc.price}</div>
              <div className="flex gap-2">
                <button style={{
                  padding: 10, borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
                  background: 'var(--bg)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s',
                }}>
                  <Edit2 size={16} color="var(--ink-muted)" />
                </button>
                <button style={{
                  padding: 10, borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
                  background: 'var(--tag-critical-bg)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s',
                }}>
                  <Trash2 size={16} color="var(--primary)" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function OwnerFlow() {
  return (
    <Routes>
      <Route path="/" element={<OwnerServices />} />
    </Routes>
  );
}
