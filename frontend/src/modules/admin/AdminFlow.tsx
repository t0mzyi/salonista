import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Building2, Settings, BarChart2, ArrowRight, Home, Users, Ban } from 'lucide-react';
import BackButton from '../../components/BackButton';



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
function AdminLayout({ children, title, backTo, backLabel }: { children: React.ReactNode; title: string; backTo?: string; backLabel?: string }) {
  return (
    <div className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <BackButton to={backTo} label={backLabel || 'Back'} />
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

/* ─── Screen 2: Analytics (Dynamic from Database) ─── */
function AdminAnalytics() {
  const [salons, setSalons] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/salons').then(r => r.json()),
      fetch('http://localhost:5000/api/users').then(r => r.json())
    ])
      .then(([sData, uData]) => {
        if (sData.success && Array.isArray(sData.data)) setSalons(sData.data);
        if (uData.success && Array.isArray(uData.data)) setUsers(uData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeSubscriptions = salons.filter(s => s.subscription_status === 'active' || s.subscription_status === 'paid');
  const projectedRevenue = activeSubscriptions.length * 500;

  return (
    <AdminLayout title="Analytics" backTo="/">
      {loading ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="caption">Loading platform analytics...</div>
        </div>
      ) : (
        <>
          <div className="flex gap-3" style={{ marginBottom: 20 }}>
            <div className="card flex-col" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 34, fontWeight: 700, color: 'var(--ink)' }}>
                {users.length}
              </div>
              <div className="caption">Total Users</div>
            </div>
            <div className="card flex-col" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 34, fontWeight: 700, color: 'var(--primary)' }}>
                {salons.length}
              </div>
              <div className="caption">Total Saloons</div>
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', marginBottom: 16 }}>
            <div className="h3" style={{ marginBottom: 4 }}>Platform Subscription Revenue</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 44, fontWeight: 700, color: 'var(--primary)' }}>
              ₹{projectedRevenue.toLocaleString('en-IN')}
            </div>
            <div className="caption" style={{ marginTop: 6 }}>
              From {activeSubscriptions.length} active paying saloon{activeSubscriptions.length === 1 ? '' : 's'} (₹500/mo).
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div className="h3" style={{ fontSize: 15, marginBottom: 12 }}>Salons by Status</div>
            <div className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span>Active Paying</span>
              <span className="tag tag-ok">{activeSubscriptions.length}</span>
            </div>
            <div className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span>On Free Trial</span>
              <span className="tag tag-warn">{salons.filter(s => !s.subscription_status || s.subscription_status === 'trial').length}</span>
            </div>
            <div className="flex justify-between items-center" style={{ padding: '8px 0' }}>
              <span>Suspended / Expired</span>
              <span className="tag tag-critical">{salons.filter(s => s.subscription_status === 'suspended' || s.subscription_status === 'expired').length}</span>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

/* ─── Screen 3: Subscription Management (Dynamic from Database) ─── */
function AdminSubscriptions() {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSalons = () => {
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setSalons(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const updateSubStatus = async (salonId: string, newStatus: string) => {
    setUpdatingId(salonId);
    try {
      const res = await fetch(`http://localhost:5000/api/salons/${salonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSalons(prev => prev.map(s => s.id === salonId ? { ...s, subscription_status: newStatus } : s));
      }
    } catch (e) {
      console.error('Failed to update subscription:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const activeList = salons.filter(s => s.subscription_status === 'active' || s.subscription_status === 'paid');
  const trialList = salons.filter(s => !s.subscription_status || s.subscription_status === 'trial');
  const suspendedList = salons.filter(s => s.subscription_status === 'suspended' || s.subscription_status === 'expired');

  const totalProjected = activeList.length * 500;

  return (
    <AdminLayout title="Subscriptions" backTo="/admin/analytics">
      <div className="card" style={{ background: 'var(--primary)', color: '#fff', border: 'none', marginBottom: 20 }}>
        <div className="caption" style={{ color: 'rgba(255,255,255,0.85)' }}>Total Monthly Projected Revenue</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 36, fontWeight: 700, marginTop: 4 }}>
          ₹{totalProjected.toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
          {activeList.length} of {salons.length} saloons actively subscribed @ ₹500/mo
        </div>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="caption">Loading subscriptions...</div>
        </div>
      ) : salons.length === 0 ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="h3" style={{ marginBottom: 4 }}>No Salons Registered</div>
          <div className="caption">When saloons register on Salonista, manage their billing status here.</div>
        </div>
      ) : (
        <>
          {/* Section 1: Active Subscriptions */}
          <div className="flex justify-between items-center" style={{ marginBottom: 12, marginTop: 8 }}>
            <div className="h3" style={{ margin: 0 }}>Active Subscriptions ({activeList.length})</div>
          </div>
          <div className="flex-col" style={{ gap: 10, marginBottom: 24 }}>
            {activeList.length === 0 && (
              <div className="card caption text-center" style={{ padding: 16 }}>No active paying subscriptions.</div>
            )}
            {activeList.map(salon => (
              <div key={salon.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 18px' }}>
                <div>
                  <div className="h3" style={{ fontSize: 15 }}>{salon.name}</div>
                  <div className="caption">📍 {salon.location} {salon.owner_phone ? `· 📞 ${salon.owner_phone}` : ''}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tag tag-ok">Paid (₹500)</span>
                  <button
                    disabled={updatingId === salon.id}
                    onClick={() => updateSubStatus(salon.id, 'suspended')}
                    style={{ fontSize: 11, background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Trial Salons */}
          <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
            <div className="h3" style={{ margin: 0 }}>7-Day Free Trial Saloons ({trialList.length})</div>
          </div>
          <div className="flex-col" style={{ gap: 10, marginBottom: 24 }}>
            {trialList.length === 0 && (
              <div className="card caption text-center" style={{ padding: 16 }}>No saloons currently on trial.</div>
            )}
            {trialList.map(salon => {
              const trialEnd = salon.trial_ends_at
                ? new Date(salon.trial_ends_at)
                : new Date(new Date(salon.created_at).getTime() + 7 * 24 * 60 * 60 * 1000);

              const now = new Date();
              const isTrialExpired = now > trialEnd;
              const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

              return (
                <div key={salon.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 18px' }}>
                  <div>
                    <div className="h3" style={{ fontSize: 15 }}>{salon.name}</div>
                    <div className="caption" style={{ marginTop: 2 }}>📍 {salon.location} {salon.owner_phone ? `· 📞 ${salon.owner_phone}` : ''}</div>
                    <div className="caption" style={{ marginTop: 4, color: isTrialExpired ? 'var(--tag-critical-ink)' : 'var(--ink)' }}>
                      {isTrialExpired ? (
                        <strong>⚠️ Trial Ended on {trialEnd.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                      ) : (
                        <span>⏳ Trial Ends: <strong>{trialEnd.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong> ({daysRemaining} day{daysRemaining === 1 ? '' : 's'} left)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={isTrialExpired ? 'tag tag-critical' : 'tag tag-warn'}>
                      {isTrialExpired ? 'Trial Expired' : 'Active Trial'}
                    </span>
                    <button
                      disabled={updatingId === salon.id}
                      onClick={() => updateSubStatus(salon.id, 'active')}
                      className="btn-primary"
                      style={{ fontSize: 11, padding: '6px 12px', width: 'auto' }}
                    >
                      Mark Paid (₹500)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 3: Suspended Salons */}
          <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
            <div className="h3" style={{ margin: 0 }}>Suspended Saloons ({suspendedList.length})</div>
          </div>
          <div className="flex-col" style={{ gap: 10, marginBottom: 24 }}>
            {suspendedList.length === 0 && (
              <div className="card caption text-center" style={{ padding: 16 }}>No suspended saloons.</div>
            )}
            {suspendedList.map(salon => (
              <div key={salon.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 18px' }}>
                <div>
                  <div className="h3" style={{ fontSize: 15 }}>{salon.name}</div>
                  <div className="caption">📍 {salon.location} {salon.owner_phone ? `· 📞 ${salon.owner_phone}` : ''}</div>
                  <div className="caption" style={{ color: 'var(--tag-critical-ink)', marginTop: 2 }}>Status: Suspended by Admin</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tag tag-critical">Suspended</span>
                  <button
                    disabled={updatingId === salon.id}
                    onClick={() => updateSubStatus(salon.id, 'active')}
                    className="btn-primary"
                    style={{ fontSize: 11, padding: '6px 12px', width: 'auto' }}
                  >
                    Reactivate (Paid)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

/* ─── Screen 4: Saloons (Dynamic from Database) ─── */
function AdminSalons() {
  const navigate = useNavigate();
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSalons = () => {
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setSalons(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const filtered = salons.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.owner_phone || '').includes(search)
  );

  return (
    <AdminLayout title="Saloons" backTo="/admin/analytics">
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search by salon name, city, or owner phone…"
          className="input-field"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <div className="caption">{filtered.length} registered saloons</div>
        <button
          onClick={fetchSalons}
          style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="caption">Loading registered saloons...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="h3" style={{ marginBottom: 4 }}>No Saloons Found</div>
          <div className="caption">
            {search ? 'No saloons match your search query.' : 'When owners list their saloons, they will appear here.'}
          </div>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: 12, marginBottom: 32 }}>
          {filtered.map(salon => {
            const isClosed = Boolean(salon.is_closed);
            const servicesCount = Array.isArray(salon.services) ? salon.services.length : 0;
            const coverPhoto = salon.photos?.[0];

            return (
              <div
                key={salon.id}
                className="card interactive flex justify-between items-center"
                style={{ marginBottom: 0, padding: '16px 20px', gap: 12 }}
                onClick={() => navigate(`/admin/salons/${salon.id}`)}
              >
                <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                  {coverPhoto ? (
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={coverPhoto} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--tag-warn-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={22} color="var(--accent)" />
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div className="h3" style={{ fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {salon.name}
                    </div>
                    <div className="caption" style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📍 {salon.location || 'Kerala'} {salon.owner_phone ? `· 📞 ${salon.owner_phone}` : ''}
                    </div>
                    <div className="flex gap-2" style={{ marginTop: 6 }}>
                      <span className="tag" style={{ fontSize: 10 }}>{servicesCount} service{servicesCount === 1 ? '' : 's'}</span>
                      {servicesCount === 0 ? (
                        <span className="tag tag-warn" style={{ fontSize: 10 }}>
                          Pending Services
                        </span>
                      ) : (
                        <span className={isClosed ? 'tag tag-critical' : 'tag tag-ok'} style={{ fontSize: 10 }}>
                          {isClosed ? 'Closed' : 'Active'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={16} color="var(--primary)" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

/* ─── Screen 4.5: Salon Detail (Dynamic from Database) ─── */
function AdminSalonDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const salonId = location.pathname.split('/').pop();

  const [salon, setSalon] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDetails = () => {
    if (!salonId) return;
    Promise.all([
      fetch(`http://localhost:5000/api/salons/${salonId}`).then(r => r.json()),
      fetch(`http://localhost:5000/api/bookings?salonId=${salonId}`).then(r => r.json())
    ])
      .then(([sData, bData]) => {
        if (sData.success) setSalon(sData.data);
        if (bData.success && Array.isArray(bData.data)) setBookings(bData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, [salonId]);

  const toggleSalonStatus = async () => {
    if (!salon) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_closed: !salon.is_closed })
      });
      const d = await res.json();
      if (d.success) {
        setSalon({ ...salon, is_closed: !salon.is_closed });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSalon = async () => {
    if (!salon) return;
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${salon.name}" from the database?`);
    if (!confirmed) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'DELETE'
      });
      const d = await res.json();
      if (d.success) {
        navigate('/admin/salons');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Salon Details" backTo="/admin/salons" backLabel="Saloons">
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="caption">Loading salon profile...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!salon) {
    return (
      <AdminLayout title="Not Found" backTo="/admin/salons" backLabel="Saloons">
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="h3">Salon Not Found</div>
        </div>
      </AdminLayout>
    );
  }

  const isClosed = Boolean(salon.is_closed);
  const services = Array.isArray(salon.services) ? salon.services : [];
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const revenue = completedBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  return (
    <AdminLayout title={salon.name} backTo="/admin/salons" backLabel="Saloons">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
          <div>
            <div className="h3" style={{ fontSize: 18 }}>{salon.name}</div>
            <div className="caption" style={{ marginTop: 4 }}>📍 {salon.location}</div>
            {salon.owner_phone && <div className="caption" style={{ marginTop: 2 }}>📞 Owner: {salon.owner_phone}</div>}
          </div>
          <span className={isClosed ? 'tag tag-critical' : 'tag tag-ok'}>
            {isClosed ? 'Closed' : 'Active'}
          </span>
        </div>

        {salon.description && (
          <div className="body" style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 14 }}>
            {salon.description}
          </div>
        )}

        {/* Salon Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div className="text-center">
            <div className="caption" style={{ fontSize: 11 }}>Services</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{services.length}</div>
          </div>
          <div className="text-center">
            <div className="caption" style={{ fontSize: 11 }}>Bookings</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{bookings.length}</div>
          </div>
          <div className="text-center">
            <div className="caption" style={{ fontSize: 11 }}>Revenue</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>₹{revenue.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="h3" style={{ fontSize: 15, marginBottom: 12 }}>Menu &amp; Services ({services.length})</div>
        {services.length === 0 ? (
          <div className="caption">No custom services listed yet.</div>
        ) : (
          <div className="flex-col" style={{ gap: 8 }}>
            {services.map((s: any, idx: number) => (
              <div key={s.id || idx} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: idx === services.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <span style={{ fontSize: 14 }}>{s.emoji || '✂️'} {s.name} ({s.durationMinutes || 30}m)</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>₹{s.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <div className="card">
        <div className="h3" style={{ marginBottom: 12 }}>Admin Actions</div>
        <div className="flex-col" style={{ gap: 10 }}>
          <button
            className="btn-secondary"
            disabled={isUpdating}
            onClick={toggleSalonStatus}
            style={{ width: '100%' }}
          >
            {isClosed ? '✓ Reopen Salon' : '⏸ Mark Salon as Closed'}
          </button>

          <button
            className="btn-secondary"
            disabled={isUpdating}
            onClick={handleDeleteSalon}
            style={{ width: '100%', color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)', background: 'var(--tag-critical-bg)' }}
          >
            Delete Salon Record
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 5: User Management (Dynamic from Database) ─── */
function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'Owners' | 'Customers'>('All');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch('http://localhost:5000/api/users').then(r => r.json()),
      fetch('http://localhost:5000/api/bookings').then(r => r.json()),
      fetch('http://localhost:5000/api/salons').then(r => r.json())
    ])
      .then(([usersData, bookingsData, salonsData]) => {
        if (usersData.success && Array.isArray(usersData.data)) {
          setUsers(usersData.data);
        }
        if (bookingsData.success && Array.isArray(bookingsData.data)) {
          setBookings(bookingsData.data);
        }
        if (salonsData.success && Array.isArray(salonsData.data)) {
          setSalons(salonsData.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBlock = async (id: string, currentBlocked: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_blocked: !currentBlocked })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, is_blocked: !currentBlocked } : u));
      }
    } catch (e) {
      console.error('Failed to toggle block status:', e);
    } finally {
      setTogglingId(null);
    }
  };

  const getUserMetrics = (phone: string) => {
    const userBookings = bookings.filter(b => b.customer_phone === phone);
    const total = userBookings.length;
    const completed = userBookings.filter(b => b.status === 'completed').length;
    const noShows = userBookings.filter(b => b.status === 'no_show').length;
    const cancelled = userBookings.filter(b => b.status === 'cancelled').length;
    return { total, completed, noShows, cancelled };
  };

  const getOwnedSalon = (phone: string) => {
    return salons.find(s => s.owner_phone === phone);
  };

  const filtered = users.filter(u => {
    const isOwner = Boolean(getOwnedSalon(u.phone));
    if (filterRole === 'Owners' && !isOwner) return false;
    if (filterRole === 'Customers' && isOwner) return false;

    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search);
    return matchesSearch;
  });

  const ownersCount = users.filter(u => Boolean(getOwnedSalon(u.phone))).length;
  const customersCount = users.length - ownersCount;

  return (
    <AdminLayout title="Users" backTo="/admin/analytics">
      <div style={{ marginBottom: 12 }}>
        <input
          type="search"
          placeholder="Search by name or phone…"
          className="input-field"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Role Filter Chips */}
      <div className="flex gap-2" style={{ marginBottom: 16 }}>
        {(['All', 'Owners', 'Customers'] as const).map(role => {
          const count = role === 'All' ? users.length : role === 'Owners' ? ownersCount : customersCount;
          const isActive = filterRole === role;
          return (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`chip ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--ink)',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                fontWeight: 600,
                fontSize: 12
              }}
            >
              {role} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <div className="caption">{filtered.length} users found</div>
        <button
          onClick={fetchData}
          style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="caption">Loading registered users...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="h3" style={{ marginBottom: 4 }}>No Users Found</div>
          <div className="caption">
            {search ? 'No registered users match your search.' : `No users found under "${filterRole}".`}
          </div>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: 12 }}>
          {filtered.map(c => {
            const isBlocked = Boolean(c.is_blocked);
            const ownedSalon = getOwnedSalon(c.phone);
            const isOwner = Boolean(ownedSalon);
            const metrics = getUserMetrics(c.phone);

            return (
              <div
                key={c.id}
                className="card flex justify-between items-center"
                style={{ marginBottom: 0, padding: '14px 18px', opacity: isBlocked ? 0.6 : 1 }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h3" style={{ fontSize: 15 }}>{c.name || 'Unnamed User'}</div>
                    {isOwner && (
                      <span className="tag" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontWeight: 700, fontSize: 10, padding: '2px 7px' }}>
                        👑 Owner
                      </span>
                    )}
                  </div>

                  <div className="caption" style={{ marginTop: 2 }}>
                    📞 {c.phone} {isOwner && ownedSalon && ` · 💈 ${ownedSalon.name}`}
                  </div>

                  <div className="flex gap-2" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                    {isOwner ? (
                      <span className="tag" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe', fontSize: 11 }}>
                        Salon Owner
                      </span>
                    ) : (
                      <>
                        <span className="tag tag-ok">{metrics.total} booking{metrics.total === 1 ? '' : 's'}</span>
                        {metrics.completed > 0 && <span className="tag" style={{ background: '#ecfdf5', color: '#047857' }}>{metrics.completed} completed</span>}
                        {metrics.noShows > 0 && <span className="tag tag-warn">{metrics.noShows} no-shows</span>}
                      </>
                    )}
                    {isBlocked && <span className="tag tag-critical">Blocked</span>}
                  </div>
                </div>

                <button
                  disabled={togglingId === c.id}
                  onClick={() => toggleBlock(c.id, isBlocked)}
                  title={isBlocked ? 'Unblock User' : 'Block User'}
                  style={{
                    padding: 8, borderRadius: 'var(--r-sm)',
                    border: `1.5px solid ${isBlocked ? 'var(--tag-ok-ink)' : 'var(--tag-critical-ink)'}`,
                    background: isBlocked ? 'var(--tag-ok-bg)' : 'var(--tag-critical-bg)',
                    cursor: togglingId === c.id ? 'not-allowed' : 'pointer',
                    display: 'flex', transition: 'all 0.2s', flexShrink: 0
                  }}
                >
                  <Ban size={16} color={isBlocked ? 'var(--tag-ok-ink)' : 'var(--tag-critical-ink)'} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

/* ─── Screen 6: Settings ─── */
function AdminSettings() {
  return (
    <AdminLayout title="Settings" backTo="/admin/analytics">
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
        <Route path="/salons/:id"    element={<AdminSalonDetail />} />
        <Route path="/users"         element={<AdminUsers />} />
        <Route path="/settings"      element={<AdminSettings />} />
        {/* Fallback to analytics if logged in */}
        <Route path="*"              element={<Navigate to="/admin/analytics" />} />
      </Routes>
      {showNav && <AdminBottomNav />}
    </>
  );
}

