import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Clock, MapPin, Search, Star, QrCode, Home, CalendarDays, User, Building2 } from 'lucide-react';
import { MOCK_SERVICES, MOCK_BOOKINGS } from '../../data/mockData';
import BackButton from '../../components/BackButton';

const pageVariants = {
  initial: { opacity: 0, x: 24 },
  in:      { opacity: 1, x: 0 },
  out:     { opacity: 0, x: -24 }
};
const pageTransition: any = { type: 'tween', ease: 'anticipate', duration: 0.28 };

/* ─── Tag helper ─── */
function AvailTag({ text }: { text: string }) {
  const isBusy = text.toLowerCase().includes('busy');
  const isWarn = text.toLowerCase().includes('min');
  const cls = isBusy ? 'tag tag-critical' : isWarn ? 'tag tag-warn' : 'tag tag-ok';
  return <span className={cls}>{text}</span>;
}

/* ─── App Store Bottom Nav ─── */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/appointments', icon: CalendarDays, label: 'Bookings' },
    { id: '/user', icon: User, label: 'Profile' },
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

/* ─── Screen 0: Discovery ─── */
function DiscoveryScreen() {
  const navigate = useNavigate();
  const [location] = useState('Thrissur, Chettuwa');

  const salons = [
    { id: 'salon1', name: 'Fade & Shave Studio',  rating: 4.8, price: '₹150 onwards', avail: 'Open — No wait',        dist: '0.4 km' },
    { id: 'salon2', name: 'The Grooming Lounge',  rating: 4.5, price: '₹200 onwards', avail: 'Available in 15 mins',  dist: '1.1 km' },
    { id: 'salon3', name: 'Classic Cuts',          rating: 4.2, price: '₹100 onwards', avail: 'Busy — 45 min wait',   dist: '2.3 km' },
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container" style={{ paddingTop: 0 }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        margin: '0 calc(-1 * var(--page-h-pad))',
        padding: '14px var(--page-h-pad)',
      }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
            Salonista
          </span>
          <button style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Search size={17} color="var(--ink-muted)" />
          </button>
        </div>

        {/* Location row */}
        <button className="flex items-center gap-2" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <MapPin size={14} color="var(--primary)" />
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
            {location}
          </span>
          <ChevronLeft size={14} color="var(--ink-muted)" style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </div>

      {/* Hero banner */}
      <div style={{
        borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 180,
        position: 'relative', marginBottom: 32,
        boxShadow: 'var(--shadow-lifted)',
      }}>
        <img src="/salon_banner.png" alt="Premium salon interior"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 24,
        }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Featured Experience
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            Fade & Shave Studio
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="ios-header" style={{ marginBottom: 16 }}>
        <div className="ios-header-date">Near you</div>
        <div className="ios-header-title">Nearby Salons</div>
      </div>

      {/* Salon cards */}
      <div className="flex-col" style={{ gap: 12 }}>
        {salons.map(s => (
          <div key={s.id} className="card interactive" onClick={() => navigate(`/salon/${s.id}`)}
            style={{ marginBottom: 0 }}>

            {/* Name + rating row */}
            <div className="flex justify-between items-start" style={{ marginBottom: 6 }}>
              <span className="h3" style={{ flex: 1, marginRight: 12 }}>{s.name}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700,
                background: 'var(--tag-warn-bg)', color: 'var(--tag-warn-ink)',
                padding: '3px 9px', borderRadius: 'var(--r-pill)',
              }}>
                <Star size={11} fill="currentColor" /> {s.rating}
              </span>
            </div>

            {/* Price + distance row */}
            <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
              <span className="caption">{s.price}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)', flexShrink: 0 }} />
              <span className="flex items-center" style={{ gap: 4 }}>
                <MapPin size={11} color="var(--ink-muted)" />
                <span className="caption">{s.dist} away</span>
              </span>
            </div>

            <AvailTag text={s.avail} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Screen 0.5: Salon Profile ─── */
function SalonProfile() {
  const navigate = useNavigate();

  // Custom variants so it slides back out to the right when popping the view
  const profileVariants = {
    initial: { opacity: 0, x: 24 },
    in:      { opacity: 1, x: 0 },
    out:     { opacity: 0, x: 24 }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={profileVariants} transition={pageTransition}
      className="page-container">
      <BackButton />

      {/* Hero Image */}
      <div style={{
        borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 240,
        position: 'relative', marginBottom: 24,
        boxShadow: 'var(--shadow-card)',
      }}>
        <img src="/salon_banner.png" alt="Salon exterior"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%, transparent 100%)',
        }} />
      </div>

      <div className="ios-header" style={{ marginBottom: 12, marginTop: 0 }}>
        <div className="ios-header-title">Fade &amp; Shave Studio</div>
      </div>

      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700,
          background: 'var(--tag-warn-bg)', color: 'var(--tag-warn-ink)',
          padding: '4px 12px', borderRadius: 'var(--r-pill)',
        }}>
          <Star size={14} fill="currentColor" /> 4.8 (120+ reviews)
        </span>
        <AvailTag text="Open — No wait" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <button className="btn-primary" onClick={() => navigate('/services')}>
          View Services &amp; Book
        </button>
      </div>

      <p className="body" style={{ marginBottom: 24 }}>
        Premium grooming lounge specializing in modern fades, precision beard styling, and hot towel shaves. Relaxed atmosphere with top-tier barbers.
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="flex items-start gap-4" style={{ marginBottom: 16 }}>
          <div className="icon-box" style={{ background: 'var(--tag-ok-bg)' }}>
            <MapPin size={20} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="h3">Location</div>
            <div className="caption" style={{ marginTop: 2 }}>
              123 High Street, Chettuwa<br />
              0.4 km away
            </div>
            
            {/* Embedded Interactive Map */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15694.041047125713!2d76.04692751307613!3d10.538562387192664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba795ccb801b65b%3A0xb35aab64cce17bc6!2sChettuva%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="160" 
              style={{ border: 0, borderRadius: 'var(--r-md)', marginTop: '12px', background: 'var(--bg)' }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <div className="divider" style={{ margin: '16px 0' }} />
        <div className="flex items-start gap-4">
          <div className="icon-box" style={{ background: 'var(--tag-ok-bg)' }}>
            <Clock size={20} color="var(--primary)" />
          </div>
          <div>
            <div className="h3">Opening Hours</div>
            <div className="caption" style={{ marginTop: 2 }}>
              Today: 9:00 AM - 9:00 PM<br />
              Open all week
            </div>
          </div>
        </div>
      </div>

      <div className="h3" style={{ marginBottom: 16 }}>Recent Reviews</div>
      <div className="flex-col gap-3" style={{ marginBottom: 32 }}>
        {[
          { name: 'Rahul K.', rating: 5, text: 'Best fade in town. Super clean setup.' },
          { name: 'Arun S.',  rating: 4, text: 'Great service, but usually busy. Book ahead.' },
        ].map((r, i) => (
          <div key={i} style={{ background: 'var(--surface)', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
              <div className="h3" style={{ fontSize: 14 }}>{r.name}</div>
              <div className="flex" style={{ color: 'var(--accent)' }}>
                {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
              </div>
            </div>
            <div className="caption">{r.text}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Screen 1: Service List ─── */

// Icon emoji map so each service feels distinct without an icon library
const SVC_EMOJI: Record<string, string> = {
  s1: '✂️',
  s2: '🪒',
  s3: '🚿',
  s4: '🎨',
};

function ServiceList({ cart, setCart }: { cart: string[]; setCart: (v: string[]) => void }) {
  const navigate = useNavigate();

  const toggle = (id: string) => {
    if (cart.includes(id)) { setCart(cart.filter(c => c !== id)); return; }
    if (cart.length >= 2) { alert('Select up to 2 services per booking.'); return; }
    setCart([...cart, id]);
  };

  const total    = cart.reduce((s, id) => s + (MOCK_SERVICES.find(x => x.id === id)?.price ?? 0), 0);
  const totalMin = cart.reduce((s, id) => s + (MOCK_SERVICES.find(x => x.id === id)?.durationMinutes ?? 0), 0);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <BackButton />

      {/* Header */}
      <div className="ios-header" style={{ marginBottom: 6 }}>
        <div className="ios-header-date">Fade &amp; Shave Studio</div>
        <div className="ios-header-title">Services</div>
      </div>
      <p className="body" style={{ marginBottom: 24 }}>Pick up to 2 services to combine in one visit.</p>

      {/* Service cards — tall, portrait-style */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 120 }}>
        {MOCK_SERVICES.map((svc, i) => {
          const sel = cart.includes(svc.id);
          return (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 26 }}
              onClick={() => toggle(svc.id)}
              style={{
                background: sel ? 'var(--tag-critical-bg)' : 'var(--surface)',
                border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--r-lg)',
                padding: '20px 16px',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: sel ? '0 6px 20px rgba(232,99,11,0.12)' : 'var(--shadow-card)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* Checkmark badge */}
              {sel && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={13} color="#fff" />
                </div>
              )}

              {/* Emoji icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--r-md)',
                background: sel ? 'rgba(232,99,11,0.12)' : 'var(--tag-ok-bg)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {SVC_EMOJI[svc.id] ?? '✂️'}
              </div>

              {/* Name */}
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 16,
                fontWeight: 700,
                color: sel ? 'var(--primary)' : 'var(--ink)',
                lineHeight: 1.25,
              }}>
                {svc.name}
              </div>

              {/* Duration pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'var(--tag-ok-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-pill)',
                padding: '3px 8px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 12, fontWeight: 600,
                color: 'var(--ink-muted)',
                alignSelf: 'flex-start',
              }}>
                <Clock size={11} /> {svc.durationMinutes} min
              </div>

              {/* Price */}
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 20, fontWeight: 700,
                color: sel ? 'var(--primary)' : 'var(--ink)',
                marginTop: 'auto',
              }}>
                ₹{svc.price}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom tray */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: 'var(--surface)',
              borderTop: '1px solid var(--border)',
              borderTopLeftRadius: 32, borderTopRightRadius: 32,
              padding: '24px 24px 36px',
              boxShadow: 'var(--shadow-nav)',
            }}>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              {/* Selected service pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {cart.map(id => {
                  const s = MOCK_SERVICES.find(x => x.id === id)!;
                  return (
                    <span key={id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: 'var(--tag-critical-bg)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--r-pill)',
                      padding: '4px 10px',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: 12, fontWeight: 700,
                      color: 'var(--primary)',
                    }}>
                      {SVC_EMOJI[s.id]} {s.name}
                    </span>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
                    ₹{total}
                  </div>
                  <div className="caption">{totalMin} min · {cart.length} service{cart.length > 1 ? 's' : ''}</div>
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '14px 30px' }}
                  onClick={() => navigate('/slot')}>
                  Continue →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Screen 2: Slot Picker ─── */
function SlotPicker() {
  const navigate = useNavigate();
  const [time, setTime]       = useState('10:00 AM');
  const slots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM'];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <BackButton />
      <div className="ios-header">
        <div className="ios-header-title">Pick a Slot</div>
      </div>

      <div className="h3" style={{ marginBottom: 12 }}>Time</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {slots.map(s => (
          <button key={s} onClick={() => setTime(s)} style={{
            background: 'var(--surface)',
            border: `1.5px solid ${time === s ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 'var(--r-md)', padding: '13px',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 600,
            color: time === s ? 'var(--primary)' : 'var(--ink)', cursor: 'pointer',
          }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 36 }}>
        <button className="btn-primary" onClick={() => navigate('/otp')}>Review & Book</button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 3: OTP ─── */
function OtpScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container flex-col" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 40, left: 20 }}>
        <BackButton />
      </div>
      <div className="ios-header">
        <div className="ios-header-title">Your Details</div>
        <p className="body" style={{ marginTop: 6 }}>Just your phone number to secure the booking — no account created.</p>
      </div>
      <div className="flex-col" style={{ gap: 12 }}>
        <input type="tel" placeholder="Mobile number" className="input-field"
          value={phone} onChange={e => setPhone(e.target.value)} />
        <input type="number" placeholder="OTP (any 4 digits for demo)" className="input-field" />
      </div>
      <div style={{ marginTop: 28 }}>
        <button className="btn-primary" onClick={() => navigate('/confirmation')}>Confirm Booking</button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 4: Confirmation ─── */
function ConfirmationScreen() {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container flex-col items-center" style={{ paddingTop: 60 }}>
      <div style={{ alignSelf: 'flex-start' }}>
        <BackButton to="/" label="Home" />
      </div>

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }}
        style={{ marginTop: 20 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--tag-ok-bg)', border: '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle2 size={40} color="var(--primary)" />
        </div>
      </motion.div>

      <div className="ios-header text-center" style={{ marginTop: 20 }}>
        <div className="ios-header-title">Booking Confirmed</div>
      </div>

      <div className="card w-full" style={{
        padding: '32px 24px',
        border: 'none',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-lifted)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ticket cutouts */}
        <div style={{ position: 'absolute', left: -16, top: '45%', width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)', boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.03)' }} />
        <div style={{ position: 'absolute', right: -16, top: '45%', width: 32, height: 32, borderRadius: '50%', background: 'var(--bg)', boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.03)' }} />
        
        <div className="label" style={{ marginBottom: 4 }}>Date & Time</div>
        <div className="h2" style={{ marginBottom: 24, fontSize: 24 }}>Today, 10:30 AM</div>
        
        <div style={{ borderTop: '2px dashed var(--border)', margin: '0 -24px 24px', position: 'relative' }}></div>
        
        <div className="label" style={{ marginBottom: 4 }}>Service</div>
        <div className="h3" style={{ marginBottom: 24, fontSize: 18 }}>Premium Haircut</div>
        <div style={{
          background: 'var(--tag-warn-bg)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--r-md)', padding: 16,
        }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--tag-warn-ink)', marginBottom: 4 }}>
            ⚠ Arrival reminder
          </div>
          <p className="caption">Please arrive within 15 min of your slot or it may be released to the waitlist.</p>
        </div>
      </div>

      <div style={{ marginTop: 16, width: '100%' }}>
        <button className="btn-primary" onClick={() => navigate('/status')}>View Live Status</button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 5: Live Status ─── */
function StatusScreen() {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <BackButton />
      <div className="ios-header text-center">
        <div className="ios-header-date">Live tracker</div>
        <div className="ios-header-title">You're #2 in line</div>
      </div>

      {/* Big wait card */}
      <div className="card text-center" style={{
        background: 'var(--primary)', border: 'none', marginBottom: 16, padding: '36px 20px',
      }}>
        <div className="label" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Estimated wait</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 72, fontWeight: 700, color: '#fff', lineHeight: 1 }}>15</div>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>minutes</div>
      </div>

      {/* Delay notice */}
      <div style={{
        background: 'var(--tag-warn-bg)', border: '1px solid var(--accent)',
        borderRadius: 'var(--r-md)', padding: '10px 14px', marginBottom: 16,
      }}>
        <span className="caption" style={{ color: 'var(--tag-warn-ink)', fontWeight: 600 }}>
          Salon running ~5 min behind schedule
        </span>
      </div>

      <div className="card" style={{ marginBottom: 0 }}>
        {[{ pos: 1, name: 'In Chair', sub: 'Almost done', active: false },
          { pos: 2, name: 'You',      sub: 'Premium Haircut', active: true }].map(row => (
          <div key={row.pos} className="flex items-center gap-3"
            style={{ paddingBottom: row.pos === 1 ? 14 : 0, marginBottom: row.pos === 1 ? 14 : 0, borderBottom: row.pos === 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: row.active ? 'var(--primary)' : 'var(--tag-ok-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 16,
              color: row.active ? '#fff' : 'var(--ink-muted)',
            }}>{row.pos}</div>
            <div>
              <div className="h3">{row.name}</div>
              <div className="caption">{row.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <button className="btn-secondary" onClick={() => navigate('/')}>Back to Salons</button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 6: QR Landing ─── */
function QRLanding() {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ alignSelf: 'flex-start', position: 'absolute', top: 40, left: 24 }}>
        <BackButton />
      </div>
      
      <div style={{
        width: 100, height: 100, borderRadius: 'var(--r-lg)',
        background: 'var(--surface)', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 32, marginTop: 40
      }}>
        <QrCode size={56} color="var(--primary)" />
      </div>

      <div className="ios-header text-center" style={{ marginBottom: 40 }}>
        <div className="ios-header-date" style={{ color: 'var(--primary)' }}>Fade & Shave Studio</div>
        <div className="ios-header-title" style={{ fontSize: 32 }}>Join the Line</div>
        <p className="body" style={{ marginTop: 12, fontSize: 16 }}>Skip the waiting area. Get your digital token and join the live queue right from your phone.</p>
      </div>

      <div className="card w-full text-center" style={{ 
        padding: '32px 24px', 
        border: '2px solid var(--primary)', 
        background: 'var(--tag-critical-bg)',
        boxShadow: '0 8px 24px rgba(217, 90, 43, 0.15)'
      }}>
        <div className="h3" style={{ marginBottom: 8, color: 'var(--ink)' }}>No booking needed</div>
        <p className="caption" style={{ marginBottom: 24, fontSize: 14, color: 'var(--ink-muted)' }}>Tap below to pick your service and get your token instantly.</p>
        <button className="btn-primary" onClick={() => navigate('/services')} style={{ fontSize: 18, padding: '20px' }}>
          Get Token & Join Queue
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Screen 7: Appointments ─── */
function AppointmentsScreen() {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-date">Your Activity</div>
        <div className="ios-header-title">Bookings</div>
      </div>

      {MOCK_BOOKINGS.filter(b => b.isAppBooking).map(b => (
        <div key={b.id} className="card interactive" onClick={() => navigate('/status')} style={{ marginBottom: 12 }}>
          <div className="flex justify-between items-start" style={{ marginBottom: 8 }}>
            <div className="h3">Fade & Shave Studio</div>
            <span className="tag tag-ok">Completed</span>
          </div>
          <div className="caption">{new Date(b.startTime).toLocaleDateString('en-IN')}</div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Screen 8: User Profile ─── */
function UserScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('Guest User');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <div className="ios-header" style={{ marginTop: 24 }}>
        <div className="ios-header-title">Profile</div>
      </div>

      <div className="card text-center" style={{ padding: '32px 20px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--tag-warn-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <User size={32} color="var(--accent)" />
        </div>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
            style={{
              fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700,
              textAlign: 'center', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '4px 8px',
              color: 'var(--ink)', width: '80%', maxWidth: 200, margin: '0 auto',
              background: 'var(--surface)'
            }}
          />
        ) : (
          <div className="h3" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', padding: '4px 8px' }}>
            {name}
          </div>
        )}
        <div className="caption" style={{ marginTop: 4 }}>+91 98765 43210</div>
      </div>

      {/* Partner / Add Salon Section */}
      <div className="h3" style={{ marginTop: 32, marginBottom: 12 }}>For Businesses</div>
      
      <div className="flex-col gap-3">
        <div className="card interactive" onClick={() => navigate('/admin')} style={{ marginBottom: 0 }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--tag-warn-bg)' }}>
              <User size={20} color="var(--accent)" />
            </div>
            <div>
              <div className="h3">Admin (Temp)</div>
              <div className="caption" style={{ marginTop: 4 }}>Platform & subscription control</div>
            </div>
          </div>
        </div>

        <div className="card interactive" onClick={() => navigate('/list-salon')} style={{ marginBottom: 0, border: '1.5px solid var(--primary)', background: 'var(--tag-critical-bg)' }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--primary)' }}>
              <Building2 size={20} color="#fff" />
            </div>
            <div>
              <div className="h3" style={{ color: 'var(--primary)' }}>List your salon</div>
              <div className="caption" style={{ marginTop: 4 }}>Are you a salonista tired of long queues? Partner with us.</div>
            </div>
          </div>
        </div>
        
        <div className="card interactive" onClick={() => navigate('/staff')} style={{ marginBottom: 0 }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--tag-ok-bg)' }}>
              <CalendarDays size={20} color="var(--ink)" />
            </div>
            <div>
              <div className="h3">Salonista Dashboard</div>
              <div className="caption" style={{ marginTop: 4 }}>Manage your salon's live queue.</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Screen 9: List Salon (Temp) ─── */
function ListSalonScreen() {
  const navigate = useNavigate();
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container flex-col" style={{ minHeight: '100vh' }}>
      <BackButton />
      
      <div className="ios-header" style={{ marginBottom: 24 }}>
        <div className="ios-header-date">Partner with us</div>
        <div className="ios-header-title">List your salon</div>
      </div>

      <div style={{
        background: 'var(--tag-warn-bg)', border: '1px solid var(--accent)',
        borderRadius: 'var(--r-md)', padding: '16px', marginBottom: 24,
      }}>
        <div className="h3" style={{ color: 'var(--accent)', marginBottom: 8 }}>
          Are you a salonista?
        </div>
        <p className="caption" style={{ color: 'var(--tag-warn-ink)', fontSize: 14 }}>
          Tired of long queues and managing walk-ins? Join Salonista to streamline your bookings and give your customers a premium experience.
        </p>
      </div>

      <div className="flex-col gap-4">
        <div>
          <div className="label">Salon Name</div>
          <input type="text" placeholder="e.g. Premium Cuts" className="input-field mt-1" />
        </div>
        
        <div>
          <div className="label">Location</div>
          <input type="text" placeholder="e.g. Thrissur, Kerala" className="input-field mt-1" />
        </div>

        <div>
          <div className="label">Salon Images (Optional)</div>
          <div style={{
            border: '1px dashed var(--border)', borderRadius: 'var(--r-md)',
            padding: 24, textAlign: 'center', marginTop: 4, background: 'var(--surface)'
          }}>
            <span className="caption">Tap to upload images</span>
          </div>
        </div>

        <div>
          <div className="label">Your Services</div>
          <textarea placeholder="e.g. Haircut - ₹150, Shave - ₹100" className="input-field mt-1" style={{ minHeight: 80, resize: 'none' }} />
          <div className="caption mt-2 text-center" style={{ color: 'var(--ink-muted)' }}>
            Don't worry, you can always change these later!
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 32, paddingBottom: 24 }}>
        <button className="btn-primary" onClick={() => navigate('/user')}>Done</button>
      </div>
    </motion.div>
  );
}

/* ─── Router ─── */
export default function CustomerFlow() {
  const location = useLocation();
  const [cart, setCart] = useState<string[]>([]);
  
  // Only show bottom nav on top-level tabs
  const showNav = ['/', '/appointments', '/user'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/"            element={<DiscoveryScreen />} />
        <Route path="/appointments" element={<AppointmentsScreen />} />
        <Route path="/user"        element={<UserScreen />} />
        <Route path="/list-salon"  element={<ListSalonScreen />} />
        <Route path="salon/:id"    element={<SalonProfile />} />
        <Route path="services"     element={<ServiceList cart={cart} setCart={setCart} />} />
        <Route path="slot"         element={<SlotPicker />} />
        <Route path="otp"          element={<OtpScreen />} />
        <Route path="confirmation" element={<ConfirmationScreen />} />
        <Route path="status"       element={<StatusScreen />} />
        <Route path="qr"           element={<QRLanding />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}
