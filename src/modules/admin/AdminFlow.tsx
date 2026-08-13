import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Building2, Settings, BarChart2, ArrowRight, Home, Users, Ban } from 'lucide-react';
import { MOCK_SALONS } from '../../data/mockData';
import BackButton from '../../components/BackButton';

/* ─── Status tag for subscriptions ─── */
function SubTag({ status }: { status: string }) {
  if (status === 'active') return <span className="tag tag-ok">Active</span>;
  if (status === 'trial')  return <span className="tag tag-warn">Trial</span>;
  return                          <span className="tag tag-critical">Expired</span>;
}

/* ─── Admin Bottom Nav ─── */
function AdminBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { id: '/admin/subscriptions',  icon: CreditCard, label: 'Billing' },
    { id: '/admin/salons',   icon: Building2, label: 'Saloons' },
    { id: '/admin/users',    icon: Users, label: 'Users' },
    { id: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, right: 20,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: 'var(--r-pill)',
      padding: '16px 20px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    }}>
      {tabs.map(tab => {
        const active = path.startsWith(tab.id);
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? 'var(--primary)' : 'var(--ink-muted)',
            transition: 'color 0.2s',
          }}>
            <tab.icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 700 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Shared layout wrapper ─── */
function AdminLayout({ children, title, showBack = false }: { children: React.ReactNode; title: string, showBack?: boolean }) {
  return (
    <div className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>
      <div className="flex items-center" style={{ marginTop: 16, marginBottom: 8, height: 32 }}>
        {showBack && <BackButton />}
      </div>
      <div className="ios-header" style={{ marginBottom: 20 }}>
        <div className="ios-header-date">Admin Portal</div>
        <div className="ios-header-title">{title}</div>
      </div>
      {children}
    </div>
  );
}

/* ─── Screen 1: Admin Login ─── */
function AdminLogin() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="page-container flex-col justify-center" style={{ minHeight: '100vh', maxWidth: 420 }}>
      <div style={{ position: 'absolute', top: 40, left: 20 }}>
        <BackButton to="/" label="Home" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 'var(--r-lg)',
          background: 'var(--tag-critical-bg)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Shield size={34} color="var(--primary)" />
        </div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
          Platform Admin
        </div>
        <p className="body" style={{ marginTop: 6 }}>Founder access only.</p>
      </div>

      <div className="flex-col" style={{ gap: 16 }}>
        <input type="password" placeholder="Admin password" className="input-field" defaultValue="founder" />
        <button className="btn-primary" onClick={() => navigate('/admin/analytics')}>Login to Dashboard</button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 2: Analytics ─── */
function AdminAnalytics() {
  return (
    <AdminLayout title="Analytics">
      <div className="flex gap-3" style={{ marginBottom: 20 }}>
        <div className="card flex-col" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 34, fontWeight: 700, color: 'var(--ink)' }}>1.2k</div>
          <div className="caption">Total Users</div>
        </div>
        <div className="card flex-col" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 34, fontWeight: 700, color: 'var(--primary)' }}>48</div>
          <div className="caption">Total Saloons</div>
        </div>
      </div>
      
      <div className="card" style={{ padding: '24px' }}>
        <div className="h3" style={{ marginBottom: 16 }}>Platform Revenue</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 48, fontWeight: 700, color: 'var(--primary)' }}>₹45,000</div>
        <div className="caption" style={{ marginTop: 8 }}>From saloon subscriptions this month.</div>
      </div>

      <div className="card" style={{ padding: '24px', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)' }}>
        <p className="caption">Growth Graph Placeholder</p>
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 3: Subscription Management ─── */
function AdminSubscriptions() {
  const pending = MOCK_SALONS.filter(s => s.status === 'expired');
  const paid = MOCK_SALONS.filter(s => s.status === 'active');
  const trial = MOCK_SALONS.filter(s => s.status === 'trial');

  return (
    <AdminLayout title="Subscriptions">
      <div className="card" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>
        <div className="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Projected Revenue</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 36, fontWeight: 700, marginTop: 4 }}>₹{(MOCK_SALONS.length * 500).toLocaleString()}</div>
      </div>

      <div className="h3" style={{ marginBottom: 16, marginTop: 24 }}>Pending Payments</div>
      <div className="flex-col" style={{ gap: 12 }}>
        {pending.length === 0 && <p className="body">No pending payments.</p>}
        {pending.map(salon => (
          <div key={salon.id} className="card" style={{ marginBottom: 0, padding: 16 }}>
            <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
              <div>
                <div className="h3">{salon.name}</div>
                <div className="caption" style={{ color: 'var(--tag-critical-ink)' }}>Expired: {new Date(salon.subscriptionEnd).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
            <button className="btn-secondary" style={{ width: '100%', fontSize: 14, padding: '10px' }}>
              Mark Paid (₹500)
            </button>
          </div>
        ))}
      </div>

      <div className="h3" style={{ marginBottom: 16, marginTop: 32 }}>Active Subscriptions</div>
      <div className="flex-col" style={{ gap: 12 }}>
        {paid.map(salon => (
          <div key={salon.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '16px 20px' }}>
            <div>
              <div className="h3">{salon.name}</div>
              <div className="caption">Renews: {new Date(salon.subscriptionEnd).toLocaleDateString('en-IN')}</div>
            </div>
            <span className="tag tag-ok">Paid</span>
          </div>
        ))}
      </div>

      <div className="h3" style={{ marginBottom: 16, marginTop: 32 }}>Trial</div>
      <div className="flex-col" style={{ gap: 12 }}>
        {trial.map(salon => (
          <div key={salon.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '16px 20px' }}>
            <div>
              <div className="h3">{salon.name}</div>
              <div className="caption">Ends: {new Date(salon.subscriptionEnd).toLocaleDateString('en-IN')}</div>
            </div>
            <span className="tag tag-warn">Trial</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 4: Saloons ─── */
function AdminSalons() {
  const navigate = useNavigate();
  return (
    <AdminLayout title="Saloons">
      <div className="flex-col" style={{ gap: 12, marginBottom: 32 }}>
        {MOCK_SALONS.map(salon => (
          <div key={salon.id} className="card interactive flex justify-between items-center"
            style={{ marginBottom: 0, padding: '20px' }} onClick={() => navigate(`/admin/salons/${salon.id}`)}>
            <div>
              <div className="h3" style={{ fontSize: 16 }}>{salon.name}</div>
              <div className="caption" style={{ marginTop: 4 }}>{salon.address}</div>
            </div>
            <div className="flex items-center gap-4">
              <SubTag status={salon.status} />
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={16} color="var(--primary)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 5: User Management ─── */
function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Aman Singh',  phone: '9876543210', bookings: 4, noShows: 0, blocked: false },
    { id: 'u2', name: 'Karan Mehra', phone: '8765432109', bookings: 1, noShows: 1, blocked: false },
    { id: 'u3', name: 'Rohan Desai', phone: '7654321098', bookings: 6, noShows: 0, blocked: false },
    { id: 'u4', name: 'Priya Sharma', phone: '6543210987', bookings: 2, noShows: 3, blocked: true },
  ]);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const toggleBlock = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u));
  };

  return (
    <AdminLayout title="Users">
      <div style={{ marginBottom: 16 }}>
        <input type="search" placeholder="Search by name or phone…" className="input-field"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="caption" style={{ marginBottom: 16 }}>{filtered.length} customers found</div>
      <div className="flex-col" style={{ gap: 12 }}>
        {filtered.map(c => (
          <div key={c.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 18px', opacity: c.blocked ? 0.6 : 1 }}>
            <div>
              <div className="h3" style={{ fontSize: 15 }}>{c.name}</div>
              <div className="caption" style={{ marginTop: 2 }}>{c.phone}</div>
              <div className="flex gap-2" style={{ marginTop: 6 }}>
                <span className="tag tag-ok">{c.bookings} bookings</span>
                {c.noShows > 0 && <span className="tag tag-warn">{c.noShows} no-shows</span>}
                {c.blocked && <span className="tag tag-critical">Blocked</span>}
              </div>
            </div>
            <button
              onClick={() => toggleBlock(c.id)}
              style={{
                padding: 8, borderRadius: 'var(--r-sm)',
                border: `1px solid ${c.blocked ? 'var(--tag-ok-ink)' : 'var(--tag-critical-ink)'}`,
                background: c.blocked ? 'var(--tag-ok-bg)' : 'var(--tag-critical-bg)',
                cursor: 'pointer', display: 'flex', transition: 'all 0.2s',
              }}>
              <Ban size={16} color={c.blocked ? 'var(--tag-ok-ink)' : 'var(--tag-critical-ink)'} />
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 6: Settings ─── */
function AdminSettings() {
  return (
    <AdminLayout title="Settings">
      <div className="card" style={{ padding: 24 }}>
        <div className="h3" style={{ marginBottom: 16 }}>Platform Controls</div>
        <div className="flex-col" style={{ gap: 12 }}>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>App Configurations</button>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>Admin Users</button>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)' }}>Logout</button>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─── Router ─── */
export default function AdminFlow() {
  const location = useLocation();
  const showNav = location.pathname !== '/admin' && location.pathname !== '/admin/';

  return (
    <>
      <Routes>
        <Route path="/"              element={<AdminLogin />} />
        <Route path="/analytics"     element={<AdminAnalytics />} />
        <Route path="/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/salons"        element={<AdminSalons />} />
        <Route path="/users"         element={<AdminUsers />} />
        <Route path="/settings"      element={<AdminSettings />} />
        {/* Fallback to analytics if logged in */}
        <Route path="*"              element={<Navigate to="/admin/analytics" />} />
      </Routes>
      {showNav && <AdminBottomNav />}
    </>
  );
}
