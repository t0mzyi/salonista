import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Users, CalendarDays, ArrowRight } from 'lucide-react';
import { MOCK_SALONS, MOCK_BOOKINGS, MOCK_SERVICES } from '../../data/mockData';
import BackButton from '../../components/BackButton';

/* ─── Status tag for subscriptions ─── */
function SubTag({ status }: { status: string }) {
  if (status === 'active') return <span className="tag tag-ok">Active</span>;
  if (status === 'trial')  return <span className="tag tag-warn">Trial</span>;
  return                          <span className="tag tag-critical">Expired</span>;
}

/* ─── Shared layout wrapper ─── */
function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const navigate = useNavigate();
  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <div className="flex justify-between items-center" style={{ marginTop: 16, marginBottom: 8 }}>
        <BackButton />
        <button className="btn-secondary" style={{ width: 'auto', padding: '10px 18px', fontSize: 14 }}
          onClick={() => navigate('/admin/salons')}>
          Menu
        </button>
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
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
          Platform Admin
        </div>
        <p className="body" style={{ marginTop: 6 }}>Founder access only.</p>
      </div>

      <div className="flex-col" style={{ gap: 16 }}>
        <input type="password" placeholder="Admin password" className="input-field" defaultValue="founder" />
        <button className="btn-primary" onClick={() => navigate('/admin/salons')}>Login to Dashboard</button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 2: Salons Overview ─── */
function SalonsOverview() {
  const navigate = useNavigate();

  // Quick-access cards
  const quickLinks = [
    { label: 'Billing',      icon: CreditCard,   path: '/admin/billing' },
    { label: 'Customers',    icon: Users,         path: '/admin/users' },
    { label: 'All Bookings', icon: CalendarDays,  path: '/admin/bookings', wide: true },
  ];

  return (
    <AdminLayout title="Salons">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" style={{ width: 'auto', padding: '12px 20px', fontSize: 14 }}
          onClick={() => navigate('/admin/salons/new')}>
          + Add Salon
        </button>
      </div>

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

      {/* Quick-access grid */}
      <div className="h3" style={{ marginBottom: 12 }}>Quick access</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {quickLinks.map(lnk => (
          <button key={lnk.label}
            className="card flex items-center gap-3"
            style={{
              marginBottom: 0, textAlign: 'left', cursor: 'pointer',
              gridColumn: lnk.wide ? '1 / -1' : undefined,
            }}
            onClick={() => navigate(lnk.path)}>
            <div className="icon-box" style={{ background: 'var(--tag-ok-bg)', border: '1px solid var(--border)' }}>
              <lnk.icon size={18} color="var(--primary)" />
            </div>
            <span className="h3">{lnk.label}</span>
          </button>
        ))}
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 3: Add / Edit Salon ─── */
function SalonEdit() {
  return (
    <AdminLayout title="Edit Salon">
      <div className="card">
        <div className="flex-col" style={{ gap: 16 }}>
          {[['Salon Name', 'Fade & Shave Studio'], ['Address', 'Koramangala, Bangalore'], ['Staff PIN', '1234']].map(([label, val]) => (
            <div key={label}>
              <div className="label" style={{ marginBottom: 6 }}>{label}</div>
              <input type="text" className="input-field" defaultValue={val} />
            </div>
          ))}
          <div style={{ paddingTop: 4 }}>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 4: Billing ─── */
function Billing() {
  return (
    <AdminLayout title="Billing">
      <p className="body" style={{ marginBottom: 20 }}>
        Manually log UPI / bank transfers. This is a record — not a payment processor.
      </p>
      <div className="flex-col" style={{ gap: 10 }}>
        {MOCK_SALONS.map(salon => (
          <div key={salon.id} className="card" style={{ marginBottom: 0 }}>
            <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
              <div>
                <div className="h3">{salon.name}</div>
                <div className="caption" style={{ marginTop: 3 }}>
                  Ends: {new Date(salon.subscriptionEnd).toLocaleDateString('en-IN')}
                </div>
              </div>
              <SubTag status={salon.status} />
            </div>
            {salon.status === 'expired' && (
              <button className="btn-secondary" style={{ fontSize: 14, padding: '10px 16px' }}>
                Mark as Renewed — ₹500 received
              </button>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 5: Customers ─── */
function UsersScreen() {
  const customers = [
    { name: 'Aman Singh',  phone: '9876543210', bookings: 4, noShows: 0 },
    { name: 'Karan Mehra', phone: '8765432109', bookings: 1, noShows: 1 },
  ];

  return (
    <AdminLayout title="Customers">
      <div style={{ marginBottom: 20 }}>
        <input type="search" placeholder="Search by phone…" className="input-field" />
      </div>
      <div className="flex-col" style={{ gap: 10 }}>
        {customers.map(c => (
          <div key={c.phone} className="card flex justify-between items-center" style={{ marginBottom: 0 }}>
            <div>
              <div className="h3">{c.name}</div>
              <div className="caption" style={{ marginTop: 3 }}>{c.phone}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="h3">{c.bookings} bookings</div>
              {c.noShows > 0
                ? <span className="tag tag-warn" style={{ marginTop: 4 }}>{c.noShows} no-show</span>
                : <div className="caption" style={{ marginTop: 4 }}>0 no-shows</div>}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

/* ─── Screen 6: All Bookings ─── */
function AllBookings() {
  const statusMap: Record<string, string> = {
    in_progress: 'tag tag-critical',
    booked:      'tag tag-warn',
    completed:   'tag tag-ok',
    cancelled:   'tag tag-ok',
    no_show:     'tag tag-critical',
  };
  const statusLabel: Record<string, string> = {
    in_progress: 'In Progress',
    booked:      'Booked',
    completed:   'Done',
    cancelled:   'Cancelled',
    no_show:     'No-show',
  };

  return (
    <AdminLayout title="All Bookings">
      {/* Filter chips */}
      <div className="scroll-x flex gap-2" style={{ marginBottom: 20 }}>
        {['Today', 'Yesterday', 'All Salons'].map((lbl, i) => (
          <button key={lbl} className={`chip ${i === 0 ? 'active' : ''}`}>{lbl}</button>
        ))}
      </div>

      <div className="flex-col" style={{ gap: 10 }}>
        {MOCK_BOOKINGS.map(b => {
          const svc = MOCK_SERVICES.find(s => s.id === b.serviceIds[0]);
          return (
            <div key={b.id} className="card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-start" style={{ marginBottom: 6 }}>
                <div className="h3">{b.customerName || 'Walk-in'}</div>
                <span className={statusMap[b.status] ?? 'tag tag-ok'}>{statusLabel[b.status] ?? b.status}</span>
              </div>
              <div className="caption" style={{ marginBottom: 8 }}>
                {b.customerPhone || '—'} · {svc?.name}
              </div>
              <div style={{
                background: 'var(--tag-ok-bg)', borderRadius: 'var(--r-sm)',
                padding: '6px 10px', fontSize: 12, fontFamily: 'monospace',
                color: 'var(--ink-muted)',
              }}>
                ID: {b.id} · {new Date(b.startTime).toLocaleTimeString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

/* ─── Router ─── */
export default function AdminFlow() {
  return (
    <Routes>
      <Route path="/"          element={<AdminLogin />} />
      <Route path="/salons"    element={<SalonsOverview />} />
      <Route path="/salons/:id" element={<SalonEdit />} />
      <Route path="/billing"   element={<Billing />} />
      <Route path="/users"     element={<UsersScreen />} />
      <Route path="/bookings"  element={<AllBookings />} />
    </Routes>
  );
}
