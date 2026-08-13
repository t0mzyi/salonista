import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, BarChart2, Scissors, Users, Phone, UserPlus, X, Home, Store, CalendarDays } from 'lucide-react';
import { MOCK_SERVICES, MOCK_STYLISTS, MOCK_BOOKINGS } from '../../data/mockData';
import type { Stylist } from '../../data/mockData';

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */

function OwnerBottomNav({ mode }: { mode: 'solo' | 'team' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const soloTabs = [
    { id: '/', icon: Home, label: 'Home' },
    { id: `/owner/solo/dashboard`, icon: BarChart2, label: 'Analytics' },
    { id: `/owner/solo/services`, icon: Scissors, label: 'Services' },
    { id: `/owner/solo/history`, icon: CalendarDays, label: 'Bookings' },
    { id: `/owner/solo/details`, icon: Store, label: 'Details' },
  ];

  const teamTabs = [
    { id: '/', icon: Home, label: 'Home' },
    { id: `/owner/team/dashboard`, icon: BarChart2, label: 'Analytics' },
    { id: `/owner/team/services`, icon: Scissors, label: 'Services' },
    { id: `/owner/team/staff`, icon: Users, label: 'Staff' },
    { id: `/owner/team/history`, icon: CalendarDays, label: 'Bookings' },
    { id: `/owner/team/details`, icon: Store, label: 'Details' },
  ];

  const tabs = mode === 'solo' ? soloTabs : teamTabs;

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, right: 20,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: 'var(--r-pill)',
      padding: '14px 16px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    }}>
      {tabs.map(tab => {
        const active = tab.id === '/' ? path === '/' : path.startsWith(tab.id);
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? 'var(--primary)' : 'var(--ink-muted)',
            transition: 'color 0.2s',
          }}>
            <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 10, fontWeight: 600 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHARED SCREENS (used by both modes)
   ═══════════════════════════════════════════ */

function AnalyticsScreen({ mode }: { mode: 'solo' | 'team' }) {
  const [dateFilter, setDateFilter] = useState('Today');
  
  // In a real app, this would filter based on dateFilter ('Today', 'This Week', 'This Month')
  const todayBookings = MOCK_BOOKINGS.length;
  const completedBookings = MOCK_BOOKINGS.filter(b => b.status === 'completed').length;
  const inProgress = MOCK_BOOKINGS.filter(b => b.status === 'in_progress').length;
  const noShows = MOCK_BOOKINGS.filter(b => b.status === 'no_show').length;
  const todayRevenue = MOCK_BOOKINGS
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => {
      const svcTotal = b.serviceIds.reduce((t, sid) => {
        const svc = MOCK_SERVICES.find(s => s.id === sid);
        return t + (svc?.price ?? 0);
      }, 0);
      return sum + svcTotal;
    }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="ios-header" style={{ marginTop: 24, marginBottom: 16 }}>
        <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
        <div className="ios-header-title">Analytics</div>
      </div>

      <div className="scroll-x flex gap-2" style={{ marginBottom: 20 }}>
        {['Today', 'This Week', 'This Month', 'This Year'].map(lbl => (
          <button key={lbl} 
            className={`chip ${dateFilter === lbl ? 'active' : ''}`}
            onClick={() => setDateFilter(lbl)}
            style={{ 
              background: dateFilter === lbl ? 'var(--primary)' : 'var(--surface)',
              color: dateFilter === lbl ? '#fff' : 'var(--ink-muted)',
              borderColor: dateFilter === lbl ? 'var(--primary)' : 'var(--border)'
            }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Revenue card */}
      <div className="card" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '20px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.8, marginBottom: 4 }}>Revenue ({dateFilter})</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
          ₹{todayRevenue.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, opacity: 0.75, marginTop: 6 }}>
          {completedBookings} completed · {inProgress} in progress
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: 14 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{todayBookings}</div>
          <div className="caption">Total Bookings</div>
        </div>
        {mode === 'team' && (
          <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: 14 }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{MOCK_STYLISTS.length}</div>
            <div className="caption">Active Staff</div>
          </div>
        )}
        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: 14 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{MOCK_SERVICES.length}</div>
          <div className="caption">Services</div>
        </div>
        <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: 14 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: noShows > 0 ? 'var(--tag-critical-ink)' : 'var(--ink)' }}>{noShows}</div>
          <div className="caption">No-shows</div>
        </div>
      </div>
    </motion.div>
  );
}

function ServicesScreen({ mode }: { mode: 'solo' | 'team' }) {
  const [services] = useState(MOCK_SERVICES);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
        <div className="ios-header-title">Service Menu</div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <p className="body">Manage the services offered.</p>
        <button className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, gap: 4 }}>
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="flex-col" style={{ gap: 10 }}>
        {services.map(svc => (
          <div key={svc.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 16px' }}>
            <div>
              <div className="h3" style={{ fontSize: 14 }}>{svc.name}</div>
              <div className="caption" style={{ marginTop: 2 }}>{svc.durationMinutes} min</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h3" style={{ fontSize: 14, color: 'var(--primary)' }}>₹{svc.price}</div>
              <div className="flex gap-2">
                <button style={{ padding: 7, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
                  <Edit2 size={13} color="var(--ink-muted)" />
                </button>
                <button style={{ padding: 7, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--tag-critical-bg)', cursor: 'pointer', display: 'flex' }}>
                  <Trash2 size={13} color="var(--primary)" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DetailsScreen({ mode }: { mode: 'solo' | 'team' }) {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
        <div className="ios-header-title">Salon Details</div>
      </div>

      {/* Salon Info */}
      <div className="card" style={{ padding: 18 }}>
        <div className="h3" style={{ marginBottom: 12 }}>Profile</div>
        <div className="flex-col" style={{ gap: 10 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Salon Name</div>
            <input type="text" className="input-field" defaultValue="Fade & Shave Studio" />
          </div>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Address</div>
            <input type="text" className="input-field" defaultValue="Koramangala, Bangalore" />
          </div>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Opening Hours</div>
            <div className="flex gap-3 items-center">
              <input type="time" className="input-field" defaultValue="09:00" style={{ flex: 1 }} />
              <span className="caption">to</span>
              <input type="time" className="input-field" defaultValue="21:00" style={{ flex: 1 }} />
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 4 }}>Save Changes</button>
        </div>
      </div>

      {/* Subscription */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
          <div className="h3">Subscription</div>
          <span className="tag tag-ok">Active</span>
        </div>
        <div className="caption">Plan renews on 15 Sep 2026</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--primary)', marginTop: 8 }}>₹500/month</div>
      </div>

      {/* QR Code */}
      <div className="card" style={{ padding: 18, textAlign: 'center' }}>
        <div className="h3" style={{ marginBottom: 6 }}>Walk-in QR Code</div>
        <div className="caption" style={{ marginBottom: 14 }}>Print this and place at your counter.</div>
        <div style={{
          width: 120, height: 120, margin: '0 auto',
          background: 'var(--bg)', borderRadius: 'var(--r-sm)',
          border: '2px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="caption">QR Code</span>
        </div>
        <button className="btn-secondary" style={{ marginTop: 14, fontSize: 13 }}>Download QR</button>
      </div>

      {/* Account */}
      <div className="card" style={{ padding: 18 }}>
        <div className="h3" style={{ marginBottom: 12 }}>Account</div>
        <div className="flex-col" style={{ gap: 8 }}>
          {mode === 'team' && (
            <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>Change Staff PIN</button>
          )}
          <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>Contact Support</button>
          <button className="btn-secondary" style={{
            justifyContent: 'flex-start', fontSize: 13,
            color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)',
          }} onClick={() => navigate('/')}>Logout</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TEAM-ONLY: Staff Management
   ═══════════════════════════════════════════ */

function StaffManagement() {
  const [staff, setStaff] = useState<Stylist[]>(MOCK_STYLISTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddStaff = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    const newStaff: Stylist = {
      id: `chair${staff.length + 1}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      isAvailable: true,
    };
    setStaff([...staff, newStaff]);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">Owner + Staff</div>
        <div className="ios-header-title">Staff</div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <p className="body">{staff.length} staff members</p>
        <button className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: 13, gap: 4 }}
          onClick={() => setShowAddModal(true)}>
          <UserPlus size={14} /> Add Staff
        </button>
      </div>

      <div className="flex-col" style={{ gap: 10 }}>
        {staff.map(member => (
          <div key={member.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 16px' }}>
            <div className="flex items-center gap-3">
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: member.isAvailable ? 'var(--tag-ok-bg)' : 'var(--tag-warn-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border)',
              }}>
                <Users size={16} color={member.isAvailable ? 'var(--tag-ok-ink)' : 'var(--tag-warn-ink)'} />
              </div>
              <div>
                <div className="h3" style={{ fontSize: 14 }}>{member.name}</div>
                <div className="caption flex items-center gap-1" style={{ marginTop: 2 }}>
                  <Phone size={10} /> {member.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={member.isAvailable ? 'tag tag-ok' : 'tag tag-warn'}>
                {member.isAvailable ? 'Free' : 'Busy'}
              </span>
              <button onClick={() => handleRemoveStaff(member.id)} style={{
                padding: 7, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)',
                background: 'var(--tag-critical-bg)', cursor: 'pointer', display: 'flex',
              }}>
                <Trash2 size={13} color="var(--primary)" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 200, padding: 20,
            }} onClick={() => setShowAddModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)', borderRadius: 'var(--r-md)',
                padding: 20, width: '100%', maxWidth: 360,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                <div className="h2" style={{ fontSize: 18 }}>Add Staff</div>
                <button onClick={() => setShowAddModal(false)} style={{
                  padding: 6, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)',
                  background: 'var(--bg)', cursor: 'pointer', display: 'flex',
                }}>
                  <X size={14} color="var(--ink-muted)" />
                </button>
              </div>

              <div className="flex-col" style={{ gap: 12 }}>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Staff Name</div>
                  <input type="text" className="input-field" placeholder="e.g. Rahul Kumar"
                    value={newName} onChange={e => setNewName(e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Phone Number</div>
                  <input type="tel" className="input-field" placeholder="e.g. 9876543210"
                    maxLength={10} value={newPhone}
                    onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))} />
                  <div className="caption" style={{ marginTop: 4 }}>Staff will use this number to log in.</div>
                </div>
                <button className="btn-primary" style={{ marginTop: 6 }}
                  onClick={handleAddStaff} disabled={!newName.trim() || newPhone.length < 10}>
                  <UserPlus size={14} /> Add to Team
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TEAM-ONLY: Owner Queue (all chairs)
   The owner can manage ALL staff's customers
   ═══════════════════════════════════════════ */

function OwnerQueueScreen() {
  const [activeChair, setActiveChair] = useState(MOCK_STYLISTS[0].id);
  const [showWalkin, setShowWalkin] = useState(false);
  const [walkinName, setWalkinName] = useState('');

  const activeBooking = MOCK_BOOKINGS.find(b => b.stylistId === activeChair && b.status === 'in_progress');
  const nextBookings  = MOCK_BOOKINGS.filter(b => b.stylistId === activeChair && b.status === 'booked');
  const svcNames = (ids: string[]) =>
    ids.map(id => MOCK_SERVICES.find(s => s.id === id)?.name).filter(Boolean).join(' + ');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="flex justify-between items-center" style={{ marginTop: 16, marginBottom: 8 }}>
        <div className="ios-header" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="ios-header-date">Owner + Staff</div>
          <div className="ios-header-title" style={{ fontSize: 22 }}>Live Queue</div>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, gap: 4 }}
          onClick={() => setShowWalkin(true)}>
          <Plus size={14} /> Walk-in
        </button>
      </div>

      {/* Chair selector */}
      <div className="scroll-x flex gap-3" style={{ padding: '16px 0' }}>
        {MOCK_STYLISTS.map(s => {
          const count = MOCK_BOOKINGS.filter(b => b.stylistId === s.id && ['booked', 'in_progress'].includes(b.status)).length;
          const active = activeChair === s.id;
          return (
            <button key={s.id} onClick={() => setActiveChair(s.id)} style={{
              flexShrink: 0, minWidth: 120, textAlign: 'center',
              background: active ? 'var(--primary)' : 'var(--surface)',
              border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '12px', cursor: 'pointer',
              color: active ? '#fff' : 'var(--ink)',
              boxShadow: active ? '0 4px 12px rgba(217, 90, 43, 0.25)' : 'none',
              transition: 'all 0.2s',
            }}>
              <div className="h3" style={{ color: active ? '#fff' : 'var(--ink)', fontSize: 14 }}>{s.name}</div>
              <div className="caption" style={{ marginTop: 2, color: active ? 'rgba(255,255,255,0.8)' : 'var(--ink-muted)' }}>{count} queued</div>
            </button>
          );
        })}
      </div>

      {/* In Chair */}
      <div className="h3" style={{ marginBottom: 8 }}>In Chair</div>
      {activeBooking ? (
        <div className="card" style={{ background: 'var(--primary)', border: 'none', color: '#fff', marginBottom: 20 }}>
          <div className="flex justify-between items-start" style={{ marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {activeBooking.customerName}
              </div>
              <div className="body" style={{ marginTop: 2, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>{svcNames(activeBooking.serviceIds)}</div>
            </div>
          </div>
          <div className="flex gap-2" style={{ marginTop: 4 }}>
            <button className="btn-done" style={{ flex: 2, background: '#fff', color: 'var(--primary)', padding: '12px 14px', fontSize: 14 }}>✓ Complete</button>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px 14px', fontSize: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              Add
            </button>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px 14px', fontSize: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.15)' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '28px 16px', marginBottom: 16 }}>
          <div className="body" style={{ marginBottom: 12 }}>Chair is empty</div>
          {nextBookings.length > 0 && (
            <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }}>
              Call Next: {nextBookings[0].customerName}
            </button>
          )}
        </div>
      )}

      {/* Up next */}
      <div className="h3" style={{ marginBottom: 8 }}>Up Next</div>
      {nextBookings.length === 0 && <p className="body">No upcoming bookings.</p>}
      <div className="flex-col" style={{ gap: 8 }}>
        {nextBookings.map((b, i) => (
          <div key={b.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '12px 16px' }}>
            <div className="flex items-center gap-3">
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--r-sm)', flexShrink: 0,
                background: 'var(--bg)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)',
              }}>#{i + 1}</div>
              <div>
                <div className="h3" style={{ fontSize: 14 }}>{b.customerName}</div>
                <div className="caption" style={{ marginTop: 1 }}>{svcNames(b.serviceIds)}</div>
              </div>
            </div>
            <span className={b.isAppBooking ? 'tag tag-critical' : 'tag tag-ok'}>{b.isAppBooking ? 'App' : 'Walk-in'}</span>
          </div>
        ))}
      </div>

      {/* Walk-in Modal */}
      <AnimatePresence>
        {showWalkin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.45)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
            onClick={() => setShowWalkin(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: 20, width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div className="h2" style={{ marginBottom: 4, fontSize: 18 }}>Add Walk-in</div>
              <div className="caption" style={{ marginBottom: 16 }}>Add a walk-in customer to any chair.</div>
              <div className="flex-col" style={{ gap: 12 }}>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Customer Name</div>
                  <input type="text" className="input-field" placeholder="e.g. Rahul"
                    value={walkinName} onChange={e => setWalkinName(e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Service</div>
                  <select className="input-field" style={{ appearance: 'auto' }}>
                    {MOCK_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} — ₹{s.price}</option>)}
                  </select>
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Assign to Staff</div>
                  <select className="input-field" style={{ appearance: 'auto' }}>
                    {MOCK_STYLISTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <button className="btn-primary" onClick={() => { setWalkinName(''); setShowWalkin(false); }}>Add to Queue</button>
                <button className="btn-secondary" onClick={() => setShowWalkin(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SOLO-ONLY: Single Owner Queue
   Only one "chair" — the owner themselves
   ═══════════════════════════════════════════ */

function SoloQueueScreen() {
  const [showWalkin, setShowWalkin] = useState(false);
  const [walkinName, setWalkinName] = useState('');

  const myBookings = MOCK_BOOKINGS; // solo owner sees everything
  const activeBooking = myBookings.find(b => b.status === 'in_progress');
  const nextBookings = myBookings.filter(b => b.status === 'booked');
  const svcNames = (ids: string[]) =>
    ids.map(id => MOCK_SERVICES.find(s => s.id === id)?.name).filter(Boolean).join(' + ');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="flex justify-between items-center" style={{ marginTop: 16, marginBottom: 8 }}>
        <div className="ios-header" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="ios-header-date">Single Owner</div>
          <div className="ios-header-title" style={{ fontSize: 22 }}>My Queue</div>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, gap: 4 }}
          onClick={() => setShowWalkin(true)}>
          <Plus size={14} /> Walk-in
        </button>
      </div>

      {/* Current Customer */}
      <div className="h3" style={{ marginBottom: 8 }}>Current Customer</div>
      {activeBooking ? (
        <div className="card" style={{ background: 'var(--primary)', border: 'none', color: '#fff', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            {activeBooking.customerName}
          </div>
          <div className="body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 12 }}>{svcNames(activeBooking.serviceIds)}</div>
          <div className="flex gap-2" style={{ marginTop: 4 }}>
            <button className="btn-done" style={{ flex: 2, background: '#fff', color: 'var(--primary)', padding: '12px 14px', fontSize: 14 }}>✓ Complete</button>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px 14px', fontSize: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
              Add
            </button>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px 14px', fontSize: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.15)' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '28px 16px', marginBottom: 16 }}>
          <div className="body" style={{ marginBottom: 12 }}>No one in chair</div>
          {nextBookings.length > 0 && (
            <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }}>
              Call Next: {nextBookings[0].customerName}
            </button>
          )}
        </div>
      )}

      {/* Queue */}
      <div className="h3" style={{ marginBottom: 8 }}>Up Next ({nextBookings.length})</div>
      <div className="flex-col" style={{ gap: 8 }}>
        {nextBookings.map((b, i) => (
          <div key={b.id} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '12px 16px' }}>
            <div className="flex items-center gap-3">
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--r-sm)', flexShrink: 0,
                background: 'var(--bg)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--ink)',
              }}>#{i + 1}</div>
              <div>
                <div className="h3" style={{ fontSize: 14 }}>{b.customerName}</div>
                <div className="caption" style={{ marginTop: 1 }}>{svcNames(b.serviceIds)}</div>
              </div>
            </div>
            <span className={b.isAppBooking ? 'tag tag-critical' : 'tag tag-ok'}>{b.isAppBooking ? 'App' : 'Walk-in'}</span>
          </div>
        ))}
      </div>

      {/* Walk-in Modal */}
      <AnimatePresence>
        {showWalkin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowWalkin(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: 20, width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div className="h2" style={{ marginBottom: 4, fontSize: 18 }}>Add Walk-in</div>
              <div className="caption" style={{ marginBottom: 16 }}>Add a walk-in customer.</div>
              <div className="flex-col" style={{ gap: 12 }}>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Customer Name</div>
                  <input type="text" className="input-field" placeholder="e.g. Rahul"
                    value={walkinName} onChange={e => setWalkinName(e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Service</div>
                  <select className="input-field" style={{ appearance: 'auto' }}>
                    {MOCK_SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} — ₹{s.price}</option>)}
                  </select>
                </div>
                <button className="btn-primary" onClick={() => { setWalkinName(''); setShowWalkin(false); }}>Add to Queue</button>
                <button className="btn-secondary" onClick={() => setShowWalkin(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   HISTORY (Bookings) SCREEN
   ═══════════════════════════════════════════ */

function OwnerHistory({ mode }: { mode: 'solo' | 'team' }) {
  const [showLeavesModal, setShowLeavesModal] = useState(false);

  const statusColors: Record<string, string> = {
    in_progress: 'tag tag-critical', booked: 'tag tag-warn',
    completed: 'tag tag-ok', cancelled: 'tag tag-ok', no_show: 'tag tag-critical',
  };
  const statusLabels: Record<string, string> = {
    in_progress: 'In Chair', booked: 'Upcoming',
    completed: 'Done', cancelled: 'Cancelled', no_show: 'No-show',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="flex justify-between items-center" style={{ marginTop: 24, marginBottom: 16 }}>
        <div className="ios-header" style={{ marginTop: 0, marginBottom: 0 }}>
          <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
          <div className="ios-header-title">Bookings</div>
        </div>
        <button className="btn-secondary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, gap: 4, background: 'var(--tag-critical-bg)', color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)' }}
          onClick={() => setShowLeavesModal(true)}>
          Leaves
        </button>
      </div>

      <div className="scroll-x flex gap-2" style={{ marginBottom: 20 }}>
        {['All', 'Today', 'Completed', 'No-shows'].map((lbl, i) => (
          <button key={lbl} className={`chip ${i === 0 ? 'active' : ''}`}>{lbl}</button>
        ))}
      </div>

      <div className="flex-col" style={{ gap: 10 }}>
        {MOCK_BOOKINGS.map(b => {
          const svc = MOCK_SERVICES.find(s => s.id === b.serviceIds[0]);
          const stylist = MOCK_STYLISTS.find(s => s.id === b.stylistId);
          return (
            <div key={b.id} className="card" style={{ marginBottom: 0, padding: '14px 18px' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <div className="h3" style={{ fontSize: 14 }}>{b.customerName || 'Walk-in'}</div>
                <span className={statusColors[b.status] ?? 'tag'}>{statusLabels[b.status] ?? b.status}</span>
              </div>
              <div className="caption">
                {svc?.name} {mode === 'team' ? `· ${stylist?.name ?? 'Unassigned'}` : ''} · {new Date(b.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex gap-2" style={{ marginTop: 6 }}>
                <span className={b.isAppBooking ? 'tag tag-critical' : 'tag tag-ok'} style={{ fontSize: 10 }}>
                  {b.isAppBooking ? 'App' : 'Walk-in'}
                </span>
              </div>
              
              {/* Action Buttons for active bookings */}
              {(b.status === 'in_progress' || b.status === 'booked') && (
                <div className="flex gap-2" style={{ marginTop: 12 }}>
                  {b.status === 'in_progress' && (
                    <button className="btn-done" style={{ flex: 1, padding: '8px 12px', fontSize: 13, background: 'var(--tag-ok-bg)', color: 'var(--tag-ok-ink)' }}>
                      ✓ Complete
                    </button>
                  )}
                  <button className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: 13, color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)', background: 'var(--tag-critical-bg)' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Leaves Modal */}
      <AnimatePresence>
        {showLeavesModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.45)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
            onClick={() => setShowLeavesModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: 20, width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              
              <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                <div className="h2" style={{ fontSize: 18 }}>Holidays & Leaves</div>
                <button onClick={() => setShowLeavesModal(false)} style={{ padding: 6, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
                  <X size={14} color="var(--ink-muted)" />
                </button>
              </div>
              
              <div className="caption" style={{ marginBottom: 16 }}>Manage days when the shop is closed. Customers won't be able to book on these days.</div>
              
              <div className="flex-col" style={{ gap: 10 }}>
                <div className="flex justify-between items-center" style={{ padding: '12px 14px', background: 'var(--tag-critical-bg)', borderRadius: 'var(--r-sm)', border: '1px solid var(--tag-critical-ink)' }}>
                  <div>
                    <div className="h3" style={{ fontSize: 14, color: 'var(--tag-critical-ink)' }}>Mark Closed Today</div>
                    <div className="caption" style={{ color: 'var(--tag-critical-ink)', opacity: 0.8 }}>Pause all new bookings</div>
                  </div>
                  <input type="checkbox" style={{ width: 20, height: 20, accentColor: 'var(--tag-critical-ink)' }} />
                </div>

                <div style={{ marginTop: 4 }}>
                  <div className="label" style={{ marginBottom: 4 }}>Upcoming Holiday</div>
                  <div className="flex gap-2">
                    <input type="date" className="input-field" style={{ flex: 2 }} />
                    <button className="btn-secondary" style={{ flex: 1, padding: '0 12px', fontSize: 13 }}>Add</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   ROUTER
   ═══════════════════════════════════════════ */

export default function OwnerFlow() {
  const location = useLocation();
  const path = location.pathname;

  const isSolo = path.includes('/owner/solo');
  const isTeam = path.includes('/owner/team');
  const showNav = isSolo || isTeam;
  const mode = isSolo ? 'solo' : 'team';

  return (
    <>
      <Routes>
        {/* Default → redirect-style: show dashboard */}
        <Route path="/" element={<AnalyticsScreen mode="solo" />} />

        {/* Solo Owner routes */}
        <Route path="solo/dashboard" element={<AnalyticsScreen mode="solo" />} />
        <Route path="solo/queue" element={<SoloQueueScreen />} />
        <Route path="solo/services" element={<ServicesScreen mode="solo" />} />
        <Route path="solo/history" element={<OwnerHistory mode="solo" />} />
        <Route path="solo/details" element={<DetailsScreen mode="solo" />} />

        {/* Owner + Staff routes */}
        <Route path="team/dashboard" element={<AnalyticsScreen mode="team" />} />
        <Route path="team/queue" element={<OwnerQueueScreen />} />
        <Route path="team/services" element={<ServicesScreen mode="team" />} />
        <Route path="team/staff" element={<StaffManagement />} />
        <Route path="team/history" element={<OwnerHistory mode="team" />} />
        <Route path="team/details" element={<DetailsScreen mode="team" />} />
      </Routes>
      {showNav && <OwnerBottomNav mode={mode} />}
    </>
  );
}
