import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, BarChart2, Scissors, Users, Phone, UserPlus, X, Home, Store, CalendarDays, Camera, MapPin } from 'lucide-react';
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
            {salon?.avail && (
              <div style={{ marginTop: 8 }}>
                <span className="tag tag-ok" style={{ fontSize: 11 }}>
                  {salon.avail}
                </span>
              </div>
            )}
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
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');

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
      const res = await fetch(`http://localhost:5000/api/salons/${salon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          map_url: mapUrl,
          description,
          avail,
          photos
        })
      });
      const d = await res.json();
      if (d.success) {
        if (d.data) {
          localStorage.setItem('salonista_owner_salon_id', d.data.id);
          localStorage.setItem('salonista_owner_salon', JSON.stringify(d.data));
        }
        showSuccess('Salon profile updated successfully!');
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
        <div className="flex-col" style={{ gap: 14 }}>
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

          <div>
            <div className="label" style={{ marginBottom: 4 }}>Current Availability Status</div>
            <input
              type="text"
              className="input-field"
              value={avail}
              onChange={e => setAvail(e.target.value)}
              placeholder="e.g. Open — No wait or 15 min wait"
            />
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

          <div>
            <div className="label" style={{ marginBottom: 4 }}>Opening Hours</div>
            <div className="flex gap-3 items-center">
              <input type="time" className="input-field" value={openTime} onChange={e => setOpenTime(e.target.value)} style={{ flex: 1 }} />
              <span className="caption">to</span>
              <input type="time" className="input-field" value={closeTime} onChange={e => setCloseTime(e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>

          <div className="flex gap-2" style={{ marginTop: 8 }}>
            <button
              className="btn-primary"
              disabled={isSaving}
              onClick={handleSaveChanges}
              style={{ flex: 2 }}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
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
        <motion.button whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ width: 'auto', padding: '8px 14px', fontSize: 13, gap: 4, background: 'var(--tag-critical-bg)', color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)' }}
          onClick={() => setShowLeavesModal(true)}>
          Leaves
        </motion.button>
      </div>

      <div className="scroll-x flex gap-2" style={{ marginBottom: 20 }}>
        {['All', 'Today', 'Completed', 'No-shows'].map((lbl, i) => (
          <button key={lbl} className={`chip ${i === 0 ? 'active' : ''}`}>{lbl}</button>
        ))}
      </div>

      <motion.div className="flex-col" style={{ gap: 10 }} variants={staggerContainer} initial="initial" animate="animate">
        {MOCK_BOOKINGS.map(b => {
          const svc = MOCK_SERVICES.find(s => s.id === b.serviceIds[0]);
          const stylist = MOCK_STYLISTS.find(s => s.id === b.stylistId);
          return (
            <motion.div layout variants={fadeUpItem} key={b.id} className="card" style={{ marginBottom: 0, padding: '14px 18px' }}>
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
                    <motion.button whileTap={{ scale: 0.95 }} className="btn-done" style={{ flex: 1, padding: '8px 12px', fontSize: 13, background: 'var(--tag-ok-bg)', color: 'var(--tag-ok-ink)' }}>
                      ✓ Complete
                    </motion.button>
                  )}
                  <motion.button whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: 13, color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)', background: 'var(--tag-critical-bg)' }}>
                    Cancel
                  </motion.button>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Leaves Modal */}
      <AnimatePresence>
        {showLeavesModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.45)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
            onClick={() => setShowLeavesModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring' as const, damping: 22, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: 20, width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              
              <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                <div className="h2" style={{ fontSize: 18 }}>Holidays & Leaves</div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowLeavesModal(false)} style={{ padding: 6, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
                  <X size={14} color="var(--ink-muted)" />
                </motion.button>
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
        {/* Default → redirect-style: show dashboard */}
        <Route path="/" element={<AnalyticsScreen mode="solo" />} />

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
      {showNav && <OwnerBottomNav mode={mode} />}
    </>
  );
}
