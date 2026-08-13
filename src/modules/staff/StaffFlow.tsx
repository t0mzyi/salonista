import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart2, CalendarDays, Scissors, User } from 'lucide-react';
import { MOCK_STYLISTS, MOCK_BOOKINGS, MOCK_SERVICES } from '../../data/mockData';
import BackButton from '../../components/BackButton';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -18 },
};
const pageTransition: any = { type: 'tween', ease: 'anticipate', duration: 0.26 };



/* ─── Staff Bottom Nav ─── */
function StaffBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: '/staff/dashboard', icon: CalendarDays, label: 'Queue' },
    { id: '/staff/services',  icon: Scissors, label: 'Services' },
    { id: '/staff/summary',   icon: BarChart2, label: 'Analytics' },
    { id: '/user',            icon: User, label: 'User (Temp)' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '16px 20px calc(16px + env(safe-area-inset-bottom))',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 100,
      boxShadow: 'var(--shadow-nav)',
    }}>
      {tabs.map(tab => {
        // Highlight logic
        const active = path === tab.id;
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? 'var(--primary)' : 'var(--ink-muted)',
            transition: 'color 0.2s',
          }}>
            <tab.icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 700 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Screen 1: Staff Login ─── */
function StaffLogin() {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container flex-col justify-center" style={{ minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: 40, left: 20 }}>
        <BackButton to="/" label="Home" />
      </div>

      <div className="ios-header text-center">
        <div className="ios-header-date">Fade & Shave Studio</div>
        <div className="ios-header-title">Staff Portal</div>
      </div>

      <div className="card" style={{ marginTop: 8 }}>
        <div className="flex-col" style={{ gap: 12 }}>
          <input type="text" placeholder="Salon PIN" className="input-field" defaultValue="1234" />
          <button className="btn-primary" onClick={() => navigate('/staff/dashboard')}>
            Access Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Screen 2: Live Queue Dashboard ─── */
function QueueDashboard() {
  const [activeChair, setActiveChair] = useState(MOCK_STYLISTS[0].id);
  const [showAddService, setShowAddService] = useState(false);

  const activeBooking = MOCK_BOOKINGS.find(b => b.stylistId === activeChair && b.status === 'in_progress');
  const nextBookings  = MOCK_BOOKINGS.filter(b => b.stylistId === activeChair && b.status === 'booked');

  const svcNames = (ids: string[]) =>
    ids.map(id => MOCK_SERVICES.find(s => s.id === id)?.name).filter(Boolean).join(' + ');

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container" style={{ maxWidth: 800 }}>

      {/* Top row */}
      <div className="flex justify-between items-center" style={{ marginTop: 16, marginBottom: 8 }}>
        <BackButton to="/staff" label="Exit" />
      </div>

      <div className="ios-header" style={{ marginBottom: 20 }}>
        <div className="ios-header-title">Live Queue</div>
      </div>

      {/* Chair selector */}
      <div className="scroll-x flex gap-3" style={{
        margin: '0 calc(-1*var(--page-h-pad))', padding: '0 var(--page-h-pad)', paddingBottom: 16
      }}>
        {MOCK_STYLISTS.map(s => {
          const count = MOCK_BOOKINGS.filter(b => b.stylistId === s.id && ['booked', 'in_progress'].includes(b.status)).length;
          const active = activeChair === s.id;
          return (
            <button key={s.id} onClick={() => setActiveChair(s.id)} style={{
              flexShrink: 0, minWidth: 140, textAlign: 'center',
              background: active ? 'var(--primary)' : 'var(--surface)',
              border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '16px', cursor: 'pointer',
              color: active ? '#fff' : 'var(--ink)',
              boxShadow: active ? '0 4px 12px rgba(217, 90, 43, 0.25)' : 'none',
              transition: 'all 0.2s',
            }}>
              <div className="h3" style={{ color: active ? '#fff' : 'var(--ink)' }}>{s.name.split(' ')[0]}</div>
              <div className="caption" style={{ marginTop: 4, color: active ? 'rgba(255,255,255,0.8)' : 'var(--ink-muted)' }}>{count} queued</div>
            </button>
          );
        })}
      </div>

      {/* In Chair */}
      <div className="h3" style={{ marginBottom: 12 }}>In Chair</div>
      {activeBooking ? (
        <div className="card" style={{ 
          background: 'var(--primary)', border: 'none', marginBottom: 28,
          boxShadow: '0 8px 24px rgba(217, 90, 43, 0.3)',
          color: '#fff'
        }}>
          <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 700, color: '#fff' }}>
                {activeBooking.customerName}
              </div>
              <div className="body" style={{ marginTop: 4, color: 'rgba(255,255,255,0.9)' }}>{svcNames(activeBooking.serviceIds)}</div>
            </div>
            <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 'var(--r-pill)' }}>
              <div className="caption" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Est. finish</div>
              <div className="h3" style={{ color: '#fff' }}>10:45 AM</div>
            </div>
          </div>

          <div className="divider" style={{ background: 'rgba(255,255,255,0.2)', margin: '20px 0' }} />

          {/* SEPARATE Mark done + Call next — spec requirement */}
          <div className="flex gap-3" style={{ marginTop: 4 }}>
            <button className="btn-done" style={{ flex: 2, background: '#fff', color: 'var(--primary)' }}>✓ Mark Done</button>
            <button className="btn-secondary" style={{ flex: 1, padding: '14px 16px', fontSize: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
              onClick={() => setShowAddService(true)}>
              <Plus size={16} style={{ marginRight: 4 }} /> Add
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '40px 20px', marginBottom: 24 }}>
          <div className="body" style={{ marginBottom: 16 }}>Chair is empty</div>
          {nextBookings.length > 0 && (
            <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }}>
              Call Next: {nextBookings[0].customerName}
            </button>
          )}
        </div>
      )}

      {/* Up next */}
      <div className="h3" style={{ marginBottom: 12 }}>Up Next</div>
      {nextBookings.length === 0 && <p className="body">No upcoming bookings.</p>}
      <div className="flex-col" style={{ gap: 10 }}>
        {nextBookings.map((b, i) => (
          <div key={b.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '16px 20px' }}>
            <div className="flex items-center gap-4">
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--r-md)', flexShrink: 0,
                background: 'var(--bg)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 18, color: 'var(--ink)',
              }}>#{i + 1}</div>
              <div>
                <div className="h3" style={{ fontSize: 16 }}>{b.customerName}</div>
                <div className="caption" style={{ marginTop: 2 }}>{svcNames(b.serviceIds)}</div>
              </div>
            </div>
            <span className={b.isAppBooking ? 'tag tag-critical' : 'tag tag-ok'} style={{ padding: '6px 12px' }}>
              {b.isAppBooking ? 'App' : 'Walk-in'}
            </span>
          </div>
        ))}
      </div>

      {/* Call Next button — separate from Mark Done per spec */}
      {activeBooking && nextBookings.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <button className="btn-secondary">
            Call Next: {nextBookings[0].customerName}
          </button>
        </div>
      )}

      {/* Add Service modal */}
      <AnimatePresence>
        {showAddService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.45)', zIndex: 100,
              display: 'flex', alignItems: 'flex-end',
            }}
            onClick={() => setShowAddService(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              style={{
                background: 'var(--bg)', width: '100%', padding: 24,
                borderTopLeftRadius: 24, borderTopRightRadius: 24,
                borderTop: '1px solid var(--border)',
              }}
              onClick={e => e.stopPropagation()}>
              <div className="h2" style={{ marginBottom: 20 }}>Add a Service</div>
              <div className="flex-col" style={{ gap: 10 }}>
                {MOCK_SERVICES.map(s => (
                  <button key={s.id} className="card flex justify-between items-center interactive"
                    style={{ marginBottom: 0 }} onClick={() => setShowAddService(false)}>
                    <div>
                      <div className="h3">{s.name}</div>
                      <div className="caption">+{s.durationMinutes} min to booking</div>
                    </div>
                    <div className="h3" style={{ color: 'var(--primary)' }}>₹{s.price}</div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn-secondary" onClick={() => setShowAddService(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Screen 3: Daily Summary ─── */
function DailySummary() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <div style={{ marginTop: 16 }}>
        <BackButton />
      </div>
      <div className="ios-header">
        <div className="ios-header-title">Daily Summary</div>
      </div>

      {/* App booking value hero */}
      <div className="card" style={{
        background: 'var(--primary)', border: 'none', marginBottom: 16,
      }}>
        <div className="label" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>App Booking Value</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          ₹1,800
        </div>
        <div className="caption" style={{ color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>
          App-driven only — not total salon revenue
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3" style={{ marginBottom: 24 }}>
        <div className="card flex-col" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 700, color: 'var(--ink)' }}>12</div>
          <div className="caption">Completed</div>
        </div>
        <div className="card flex-col" style={{ flex: 1, marginBottom: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 700, color: 'var(--primary)' }}>2</div>
          <div className="caption">No-shows</div>
        </div>
      </div>

      {/* Completed bookings list */}
      <div className="h3" style={{ marginBottom: 12 }}>Completed Today</div>
      <div className="flex-col" style={{ gap: 10 }}>
        {MOCK_BOOKINGS.filter(b => b.status === 'completed').map(b => {
          const svc = MOCK_SERVICES.find(s => s.id === b.serviceIds[0]);
          return (
            <div key={b.id} className="card flex justify-between items-center" style={{ marginBottom: 0 }}>
              <div>
                <div className="h3">{b.customerName}</div>
                <div className="caption">{svc?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="h3">₹{svc?.price}</div>
                <span className="tag tag-ok" style={{ marginTop: 4 }}>Paid</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Screen 4: Services Management (Dummy) ─── */
function StaffServices() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">Your Offerings</div>
        <div className="ios-header-title">Services</div>
      </div>
      <p className="body" style={{ marginBottom: 24 }}>Manage the services you offer on Salonista.</p>
      
      <div className="flex-col" style={{ gap: 12 }}>
        {MOCK_SERVICES.map(s => (
          <div key={s.id} className="card flex justify-between items-center" style={{ marginBottom: 0 }}>
            <div>
              <div className="h3">{s.name}</div>
              <div className="caption">{s.durationMinutes} mins</div>
            </div>
            <div className="h3" style={{ color: 'var(--primary)' }}>₹{s.price}</div>
          </div>
        ))}
      </div>
      <button className="btn-secondary" style={{ marginTop: 24 }}>+ Add New Service</button>
    </motion.div>
  );
}

/* ─── Router ─── */
export default function StaffFlow() {
  const location = useLocation();
  const showNav = ['/staff/dashboard', '/staff/summary', '/staff/services'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/"         element={<StaffLogin />} />
        <Route path="dashboard" element={<QueueDashboard />} />
        <Route path="summary"   element={<DailySummary />} />
        <Route path="services"  element={<StaffServices />} />
      </Routes>
      {showNav && <StaffBottomNav />}
    </>
  );
}
