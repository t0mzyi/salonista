import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, BarChart2, Scissors, Users, Phone, UserPlus, X, Store, CalendarDays, Camera, MapPin, Clock } from 'lucide-react';
import { MOCK_SERVICES, MOCK_STYLISTS, MOCK_BOOKINGS } from '../../data/mockData';
import type { Stylist } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */
const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } }
};

const fadeUpItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 150 } }
};

/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */

function OwnerBottomNav({ mode, hasServices = true }: { mode: 'solo' | 'team'; hasServices?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const soloTabs = [
    { id: `/owner/solo/history`, icon: CalendarDays, label: 'Bookings' },
    { id: `/owner/solo/dashboard`, icon: BarChart2, label: 'Analytics' },
    { id: `/owner/solo/services`, icon: Scissors, label: 'Services' },
    { id: `/owner/solo/details`, icon: Store, label: 'Details' },
  ];

  const teamTabs = [
    { id: `/owner/team/history`, icon: CalendarDays, label: 'Bookings' },
    { id: `/owner/team/dashboard`, icon: BarChart2, label: 'Analytics' },
    { id: `/owner/team/services`, icon: Scissors, label: 'Services' },
    { id: `/owner/team/staff`, icon: Users, label: 'Staff' },
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
        const isServicesTab = tab.id.includes('/services');
        const isCurrent = tab.id === '/' ? path === '/' : path.startsWith(tab.id);
        const isLocked = !hasServices && !isServicesTab;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (isLocked) {
                // If 0 services and clicking another tab, re-route to services
                navigate(mode === 'solo' ? '/owner/solo/services?openAdd=true' : '/owner/team/services?openAdd=true');
              } else {
                navigate(tab.id);
              }
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: isCurrent ? 'var(--primary)' : isLocked ? 'rgba(0,0,0,0.25)' : 'var(--ink-muted)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              transition: 'color 0.2s',
              opacity: isLocked ? 0.5 : 1
            }}
          >
            <tab.icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />
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
  const [dateFilter, setDateFilter] = useState('This Week');
  
  // Advanced Mock Metrics
  const completedBookings = 42;
  const cancellations = 4;
  const noShows = 2;
  const totalBookings = completedBookings + cancellations + noShows;
  const cancelRate = Math.round((cancellations / totalBookings) * 100) || 0;
  const noShowRate = Math.round((noShows / totalBookings) * 100) || 0;
  const walkinRate = 35; // %
  const repeatRate = 68; // %

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="ios-header" style={{ marginTop: 24, marginBottom: 16 }}>
        <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
        <div className="ios-header-title">Analytics</div>
      </div>

      {/* Date Filter */}
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
      <div className="card" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginBottom: 8 }}>Total Revenue ({dateFilter})</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
          ₹{dateFilter === 'Today' ? '4,500' : dateFilter === 'This Week' ? '28,400' : '1,12,000'}
        </div>
        <div className="flex gap-4" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>App Bookings</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>₹18,000</div>
          </div>
          <div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Walk-ins</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>₹10,400</div>
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ marginBottom: 0, padding: 16 }}>
          <div className="caption" style={{ marginBottom: 4 }}>Cancellation Rate</div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: cancelRate > 15 ? 'var(--tag-critical-ink)' : 'var(--ink)' }}>{cancelRate}%</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{cancellations} bookings</div>
        </div>
        <div className="card" style={{ marginBottom: 0, padding: 16 }}>
          <div className="caption" style={{ marginBottom: 4 }}>No-show Rate</div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: noShowRate > 5 ? 'var(--tag-critical-ink)' : 'var(--ink)' }}>{noShowRate}%</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{noShows} bookings</div>
        </div>
        <div className="card" style={{ marginBottom: 0, padding: 16 }}>
          <div className="caption" style={{ marginBottom: 4 }}>Repeat Customers</div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--tag-ok-ink)' }}>{repeatRate}%</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>High retention</div>
        </div>
        <div className="card" style={{ marginBottom: 0, padding: 16 }}>
          <div className="caption" style={{ marginBottom: 4 }}>Walk-in vs App</div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{walkinRate}%</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>Are Walk-ins</div>
        </div>
      </div>

      {/* Top Services & Peak Hours */}
      <div className="h3" style={{ marginBottom: 12 }}>Performance Insights</div>
      <div className="flex-col" style={{ gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="h3" style={{ fontSize: 15, marginBottom: 12 }}>Top Services (Revenue)</div>
          <div className="flex-col" style={{ gap: 12 }}>
            {[
              { name: 'Haircut + Beard Combo', rev: '₹12,000', pct: 42 },
              { name: 'Premium Fade', rev: '₹8,400', pct: 30 },
              { name: 'Keratin Treatment', rev: '₹4,000', pct: 14 }
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontWeight: 600 }}>{s.rev}</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: 'var(--primary)', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="h3" style={{ fontSize: 15, marginBottom: 12 }}>Peak Hours</div>
          <div className="flex items-end justify-between" style={{ height: 100, paddingTop: 20, borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>
            {[2, 4, 3, 8, 10, 9, 5, 2].map((h, i) => (
              <div key={i} style={{ width: '10%', background: 'var(--primary)', height: `${h * 10}%`, borderRadius: '4px 4px 0 0', opacity: h > 7 ? 1 : 0.4 }} />
            ))}
          </div>
          <div className="flex justify-between" style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 8 }}>
            <span>9 AM</span>
            <span>1 PM</span>
            <span>5 PM</span>
            <span>9 PM</span>
          </div>
        </div>
      </div>

      {/* Staff Performance (Team Mode Only) */}
      {mode === 'team' && (
        <>
          <div className="h3" style={{ marginBottom: 12 }}>Staff Performance</div>
          <div className="card" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
            {[
              { name: 'Arun K.', rev: '₹14,200', jobs: 28 },
              { name: 'Vishnu P.', rev: '₹9,800', jobs: 19 },
              { name: 'Sajith (Trainee)', rev: '₹4,400', jobs: 12 }
            ].map((staff, i) => (
              <div key={i} className="flex justify-between items-center" style={{ padding: '14px 16px', borderBottom: i === 2 ? 'none' : '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{staff.name}</div>
                  <div className="caption">{staff.jobs} services</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{staff.rev}</div>
              </div>
            ))}
          </div>
        </>
      )}

    </motion.div>
  );
}

function ServicesScreen({ mode }: { mode: 'solo' | 'team' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [salon, setSalon] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [durationInput, setDurationInput] = useState('30');
  const [emojiInput, setEmojiInput] = useState('✂️');
  const [isSaving, setIsSaving] = useState(false);

  // Load active salon's real services and auto-open modal if requested or empty
  useEffect(() => {
    const userPhone = localStorage.getItem('salonista_user_phone');
    const searchParams = new URLSearchParams(location.search);
    const shouldOpenAdd = searchParams.get('openAdd') === 'true';

    // Once we detect openAdd, strip it from the URL immediately so future page refreshes won't re-trigger it
    if (shouldOpenAdd) {
      navigate(location.pathname, { replace: true });
    }

    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const s = data.data.find((x: any) => x.owner_phone === userPhone) || data.data[0];
          if (s) {
            setSalon(s);
            const list = Array.isArray(s.services) ? s.services : [];
            setServices(list);
            if (shouldOpenAdd || list.length === 0) {
              setShowModal(true);
            }
          }
        }
      })
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setEditingIndex(null);
    setNameInput('');
    setPriceInput('');
    setDurationInput('30');
    setEmojiInput('✂️');
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    const s = services[index];
    setEditingIndex(index);
    setNameInput(s.name || '');
    setPriceInput(s.price ? String(s.price) : '');
    setDurationInput(s.durationMinutes ? String(s.durationMinutes) : '30');
    setEmojiInput(s.emoji || '✂️');
    setShowModal(true);
  };

  const handleSaveService = async () => {
    if (!nameInput.trim()) { showError('Service name is required'); return; }
    const priceNum = parseFloat(priceInput);
    if (isNaN(priceNum) || priceNum <= 0) { showError('Please enter a valid price'); return; }
    const durNum = parseInt(durationInput, 10);
    if (isNaN(durNum) || durNum <= 0) { showError('Please enter a valid duration'); return; }

    if (!salon?.id) { showError('No salon found'); return; }

    const newServiceObj = {
      id: editingIndex !== null ? services[editingIndex].id : `svc_${Date.now()}`,
      name: nameInput.trim(),
      price: priceNum,
      durationMinutes: durNum,
      emoji: emojiInput || '✂️'
    };

    let updatedList: any[] = [];
    if (editingIndex !== null) {
      updatedList = [...services];
      updatedList[editingIndex] = newServiceObj;
    } else {
      updatedList = [...services, newServiceObj];
    }

    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedList })
      });
      const d = await res.json();
      if (d.success) {
        setServices(updatedList);
        const updatedSalon = { ...salon, services: updatedList };
        setSalon(updatedSalon);
        localStorage.setItem('salonista_owner_salon', JSON.stringify(updatedSalon));

        // Clean up ?openAdd=true from URL so page doesn't keep thinking modal should re-open
        navigate(location.pathname, { replace: true });
        setShowModal(false);
        showSuccess(editingIndex !== null ? 'Service updated!' : 'New service added!');
      } else {
        showError(d.error || 'Failed to save service');
      }
    } catch (err) {
      console.error(err);
      showError('Failed to connect to server');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (index: number) => {
    if (!salon?.id) return;
    const updatedList = services.filter((_, i) => i !== index);

    try {
      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updatedList })
      });
      const d = await res.json();
      if (d.success) {
        setServices(updatedList);
        const updatedSalon = { ...salon, services: updatedList };
        setSalon(updatedSalon);
        localStorage.setItem('salonista_owner_salon', JSON.stringify(updatedSalon));
        showSuccess('Service deleted');
      } else {
        showError(d.error || 'Failed to delete service');
      }
    } catch (err) {
      console.error(err);
      showError('Failed to delete service');
    }
  };

  const [isShaking, setIsShaking] = useState(false);

  const handleCloseModal = () => {
    if (services.length === 0) {
      setIsShaking(false);
      // Trigger a clean re-shake by toggling in next tick
      requestAnimationFrame(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 900);
      });
      return;
    }
    setShowModal(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      {/* Embedded keyframe for instantaneous shake without opacity changes */}
      <style>{`
        @keyframes modalViolentShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-18px) rotate(-1deg); }
          30% { transform: translateX(18px) rotate(1deg); }
          45% { transform: translateX(-12px) rotate(-0.5deg); }
          60% { transform: translateX(12px) rotate(0.5deg); }
          75% { transform: translateX(-6px); }
          90% { transform: translateX(6px); }
        }
        .modal-shaking {
          animation: modalViolentShake 0.55s ease-in-out !important;
          border: 2px solid #ef4444 !important;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.45), 0 24px 64px rgba(239, 68, 68, 0.35) !important;
        }
      `}</style>

      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">{salon?.name || (mode === 'solo' ? 'Single Owner' : 'Owner + Staff')}</div>
        <div className="ios-header-title">Service Menu</div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <p className="body">Custom services and pricing for your salon.</p>
        <button className="btn-primary" onClick={openAddModal} style={{ width: 'auto', padding: '8px 16px', fontSize: 13, gap: 6 }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: 32 }}>
          <div className="caption">Loading services...</div>
        </div>
      ) : services.length === 0 ? (
        <div className="card text-center" style={{ padding: 40, border: '2px dashed var(--primary)', background: 'var(--tag-warn-bg)' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: 'var(--tag-critical-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px'
          }}>
            <Scissors size={28} color="var(--primary)" />
          </div>
          <div className="h3" style={{ marginBottom: 4 }}>Add At Least 1 Service to Launch</div>
          <div className="caption" style={{ maxWidth: 300, margin: '0 auto 20px', color: 'var(--ink)' }}>
            Your salon is currently hidden from customers. Once you add your first service (e.g. Haircut, Shave), customers will immediately see your salon and be able to book chairs!
          </div>
          <button className="btn-primary" onClick={openAddModal} style={{ width: 'auto', margin: '0 auto', padding: '10px 20px' }}>
            <Plus size={16} /> Add Your First Service
          </button>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: 10 }}>
          {services.map((svc, i) => (
            <div key={svc.id || i} className="card flex justify-between items-center" style={{ marginBottom: 0, padding: '14px 16px' }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--r-md)',
                  background: 'var(--tag-ok-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, border: '1px solid var(--border)'
                }}>
                  {svc.emoji || '✂️'}
                </div>
                <div>
                  <div className="h3" style={{ fontSize: 15 }}>{svc.name}</div>
                  <div className="caption" style={{ marginTop: 2 }}>{svc.durationMinutes} mins</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h3" style={{ fontSize: 16, color: 'var(--primary)' }}>₹{svc.price}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(i)} style={{ padding: 8, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
                    <Edit2 size={13} color="var(--ink-muted)" />
                  </button>
                  <button onClick={() => handleDeleteService(i)} style={{ padding: 8, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--tag-critical-bg)', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} color="var(--primary)" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal with Instant Shake animation (No Opacity Fade) */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.65)', zIndex: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
            }}
            onClick={handleCloseModal}>
            <div
              className={isShaking ? 'modal-shaking' : ''}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--r-lg)',
                padding: '24px',
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--border)',
                transition: 'border 0.9s ease, box-shadow 0.9s ease'
              }}>

              <div className="flex justify-between items-center" style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                  {editingIndex !== null ? 'Edit Service' : 'Add New Service'}
                </div>
                <button onClick={handleCloseModal} style={{ padding: 6, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
                  <X size={15} color="var(--ink-muted)" />
                </button>
              </div>

              {/* Mandatory First Service Notice Banner */}
              {services.length === 0 && (
                <div style={{
                  background: isShaking ? '#fee2e2' : 'var(--tag-warn-bg)',
                  border: isShaking ? '1.5px solid #ef4444' : '1px solid var(--accent)',
                  borderRadius: 'var(--r-md)',
                  padding: '10px 12px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ fontSize: 16 }}>⚠️</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isShaking ? '#b91c1c' : 'var(--ink)', lineHeight: 1.35 }}>
                    Add at least 1 service to activate your salon &amp; proceed to the dashboard.
                  </div>
                </div>
              )}

              <div className="flex-col" style={{ gap: 14 }}>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Service Name *</div>
                  <input
                    type="text"
                    placeholder="e.g. Classic Haircut, Beard Trim"
                    className="input-field"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div className="label" style={{ marginBottom: 4 }}>Price (₹) *</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 250"
                      className="input-field"
                      value={priceInput}
                      onKeyDown={e => {
                        if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                      }}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPriceInput(val);
                      }}
                    />
                  </div>
                  <div>
                    <div className="label" style={{ marginBottom: 4 }}>Duration (Mins) *</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 25"
                      className="input-field"
                      value={durationInput}
                      onKeyDown={e => {
                        if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                      }}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setDurationInput(val);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="label" style={{ marginBottom: 6 }}>Choose Icon / Emoji</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['✂️', '🪒', '🚿', '🎨', '💆‍♂️', '✨'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEmojiInput(emoji)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: 'var(--r-md)',
                          fontSize: 20,
                          background: emojiInput === emoji ? 'var(--tag-critical-bg)' : 'var(--bg)',
                          border: `1.5px solid ${emojiInput === emoji ? 'var(--primary)' : 'var(--border)'}`,
                          cursor: 'pointer'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleSaveService}
                  disabled={isSaving}
                  style={{ marginTop: 8 }}
                >
                  {isSaving ? 'Saving...' : editingIndex !== null ? 'Update Service' : 'Save Service'}
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailsScreen({ mode }: { mode: 'solo' | 'team' }) {
  const navigate = useNavigate();
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load owner's salon dynamically strictly matching user's phone
  useEffect(() => {
    const userPhone = localStorage.getItem('salonista_user_phone');
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const matchingSalon = data.data.find((x: any) => x.owner_phone === userPhone);
          if (matchingSalon) {
            setSalon(matchingSalon);
            localStorage.setItem('salonista_owner_salon_id', matchingSalon.id);
          }
        }
      })
      .catch(err => console.error('Failed to load salon details:', err))
      .finally(() => setLoading(false));
  }, []);

  const editPath = mode === 'solo' ? '/owner/solo/edit-profile' : '/owner/team/edit-profile';

  if (loading) {
    return (
      <div className="page-container flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="caption" style={{ fontSize: 14 }}>Loading salon details...</div>
      </div>
    );
  }

  const coverPhoto = salon?.photos?.[0];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
        <div className="ios-header-title">Salon Details</div>
      </div>

      {/* Salon Info Card with Bottom-Right Edit Button */}
      <div className="card" style={{ padding: '18px', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {coverPhoto ? (
            <div style={{ width: 72, height: 72, borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
              <img src={coverPhoto} alt={salon?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: 'var(--r-md)', flexShrink: 0,
              background: 'var(--tag-critical-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border)'
            }}>
              <Store size={32} color="var(--primary)" />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
              {salon?.name || 'Your Salon'}
            </div>
            <div className="caption" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: 'var(--ink-muted)', fontSize: 13 }}>
              <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>{salon?.location || 'Location not set'}</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className={salon?.is_closed ? 'tag tag-critical' : 'tag tag-ok'} style={{ fontSize: 11 }}>
                {salon?.is_closed ? 'Closed for today' : 'Open for bookings'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Right Edit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => navigate(editPath)}
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              background: 'var(--tag-critical-bg)',
              borderRadius: 'var(--r-pill)',
              cursor: 'pointer'
            }}
          >
            <Edit2 size={13} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Working Hours & Weekly Schedule */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
          <div className="h3">Weekly Schedule & Hours</div>
          <button
            onClick={() => navigate(editPath)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Edit
          </button>
        </div>

        {/* Timings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Clock size={16} color="var(--primary)" />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
            {(salon?.schedule?.openTime || '09:00')} — {(salon?.schedule?.closeTime || '21:00')}
          </span>
        </div>

        {/* Sunday to Saturday day bubbles */}
        <div className="flex justify-between items-center" style={{ gap: 6 }}>
          {[
            { id: 'Sun', label: 'S' },
            { id: 'Mon', label: 'M' },
            { id: 'Tue', label: 'T' },
            { id: 'Wed', label: 'W' },
            { id: 'Thu', label: 'T' },
            { id: 'Fri', label: 'F' },
            { id: 'Sat', label: 'S' },
          ].map(d => {
            const activeDays = Array.isArray(salon?.schedule?.openDays) 
              ? salon.schedule.openDays 
              : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const isOpen = activeDays.includes(d.id);

            return (
              <div key={d.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 700,
                  background: isOpen ? 'var(--primary)' : '#f3f4f6',
                  color: isOpen ? '#fff' : '#9ca3af',
                  border: isOpen ? '1.5px solid var(--primary)' : '1.5px solid #e5e7eb',
                  boxShadow: isOpen ? '0 2px 8px rgba(217,90,43,0.25)' : 'none'
                }}>
                  {d.label}
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: isOpen ? 'var(--primary)' : '#9ca3af' }}>
                  {d.id}
                </span>
              </div>
            );
          })}
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

      {/* Account & Preview */}
      <div className="card" style={{ padding: 18 }}>
        <div className="h3" style={{ marginBottom: 12 }}>Account & View</div>
        <div className="flex-col" style={{ gap: 8 }}>
          {salon?.id && (
            <button
              className="btn-secondary"
              style={{
                justifyContent: 'flex-start',
                fontSize: 13,
                color: 'var(--primary)',
                borderColor: 'var(--primary)',
                background: 'var(--tag-critical-bg)',
                fontWeight: 600
              }}
              onClick={() => navigate(`/salon/${salon.id}`)}
            >
              👁️ Preview My Salon as Customer
            </button>
          )}
          {mode === 'team' && (
            <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>Change Staff PIN</button>
          )}
          <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>Contact Support</button>
          <button className="btn-secondary" style={{
            justifyContent: 'flex-start', fontSize: 13,
            color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)',
          }} onClick={() => {
            localStorage.removeItem('salonista_user_phone');
            localStorage.removeItem('salonista_owner_salon');
            localStorage.removeItem('salonista_owner_salon_id');
            navigate('/');
          }}>Logout</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   DEDICATED PROFILE EDIT SCREEN
   ═══════════════════════════════════════════ */

function EditSalonProfileScreen({ mode }: { mode: 'solo' | 'team' }) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [description, setDescription] = useState('');
  const [avail, setAvail] = useState('Available now');
  const [photos, setPhotos] = useState<string[]>([]);
  const [openDays, setOpenDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');

  const allWeekDays = [
    { id: 'Sun', name: 'Sunday', short: 'S' },
    { id: 'Mon', name: 'Monday', short: 'M' },
    { id: 'Tue', name: 'Tuesday', short: 'T' },
    { id: 'Wed', name: 'Wednesday', short: 'W' },
    { id: 'Thu', name: 'Thursday', short: 'T' },
    { id: 'Fri', name: 'Friday', short: 'F' },
    { id: 'Sat', name: 'Saturday', short: 'S' },
  ];

  const toggleDay = (dayId: string) => {
    if (openDays.includes(dayId)) {
      if (openDays.length === 1) {
        showError('Select at least 1 operating day.');
        return;
      }
      setOpenDays(openDays.filter(d => d !== dayId));
    } else {
      setOpenDays([...openDays, dayId]);
    }
  };

  useEffect(() => {
    const userPhone = localStorage.getItem('salonista_user_phone');
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const s = data.data.find((x: any) => x.owner_phone === userPhone);
          if (s) {
            setSalon(s);
            setName(s.name || '');
            setLocation(s.location || '');
            setMapUrl(s.map_url || '');
            setDescription(s.description || '');
            setAvail(s.avail || 'Available now');
            setPhotos(s.photos || []);
            if (s.schedule) {
              if (Array.isArray(s.schedule.openDays)) setOpenDays(s.schedule.openDays);
              if (s.schedule.openTime) setOpenTime(s.schedule.openTime);
              if (s.schedule.closeTime) setCloseTime(s.schedule.closeTime);
            }
            localStorage.setItem('salonista_owner_salon_id', s.id);
          }
        }
      })
      .catch(err => console.error('Failed to load salon details:', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).slice(0, 5 - photos.length);
    if (files.length === 0) {
      showError('Maximum 5 photos allowed.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (files.length === 1) {
        formData.append('image', files[0]);
        const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
        const d = await res.json();
        if (d.success && d.url) {
          setPhotos([...photos, d.url]);
          showSuccess('Photo uploaded successfully!');
        } else {
          showError('Failed to upload image.');
        }
      } else {
        files.forEach(f => formData.append('images', f));
        const res = await fetch('http://localhost:5000/api/upload/multiple', { method: 'POST', body: formData });
        const d = await res.json();
        if (d.success && Array.isArray(d.urls)) {
          setPhotos([...photos, ...d.urls]);
          showSuccess(`${d.urls.length} photos uploaded!`);
        } else {
          showError('Failed to upload images.');
        }
      }
    } catch (err) {
      console.error(err);
      showError('Upload failed. Check your network.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) { showError('Salon Name is required.'); return; }
    if (!location.trim()) { showError('Location is required.'); return; }
    if (!salon?.id) {
      showError('No salon record found to update.');
      return;
    }

    setIsSaving(true);
    try {
      const scheduleData = {
        openDays,
        openTime,
        closeTime
      };

      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          map_url: mapUrl,
          description,
          avail,
          photos,
          schedule: scheduleData
        })
      });
      const d = await res.json();
      if (d.success) {
        if (d.data) {
          localStorage.setItem('salonista_owner_salon_id', d.data.id);
          localStorage.setItem('salonista_owner_salon', JSON.stringify(d.data));
        }
        showSuccess('Salon profile & schedule updated successfully!');
        navigate(mode === 'solo' ? '/owner/solo/details' : '/owner/team/details');
      } else {
        showError(d.error || 'Failed to update salon');
      }
    } catch (err) {
      console.error(err);
      showError('Failed to connect to server.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="caption" style={{ fontSize: 14 }}>Loading salon details...</div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="flex items-center justify-between" style={{ marginTop: 20, marginBottom: 16 }}>
        <button
          onClick={() => navigate(mode === 'solo' ? '/owner/solo/details' : '/owner/team/details')}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← Back to Details
        </button>
      </div>

      <div className="ios-header" style={{ marginTop: 0, marginBottom: 16 }}>
        <div className="ios-header-date">{mode === 'solo' ? 'Single Owner' : 'Owner + Staff'}</div>
        <div className="ios-header-title">Edit Salon Profile</div>
      </div>

      {/* Edit Form */}
      <div className="card" style={{ padding: 18 }}>
        <div className="flex-col" style={{ gap: 16 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Salon Name *</div>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Salon Name"
            />
          </div>

          <div>
            <div className="label" style={{ marginBottom: 4 }}>Location / Area *</div>
            <input
              type="text"
              className="input-field"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Thrissur, Kerala"
            />
          </div>

          <div>
            <div className="label" style={{ marginBottom: 4 }}>Google Maps Link</div>
            <input
              type="url"
              className="input-field"
              value={mapUrl}
              onChange={e => setMapUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>

          {/* Operating Days Bubbles */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
              <div className="label" style={{ marginBottom: 0 }}>Operating Days (Sunday – Saturday)</div>
              <span className="caption" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 11 }}>
                {openDays.length === 7 ? 'Open Everyday' : `${openDays.length} Days Open`}
              </span>
            </div>
            
            <div className="flex justify-between items-center" style={{ gap: 6, marginTop: 4 }}>
              {allWeekDays.map(d => {
                const isSelected = openDays.includes(d.id);
                return (
                  <motion.button
                    key={d.id}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleDay(d.id)}
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 700,
                      background: isSelected ? 'var(--primary)' : '#f3f4f6',
                      color: isSelected ? '#fff' : '#6b7280',
                      border: isSelected ? '2px solid var(--primary)' : '1.5px solid #e5e7eb',
                      boxShadow: isSelected ? '0 3px 10px rgba(217,90,43,0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{d.short}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Opening & Closing Hours */}
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Shop Timings</div>
            <div className="flex gap-3 items-center">
              <div style={{ flex: 1 }}>
                <span className="caption" style={{ display: 'block', marginBottom: 2, fontSize: 11 }}>Opens At</span>
                <input type="time" className="input-field" value={openTime} onChange={e => setOpenTime(e.target.value)} />
              </div>
              <span className="caption" style={{ marginTop: 14 }}>to</span>
              <div style={{ flex: 1 }}>
                <span className="caption" style={{ display: 'block', marginBottom: 2, fontSize: 11 }}>Closes At</span>
                <input type="time" className="input-field" value={closeTime} onChange={e => setCloseTime(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <div className="label" style={{ marginBottom: 4 }}>Description / Bio</div>
            <textarea
              className="input-field"
              style={{ minHeight: 70, resize: 'none' }}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your salon, specialties, and experience..."
            />
          </div>

          {/* Photos Management */}
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
              <div className="label" style={{ marginBottom: 0 }}>Salon Photos ({photos.length}/5)</div>
              {isUploading && <span className="caption" style={{ color: 'var(--primary)' }}>Uploading...</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {photos.map((url, idx) => (
                <div key={idx} style={{ position: 'relative', height: 80, borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={url} alt={`Salon ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {idx === 0 && (
                    <span style={{ position: 'absolute', top: 3, left: 3, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 8, padding: '1px 5px', borderRadius: 'var(--r-pill)', fontWeight: 700 }}>
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label style={{ height: 80, border: '2px dashed var(--border)', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink-muted)', gap: 2 }}>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={isUploading} />
                  <Camera size={18} />
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{isUploading ? 'Uploading...' : 'Add Photo'}</span>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-2" style={{ marginTop: 8 }}>
            <button
              className="btn-primary"
              disabled={isSaving}
              onClick={handleSaveChanges}
              style={{ flex: 2 }}
            >
              {isSaving ? 'Saving...' : 'Save Profile & Schedule'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate(mode === 'solo' ? '/owner/solo/details' : '/owner/team/details')}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
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
  const { showSuccess, showError } = useToast();
  const [showWalkin, setShowWalkin] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [salon, setSalon] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchQueue = () => {
    const userPhone = localStorage.getItem('salonista_user_phone');
    fetch('http://localhost:5000/api/salons')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) {
          const s = d.data.find((x: any) => x.owner_phone === userPhone) || d.data[0];
          if (s) {
            setSalon(s);
            if (s.services?.length && !selectedServiceId) {
              setSelectedServiceId(s.services[0].id);
            }
            fetch(`http://localhost:5000/api/bookings?salonId=${s.id}`)
              .then(br => br.json())
              .then(bd => {
                if (bd.success && Array.isArray(bd.data)) {
                  setBookings(bd.data);
                }
              })
              .catch(console.error);
          }
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const activeBooking = bookings.find(b => b.status === 'in_progress');
  const nextBookings = bookings.filter(b => b.status === 'booked');

  const svcNames = (ids: any) => {
    if (!salon?.services || !Array.isArray(ids)) return 'Service';
    return ids.map((id: string) => salon.services.find((s: any) => s.id === id)?.name).filter(Boolean).join(' + ') || 'Haircut';
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if ((await res.json()).success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        showSuccess(`Booking updated to ${newStatus}`);
      }
    } catch {
      showError('Failed to update booking');
    }
  };

  const handleAddWalkin = async () => {
    if (!walkinName.trim()) {
      showError('Please enter customer name');
      return;
    }
    if (!salon?.id) return;

    try {
      const chosenSvc = salon.services?.find((s: any) => s.id === selectedServiceId);
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: salon.id,
          customer_name: walkinName.trim(),
          customer_phone: walkinPhone.trim(),
          service_ids: selectedServiceId ? [selectedServiceId] : [],
          start_time: new Date().toISOString(),
          is_app_booking: false,
          total_price: chosenSvc?.price || 0,
          total_duration_minutes: chosenSvc?.durationMinutes || 30
        })
      });
      const d = await res.json();
      if (d.success) {
        setBookings(prev => [...prev, d.data]);
        setWalkinName('');
        setWalkinPhone('');
        setShowWalkin(false);
        showSuccess('Walk-in added to queue!');
      } else {
        showError(d.error || 'Failed to add walk-in');
      }
    } catch {
      showError('Network error adding walk-in');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="flex justify-between items-center" style={{ marginTop: 16, marginBottom: 8 }}>
        <div className="ios-header" style={{ marginBottom: 0, marginTop: 0 }}>
          <div className="ios-header-date">{salon?.name || 'Single Owner'}</div>
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
            {activeBooking.customer_name}
          </div>
          <div className="body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 12 }}>
            {svcNames(activeBooking.service_ids)} {activeBooking.total_price > 0 && `· ₹${activeBooking.total_price}`}
          </div>
          <div className="flex gap-2" style={{ marginTop: 4 }}>
            <button
              className="btn-done"
              style={{ flex: 2, background: '#fff', color: 'var(--primary)', padding: '12px 14px', fontSize: 14 }}
              onClick={() => handleUpdateStatus(activeBooking.id, 'completed')}
            >
              ✓ Complete
            </button>
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: '12px 14px', fontSize: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.15)' }}
              onClick={() => handleUpdateStatus(activeBooking.id, 'cancelled')}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '28px 16px', marginBottom: 16 }}>
          <div className="body" style={{ marginBottom: 12 }}>No one currently in chair</div>
          {nextBookings.length > 0 && (
            <button
              className="btn-primary"
              style={{ width: 'auto', margin: '0 auto' }}
              onClick={() => handleUpdateStatus(nextBookings[0].id, 'in_progress')}
            >
              Call Next: {nextBookings[0].customer_name}
            </button>
          )}
        </div>
      )}

      {/* Queue */}
      <div className="h3" style={{ marginBottom: 8 }}>Up Next ({nextBookings.length})</div>
      {nextBookings.length === 0 ? (
        <div className="card text-center" style={{ padding: 24 }}>
          <div className="caption">No customers in queue</div>
        </div>
      ) : (
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
                  <div className="h3" style={{ fontSize: 14 }}>{b.customer_name}</div>
                  <div className="caption" style={{ marginTop: 1 }}>
                    {svcNames(b.service_ids)} · {new Date(b.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={b.is_app_booking ? 'tag tag-critical' : 'tag tag-ok'}>
                  {b.is_app_booking ? 'App' : 'Walk-in'}
                </span>
                <button
                  className="btn-primary"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: 11 }}
                  onClick={() => handleUpdateStatus(b.id, 'in_progress')}
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <div className="caption" style={{ marginBottom: 16 }}>Add a customer to today's queue.</div>
              <div className="flex-col" style={{ gap: 12 }}>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Customer Name *</div>
                  <input type="text" className="input-field" placeholder="e.g. Rahul"
                    value={walkinName} onChange={e => setWalkinName(e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Phone Number (Optional)</div>
                  <input type="tel" className="input-field" placeholder="10-digit mobile"
                    value={walkinPhone} onChange={e => setWalkinPhone(e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ marginBottom: 4 }}>Service</div>
                  <select
                    className="input-field"
                    style={{ appearance: 'auto' }}
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                  >
                    {salon?.services?.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} — ₹{s.price}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary" onClick={handleAddWalkin}>Add to Queue</button>
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
  const { showError, showSuccess } = useToast();
  const [salon, setSalon] = useState<any>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [filterTab, setFilterTab] = useState<'All' | 'Today' | 'Completed' | 'Cancelled'>('All');

  const fetchSalonAndBookings = () => {
    const userPhone = localStorage.getItem('salonista_user_phone');
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const s = data.data.find((x: any) => x.owner_phone === userPhone) || data.data[0];
          if (s) {
            setSalon(s);
            setIsClosed(Boolean(s.is_closed));

            // Fetch live bookings for this salon
            fetch(`http://localhost:5000/api/bookings?salonId=${s.id}`)
              .then(r => r.json())
              .then(bData => {
                if (bData.success && Array.isArray(bData.data)) {
                  setBookings(bData.data);
                }
              })
              .catch(err => console.error('Error fetching bookings:', err))
              .finally(() => setLoadingBookings(false));
          }
        }
      })
      .catch(err => {
        console.error(err);
        setLoadingBookings(false);
      });
  };

  useEffect(() => {
    fetchSalonAndBookings();
  }, []);

  const handleToggleClosed = async (closedVal: boolean) => {
    if (!salon?.id) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_closed: closedVal, avail: closedVal ? 'Closed for today' : 'Available now' })
      });
      const d = await res.json();
      if (d.success) {
        setIsClosed(closedVal);
        const updated = { ...salon, is_closed: closedVal, avail: closedVal ? 'Closed for today' : 'Available now' };
        setSalon(updated);
        localStorage.setItem('salonista_owner_salon', JSON.stringify(updated));
        showSuccess(closedVal ? 'Salon marked closed for today' : 'Salon marked open & accepting bookings');
      } else {
        showError(d.error || 'Failed to update salon status');
      }
    } catch (e) {
      console.error(e);
      showError('Network error updating status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const d = await res.json();
      if (d.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        showSuccess(newStatus === 'completed' ? 'Booking marked completed!' : `Booking ${newStatus}`);
      } else {
        showError(d.error || 'Failed to update booking status');
      }
    } catch (e) {
      console.error(e);
      showError('Network error updating booking');
    }
  };

  const statusColors: Record<string, string> = {
    in_progress: 'tag tag-critical',
    booked: 'tag tag-warn',
    completed: 'tag tag-ok',
    cancelled: 'tag tag-critical',
    no_show: 'tag tag-critical',
  };
  const statusLabels: Record<string, string> = {
    in_progress: 'In Chair',
    booked: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No-show',
  };

  // Filter dynamic bookings
  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'Today') {
      const bDate = new Date(b.start_time).toDateString();
      const today = new Date().toDateString();
      return bDate === today;
    }
    if (filterTab === 'Completed') return b.status === 'completed';
    if (filterTab === 'Cancelled') return b.status === 'cancelled' || b.status === 'no_show';
    return true;
  });

  const getServiceNames = (b: any) => {
    if (!salon?.services || !Array.isArray(b.service_ids)) return 'Service';
    return b.service_ids
      .map((id: string) => salon.services.find((s: any) => s.id === id)?.name)
      .filter(Boolean)
      .join(' + ') || 'General Grooming';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="page-container" style={{ maxWidth: 800, paddingBottom: 100 }}>

      <div className="flex justify-between items-center" style={{ marginTop: 24, marginBottom: 16 }}>
        <div className="ios-header" style={{ marginTop: 0, marginBottom: 0 }}>
          <div className="ios-header-date">{salon?.name || (mode === 'solo' ? 'Single Owner' : 'Owner + Staff')}</div>
          <div className="ios-header-title">Bookings ({bookings.length})</div>
        </div>

        {/* 1-Tap Clean Day-Off Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <motion.button
            whileTap={{ scale: 0.94 }}
            disabled={isUpdatingStatus}
            onClick={() => handleToggleClosed(!isClosed)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--r-pill)',
              fontSize: 13,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
              background: isClosed ? '#fee2e2' : '#ecfdf5',
              color: isClosed ? '#b91c1c' : '#047857',
              border: `1.5px solid ${isClosed ? '#f87171' : '#34d399'}`,
              boxShadow: isClosed ? '0 2px 8px rgba(239,68,68,0.12)' : '0 2px 8px rgba(16,185,129,0.12)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isClosed ? '#ef4444' : '#10b981',
              boxShadow: isClosed ? '0 0 8px #ef4444' : '0 0 8px #10b981',
              flexShrink: 0
            }} />
            <span>
              {isUpdatingStatus ? 'Updating...' : isClosed ? 'Mark Salon Open' : 'Take Day Off'}
            </span>
          </motion.button>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-muted)' }}>
            {isClosed ? 'Salon is currently closed' : 'Tap to close for today'}
          </span>
        </div>
      </div>

      {isClosed && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fee2e2', border: '1.5px solid #ef4444', borderRadius: 'var(--r-md)',
            padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c' }}>
              Your salon is currently marked as CLOSED today.
            </span>
          </div>
          <button
            onClick={() => handleToggleClosed(false)}
            style={{
              background: '#ef4444', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)',
              padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
            }}>
            Reopen
          </button>
        </motion.div>
      )}

      <div className="scroll-x flex gap-2" style={{ marginBottom: 20 }}>
        {(['All', 'Today', 'Completed', 'Cancelled'] as const).map(lbl => (
          <button
            key={lbl}
            onClick={() => setFilterTab(lbl)}
            className={`chip ${filterTab === lbl ? 'active' : ''}`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {loadingBookings ? (
        <div className="card text-center" style={{ padding: '36px 20px' }}>
          <div className="caption">Loading live bookings...</div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card text-center" style={{ padding: '48px 24px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
          }}>
            <CalendarDays size={26} color="var(--ink-muted)" />
          </div>
          <div className="h3" style={{ marginBottom: 4 }}>No Bookings Yet</div>
          <div className="caption" style={{ maxWidth: 320, margin: '0 auto' }}>
            {filterTab === 'All'
              ? 'When customers book an appointment through your salon page, bookings will appear here in real-time.'
              : `No bookings found under "${filterTab}".`}
          </div>
        </div>
      ) : (
        <motion.div className="flex-col" style={{ gap: 10 }} variants={staggerContainer} initial="initial" animate="animate">
          {filteredBookings.map(b => (
            <motion.div layout variants={fadeUpItem} key={b.id} className="card" style={{ marginBottom: 0, padding: '14px 18px' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <div className="h3" style={{ fontSize: 15 }}>{b.customer_name || 'Customer'}</div>
                <span className={statusColors[b.status] ?? 'tag'}>{statusLabels[b.status] ?? b.status}</span>
              </div>
              <div className="caption" style={{ color: 'var(--ink)' }}>
                {getServiceNames(b)} · {new Date(b.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                {b.total_price > 0 && ` · ₹${b.total_price}`}
              </div>
              <div className="flex justify-between items-center" style={{ marginTop: 8 }}>
                <span className={b.is_app_booking ? 'tag tag-critical' : 'tag tag-ok'} style={{ fontSize: 10 }}>
                  {b.is_app_booking ? 'App Booking' : 'Walk-in'}
                </span>
                {b.customer_phone && (
                  <span className="caption" style={{ fontSize: 11 }}>📞 {b.customer_phone}</span>
                )}
              </div>
              
              {/* Action Buttons for active bookings */}
              {(b.status === 'booked' || b.status === 'in_progress') && (
                <div className="flex gap-2" style={{ marginTop: 14 }}>
                  {b.status === 'booked' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: 12 }}
                      onClick={() => handleUpdateBookingStatus(b.id, 'in_progress')}
                    >
                      Start (In Chair)
                    </motion.button>
                  )}
                  {b.status === 'in_progress' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="btn-done"
                      style={{ flex: 1, padding: '8px 12px', fontSize: 12, background: 'var(--tag-ok-bg)', color: 'var(--tag-ok-ink)' }}
                      onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                    >
                      ✓ Mark Done
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px 12px', fontSize: 12, color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)', background: 'var(--tag-critical-bg)' }}
                    onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   ROUTER & AUTH GUARD
   ═══════════════════════════════════════════ */

export default function OwnerFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isSolo = path.includes('/owner/solo');
  const isTeam = path.includes('/owner/team');
  const showNav = isSolo || isTeam;
  const mode = isSolo ? 'solo' : 'team';

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [hasServices, setHasServices] = useState(false);

  useEffect(() => {
    const phone = localStorage.getItem('salonista_user_phone');
    if (!phone) {
      setHasAccess(false);
      setCheckingAuth(false);
      return;
    }

    // Strictly check if there is a salon in the database whose owner_phone matches the logged-in user's phone
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const userSalon = data.data.find((s: any) => s.owner_phone === phone);
          if (userSalon) {
            localStorage.setItem('salonista_owner_salon_id', userSalon.id);
            localStorage.setItem('salonista_owner_salon', JSON.stringify(userSalon));
            setHasAccess(true);
            const list = Array.isArray(userSalon.services) ? userSalon.services : [];
            setHasServices(list.length > 0);

            // If owner has 0 services and tries to navigate away from services, redirect to services with openAdd=true
            if (list.length === 0 && !path.includes('/services')) {
              navigate(isSolo ? '/owner/solo/services?openAdd=true' : '/owner/team/services?openAdd=true', { replace: true });
            }
          } else {
            setHasAccess(false);
          }
        } else {
          setHasAccess(false);
        }
      })
      .catch(() => setHasAccess(false))
      .finally(() => setCheckingAuth(false));
  }, [location.pathname]);

  if (checkingAuth) {
    return (
      <div className="page-container flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
        <div className="caption" style={{ fontSize: 14 }}>Verifying owner permissions...</div>
      </div>
    );
  }

  // If not logged in or no salon registered, block access with a clean Lock Screen
  if (!hasAccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="page-container flex-col items-center justify-center text-center"
        style={{ minHeight: '80vh', padding: '32px 24px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--r-lg)',
          background: 'var(--tag-warn-bg)', border: '2px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
        }}>
          <Store size={40} color="var(--accent)" />
        </div>

        <span className="tag tag-warn" style={{ marginBottom: 12, fontSize: 12, padding: '4px 12px' }}>
          Owner Access Required
        </span>

        <div className="h2" style={{ marginBottom: 8 }}>No Salon Listed Yet</div>
        <p className="caption" style={{ maxWidth: 320, marginBottom: 28, fontSize: 14, lineHeight: 1.5 }}>
          You need to be signed in and have a registered salon to access the Owner Dashboard and manage bookings.
        </p>

        <div className="flex-col gap-3" style={{ width: '100%', maxWidth: 280 }}>
          <button className="btn-primary" onClick={() => navigate('/list-salon')}>
            List Your Salon Now
          </button>
          <button className="btn-secondary" onClick={() => navigate('/user')}>
            Go to User Profile / Sign In
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Routes>
        {/* Default → redirect-style: show services if 0 services, else Bookings (OwnerHistory) */}
        <Route path="/" element={hasServices ? <OwnerHistory mode="solo" /> : <ServicesScreen mode="solo" />} />

        {/* Solo Owner routes */}
        <Route path="solo/dashboard" element={<AnalyticsScreen mode="solo" />} />
        <Route path="solo/queue" element={<SoloQueueScreen />} />
        <Route path="solo/services" element={<ServicesScreen mode="solo" />} />
        <Route path="solo/history" element={<OwnerHistory mode="solo" />} />
        <Route path="solo/details" element={<DetailsScreen mode="solo" />} />
        <Route path="solo/edit-profile" element={<EditSalonProfileScreen mode="solo" />} />

        {/* Owner + Staff routes */}
        <Route path="team/dashboard" element={<AnalyticsScreen mode="team" />} />
        <Route path="team/queue" element={<OwnerQueueScreen />} />
        <Route path="team/services" element={<ServicesScreen mode="team" />} />
        <Route path="team/staff" element={<StaffManagement />} />
        <Route path="team/history" element={<OwnerHistory mode="team" />} />
        <Route path="team/details" element={<DetailsScreen mode="team" />} />
        <Route path="team/edit-profile" element={<EditSalonProfileScreen mode="team" />} />
      </Routes>
      {showNav && <OwnerBottomNav mode={mode} hasServices={hasServices} />}
    </>
  );
}
