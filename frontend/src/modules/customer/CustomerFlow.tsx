import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Search, Star, QrCode, Home, CalendarDays, User, Building2, Edit2, X, Heart, Navigation, Phone, ShieldCheck, Camera, ChevronLeft, ChevronRight } from 'lucide-react';


import { MOCK_SERVICES, MOCK_BOOKINGS } from '../../data/mockData';
import { KERALA_LOCATIONS } from '../../data/locations';
import { calculateDistanceBetweenLocationAndMap, extractCoordsStrictlyFromMapUrl, KERALA_COORDINATES, getHaversineDistanceKm } from '../../utils/geoDistance';
import BackButton from '../../components/BackButton';
import { useToast } from '../../context/ToastContext';




const pageVariants = {
  initial: { opacity: 0, x: 24 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -24 }
};
const pageTransition: any = { type: 'tween', ease: 'anticipate', duration: 0.28 };

/* ─── Tag helper ─── */
function AvailTag({ text }: { text: string }) {
  const isBusy = text.toLowerCase().includes('busy');
  const isWarn = text.toLowerCase().includes('min');
  const cls = isBusy ? 'tag tag-critical' : isWarn ? 'tag tag-warn' : 'tag tag-ok';
  return <span className={cls}>{text}</span>;
}

/* ─── Smooth Image Carousel Component ─── */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

function ImageCarousel({ photos, name, height = 240, autoSlide = true, intervalMs = 4000 }: { photos: string[]; name: string; height?: number; autoSlide?: boolean; intervalMs?: number }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageList = photos && photos.length > 0 ? photos : ['/salon_banner.png'];
  const imageIndex = ((page % imageList.length) + imageList.length) % imageList.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // 4-second auto carousel timer
  useEffect(() => {
    if (!autoSlide || imageList.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [page, autoSlide, imageList.length, intervalMs]);

  return (
    <div
      style={{
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        height,
        position: 'relative',
        marginBottom: 24,
        boxShadow: 'var(--shadow-card)',
        background: '#111',
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={imageList[imageIndex]}
          alt={`${name} photo ${imageIndex + 1}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.25 },
          }}
          drag={imageList.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={(_e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000 || offset.x < -60) {
              paginate(1);
            } else if (swipe > 10000 || offset.x > 60) {
              paginate(-1);
            }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: imageList.length > 1 ? 'grab' : 'default',
          }}
        />
      </AnimatePresence>

      {/* Subtle dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Arrows if multiple photos */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={e => {
              e.stopPropagation();
              paginate(-1);
            }}
            aria-label="Previous photo"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 3,
              backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              paginate(1);
            }}
            aria-label="Next photo"
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 3,
              backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              zIndex: 3,
            }}
          >
            {imageList.map((_, idx) => (
              <button
                key={idx}
                onClick={e => {
                  e.stopPropagation();
                  setPage([idx, idx > imageIndex ? 1 : -1]);
                }}
                style={{
                  width: idx === imageIndex ? 18 : 6,
                  height: 6,
                  borderRadius: 'var(--r-pill)',
                  background: idx === imageIndex ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Counter pill */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 'var(--r-pill)',
              backdropFilter: 'blur(6px)',
              zIndex: 3,
            }}
          >
            {imageIndex + 1} / {imageList.length}
          </div>
        </>
      )}
    </div>
  );
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
      position: 'fixed', bottom: 20, left: 20, right: 20,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.5)',
      borderRadius: 'var(--r-pill)',
      padding: '16px 20px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
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
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 700 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Screen 1: Discovery ─── */
function DiscoveryScreen() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [salons, setSalons] = useState<any[]>([]);
  const [location, setLocation] = useState<string | null>(() => {
    return localStorage.getItem('salonista_user_location');
  });
  // If no saved location, automatically show location onboarding modal upfront
  const [showLocationModal, setShowLocationModal] = useState(() => {
    return !localStorage.getItem('salonista_user_location');
  });
  const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locSearchQuery, setLocSearchQuery] = useState('');

  const currentLocation = location || 'Thrissur City, Thrissur';

  const handleLocationSelect = (newLoc: string) => {
    const isFirstTime = !localStorage.getItem('salonista_user_location');
    const isPhoneVerified = localStorage.getItem('salonista_user_phone');
    setLocation(newLoc);
    localStorage.setItem('salonista_user_location', newLoc);
    setShowLocationModal(false);

    // If first time and not yet verified, prompt phone verification
    if (isFirstTime && !isPhoneVerified) {
      setShowPhoneVerifyModal(true);
    }
  };

  const handleSendOtp = () => {
    if (phoneInput.trim().length < 10) {
      showError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    showSuccess('Verification code sent! Use 1234');
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim().length < 4) {
      showError('Please enter the 4-digit OTP.');
      return;
    }
    setIsOtpVerified(true);
    showSuccess('Code verified! Please enter your name.');
  };

  const handleCompleteVerification = async () => {
    const finalName = nameInput.trim() || 'Salonista Customer';
    localStorage.setItem('salonista_user_phone', phoneInput);
    localStorage.setItem('salonista_user_name', finalName);

    // Sync user with backend Supabase database
    try {
      await fetch('http://localhost:5000/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput, name: finalName })
      });
    } catch (err) {
      console.warn('Failed to sync user with backend:', err);
    }

    setShowPhoneVerifyModal(false);
    setIsOtpVerified(false);
    setOtpSent(false);
    showSuccess(`Welcome to Salonista, ${finalName}!`);
  };

  const handleSkipPhoneVerify = () => {
    setShowPhoneVerifyModal(false);
    setIsOtpVerified(false);
    setOtpSent(false);
  };

  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);

    const resolveCoords = async (latitude: number, longitude: number) => {
      // 1. Try reverse geocoding via OpenStreetMap Nominatim for accurate place name
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const address = data?.address;
        const town = address?.town || address?.suburb || address?.village || address?.city || address?.county || address?.state_district;
        const district = address?.state_district || address?.county || 'Kerala';
        
        if (town) {
          const match = KERALA_LOCATIONS.find(l => l.toLowerCase().includes(town.toLowerCase()));
          if (match) {
            handleLocationSelect(match);
            setIsLocating(false);
            showSuccess(`Location set to ${match}`);
            return;
          }
          handleLocationSelect(`${town}, ${district}`);
          setIsLocating(false);
          showSuccess(`Location set to ${town}`);
          return;
        }
      } catch (e) {
        console.warn('Reverse geocoding error:', e);
      }

      // 2. Fallback: closest town from KERALA_COORDINATES index
      let closest = 'Thrissur City, Thrissur';
      let minD = Infinity;
      for (const [key, coords] of Object.entries(KERALA_COORDINATES)) {
        const dist = getHaversineDistanceKm(latitude, longitude, coords.lat, coords.lng);
        if (dist < minD) {
          minD = dist;
          const found = KERALA_LOCATIONS.find(l => l.toLowerCase().includes(key));
          if (found) closest = found;
        }
      }
      handleLocationSelect(closest);
      setIsLocating(false);
      showSuccess(`Location set to ${closest}`);
    };

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        resolveCoords(latitude, longitude);
      },
      err => {
        console.warn('Geolocation high accuracy failed, retrying standard...', err);
        // Fallback retry without high accuracy
        navigator.geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            resolveCoords(latitude, longitude);
          },
          err2 => {
            setIsLocating(false);
            console.error('Geolocation failed completely:', err2);
            showError('Could not access location. Please allow location permissions in your browser.');
          },
          { enableHighAccuracy: false, timeout: 10000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };



  // Fetch real salons from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/salons')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setSalons(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch salons:', err));
  }, []);

  // Attach computed dynamic distance from chosen location to salon map_url and sort by nearest
  const sortedSalons = salons
    .map(s => {
      // Calculate distance strictly between selected location and the salon's map_url (with location text fallback)
      const d = calculateDistanceBetweenLocationAndMap(currentLocation, s.map_url, s.location);
      return {
        ...s,
        calculatedDist: d,
        distDisplay: d < 1 ? `${Math.round(d * 1000)} m` : `${d} km`
      };
    })
    .filter(s => {
      // Filter out if user searched for specific salon name or service in top search bar
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchLoc = s.location?.toLowerCase().includes(q);
      const matchDesc = s.description?.toLowerCase().includes(q);
      return matchName || matchLoc || matchDesc;
    })
    .sort((a, b) => a.calculatedDist - b.calculatedDist);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container" style={{ paddingTop: 0 }}>

      {/* Sticky top bar */}
<div style={{
  position: 'sticky', top: 0, zIndex: 10,
  background: 'linear-gradient(to bottom, var(--bg) 55%, rgba(255,251,245,0) 100%)',
  margin: '0 calc(-1 * var(--page-h-pad))',
  padding: '14px var(--page-h-pad) 40px var(--page-h-pad)',
  pointerEvents: 'none', // Let clicks pass through the faded bottom
}}>
  <div className="flex justify-between items-center" style={{ marginBottom: 6, pointerEvents: 'auto' }}>
    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
      Salonista
    </span>
    <button style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'var(--surface)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer'
    }}>
      <Heart size={18} color="var(--ink-muted)" />
    </button>
  </div>
</div>

{/* Search Input */}
<div style={{ position: 'relative', marginBottom: 24, zIndex: 5 }}>
  <Search size={20} color="var(--ink-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
  <input
    type="text"
    placeholder="Search salons or services..."
    className="input-field"
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    style={{
      paddingLeft: 46, paddingRight: 16, height: 52,
      borderRadius: 'var(--r-lg)',
      boxShadow: 'var(--shadow-lifted)',
      border: 'none',
      background: 'var(--surface)'
    }}
  />
</div>

{/* Dynamic Auto-Carousel Hero banner (2-second rotation) */}
{sortedSalons.length > 0 && (() => {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (sortedSalons.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % Math.min(sortedSalons.length, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, [sortedSalons.length]);

  const activeSalon = sortedSalons[heroIndex] || sortedSalons[0];

  return (
    <div 
      onClick={() => navigate(`/salon/${activeSalon.id}`)}
      style={{
        borderRadius: 'var(--r-lg)', overflow: 'hidden', height: 190,
        position: 'relative', marginBottom: 32,
        boxShadow: 'var(--shadow-lifted)',
        cursor: 'pointer'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img 
          key={activeSalon.id + (activeSalon.photos?.[0] || 'default')}
          src={activeSalon.photos?.[0] || "/salon_banner.png"} 
          alt={activeSalon.name}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
        />
      </AnimatePresence>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Featured Experience
          </div>
          {sortedSalons.length > 1 && (
            <div style={{ display: 'flex', gap: 4 }}>
              {sortedSalons.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === heroIndex ? 16 : 5,
                    height: 5,
                    borderRadius: 'var(--r-pill)',
                    background: i === heroIndex ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
          {activeSalon.name} • {activeSalon.location}
        </div>
      </div>
    </div>
  );
})()}

{/* Section header */}
<div className="flex justify-between items-end" style={{ marginBottom: 16 }}>
  <div className="ios-header" style={{ marginBottom: 0, marginTop: 0 }}>
    <div className="ios-header-date">Sorted by nearest to you</div>
    <div className="ios-header-title">Nearby Salons</div>
  </div>
  <button onClick={() => { setLocSearchQuery(''); setShowLocationModal(true); }} className="flex items-center gap-1" style={{ color: 'var(--primary)', fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600, paddingBottom: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
    <MapPin size={14} />
    {currentLocation.split(',')[0]}
    <Edit2 size={12} style={{ marginLeft: 2 }} />
  </button>
</div>

{/* Salon cards */}
<div className="flex-col" style={{ gap: 12 }}>
  {sortedSalons.length === 0 ? (
    <div className="card text-center" style={{ padding: 32 }}>
      <div className="h3" style={{ marginBottom: 4 }}>No salons found</div>
      <div className="caption">Try searching a different keyword or changing location.</div>
    </div>
  ) : (
    sortedSalons.map(s => {
      const coverImg = s.photos?.[0];
      return (
      <div key={s.id} className="card interactive" onClick={() => navigate(`/salon/${s.id}`)}
        style={{ marginBottom: 0, display: 'flex', gap: 14, alignItems: 'center' }}>

        {coverImg && (
          <div style={{ width: 68, height: 68, borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={coverImg} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + rating row */}
          <div className="flex justify-between items-start" style={{ marginBottom: 4 }}>
            <span className="h3" style={{ fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
              fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 700,
              background: 'var(--tag-warn-bg)', color: 'var(--tag-warn-ink)',
              padding: '2px 8px', borderRadius: 'var(--r-pill)',
            }}>
              <Star size={11} fill="currentColor" /> {s.rating || 4.8}
            </span>
          </div>

          {/* Price + dynamic distance row */}
          <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
            <span className="caption">{s.price || '$$'}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)', flexShrink: 0 }} />
            <span className="flex items-center" style={{ gap: 4 }}>
              <MapPin size={11} color="var(--ink-muted)" />
              <span className="caption" style={{ fontWeight: 600, color: s.calculatedDist <= 3 ? 'var(--primary)' : 'var(--ink-muted)' }}>
                {s.distDisplay} away ({s.location})
              </span>
            </span>
          </div>

          <AvailTag text={s.avail || 'Available now'} />
        </div>
      </div>
      );
    })
  )}
</div>

{/* Location-First Onboarding & Switcher Modal */}
<AnimatePresence>
  {showLocationModal && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.65)', zIndex: 120,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px 20px 96px 20px', // Extra bottom padding to safely clear the bottom navbar
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={() => {
        if (location) setShowLocationModal(false);
      }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring' as const, damping: 24, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-lg)',
          padding: '20px',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          maxHeight: '68vh',
          display: 'flex',
          flexDirection: 'column'
        }}>

        <div className="flex justify-between items-start" style={{ marginBottom: 10, width: '100%' }}>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
              {location ? 'Change Location' : 'Where are you located?'}
            </div>
            <div className="caption" style={{ marginTop: 2, fontSize: 12 }}>

              Select your city or town to see nearest salons
            </div>
          </div>
          {location && (
            <button onClick={() => setShowLocationModal(false)} style={{ padding: 6, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
              <X size={14} color="var(--ink-muted)" />
            </button>
          )}
        </div>

        {/* Use My Current Location (GPS) Button */}
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 'var(--r-md)',
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              background: 'var(--tag-critical-bg)'
            }}
          >
            <Navigation size={15} color="var(--primary)" />
            {isLocating ? 'Detecting your location...' : 'Use My Current Location (GPS)'}
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: 12, width: '100%' }}>
          <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: 14, top: 14 }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search all Kerala towns/cities..."
            style={{ paddingLeft: 40, height: 44 }}
            value={locSearchQuery}
            onChange={e => setLocSearchQuery(e.target.value)}
            autoFocus={!location}
          />
        </div>


        {/* Scrollable town list */}
        <div className="scroll-y" style={{ flex: 1, margin: '0 -24px', padding: '0 24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {KERALA_LOCATIONS.filter(loc => loc.toLowerCase().includes(locSearchQuery.toLowerCase())).map(loc => (
            <button
              key={loc}
              onClick={() => handleLocationSelect(loc)}
              style={{
                padding: '13px 0', borderBottom: '1px solid var(--border)',
                background: 'none', border: 'none', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border)',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 14,
                color: currentLocation === loc ? 'var(--primary)' : 'var(--ink)',
                fontWeight: currentLocation === loc ? 700 : 400,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
              <span className="flex items-center gap-2">
                <MapPin size={14} color={currentLocation === loc ? 'var(--primary)' : 'var(--ink-faint)'} />
                {loc}
              </span>
              {currentLocation === loc && <CheckCircle2 size={16} color="var(--primary)" />}
            </button>
          ))}
          {KERALA_LOCATIONS.filter(loc => loc.toLowerCase().includes(locSearchQuery.toLowerCase())).length === 0 && (
            <div className="caption" style={{ textAlign: 'center', marginTop: 24 }}>No matching locations found</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Phone Verification Modal (Triggered After Location Onboarding) */}
<AnimatePresence>
  {showPhoneVerifyModal && (

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.65)', zIndex: 130,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px 20px 96px 20px',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={handleSkipPhoneVerify}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring' as const, damping: 24, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-lg)',
          padding: '24px',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--tag-critical-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <ShieldCheck size={28} color="var(--primary)" />
          </div>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>
            Verify Phone Number
          </div>
          <div className="caption" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.4 }}>
            Phone verification is required to book appointment slots and reserve chairs.
          </div>
        </div>

        {!otpSent ? (
          <div className="flex-col" style={{ gap: 12 }}>
            <div>
              <div className="label" style={{ marginBottom: 6 }}>Mobile Number</div>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  maxLength={10}
                  autoFocus
                />
              </div>
            </div>

            <button className="btn-primary" onClick={handleSendOtp} style={{ marginTop: 4 }}>
              Send Verification Code
            </button>
          </div>
        ) : !isOtpVerified ? (
          <div className="flex-col" style={{ gap: 12 }}>
            <div>
              <div className="label" style={{ marginBottom: 6 }}>Enter 4-Digit OTP</div>
              <input
                type="text"
                placeholder="e.g. 1234"
                className="input-field text-center"
                style={{ fontSize: 20, letterSpacing: 8, fontWeight: 700 }}
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                maxLength={4}
                autoFocus
              />
              <div className="caption" style={{ marginTop: 4, textAlign: 'center' }}>
                Code sent to +91 {phoneInput} · <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Use 1234</span>
              </div>
            </div>

            <button className="btn-primary" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </div>
        ) : (
          <div className="flex-col" style={{ gap: 12 }}>
            <div>
              <div className="label" style={{ marginBottom: 6 }}>What should we call you?</div>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input-field"
                  style={{ paddingLeft: 40 }}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleCompleteVerification()}
                />
              </div>
            </div>

            <button className="btn-primary" onClick={handleCompleteVerification}>
              Complete &amp; Continue
            </button>
          </div>
        )}

        {/* Skip option with Profile reminder */}
        <div style={{ textAlign: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleSkipPhoneVerify}
            style={{
              background: 'none', border: 'none',
              color: 'var(--ink-muted)', fontFamily: 'Poppins, sans-serif',
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            Skip for now
          </button>
          <div className="caption" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>
            You can verify anytime later from your Profile section.
          </div>
        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div >
  );
}

/* ─── Screen 0.5: Salon Profile ─── */

function SalonProfile() {
  const navigate = useNavigate();
  const { id: routeSalonId } = useParams();
  const location = useLocation();
  const salonId = routeSalonId || location.pathname.split('/').filter(Boolean).pop();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cached user selected location from localStorage
  const userSelectedLocation = localStorage.getItem('salonista_user_location') || 'Engandiyur, Thrissur';

  useEffect(() => {
    if (salonId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/salons/${salonId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setSalon(data.data);
          }
        })
        .catch(err => console.error('Error fetching salon details:', err))
        .finally(() => setLoading(false));
    }
  }, [salonId]);

  if (loading && !salon) {
    return (
      <div className="page-container flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
        <BackButton />
        <div className="caption" style={{ marginTop: 24, fontSize: 14 }}>Loading salon details...</div>
      </div>
    );
  }

  // Fallback if salon is not found in database
  const displaySalon = salon || {
    id: salonId,
    name: 'Salon Not Found',
    location: 'Kerala',
    rating: 4.8,
    map_url: '',
    description: 'This salon could not be loaded.',
    avail: 'Unavailable'
  };

  // Custom variants so it slides back out to the right when popping the view
  const profileVariants = {
    initial: { opacity: 0, x: 24 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 24 }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={profileVariants} transition={pageTransition}
      className="page-container">
      <BackButton />

      {/* Hero Carousel */}
      <ImageCarousel photos={displaySalon.photos || []} name={displaySalon.name} height={240} />

      <div className="ios-header" style={{ marginBottom: 12, marginTop: 0 }}>
        <div className="ios-header-title">{displaySalon.name}</div>
      </div>

      <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700,
          background: 'var(--tag-warn-bg)', color: 'var(--tag-warn-ink)',
          padding: '4px 12px', borderRadius: 'var(--r-pill)',
        }}>
          <Star size={14} fill="currentColor" /> {displaySalon.rating || 4.8} (120+ reviews)
        </span>
        <AvailTag text={displaySalon.avail || "Open — No wait"} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <button className="btn-primary" onClick={() => navigate(`/services?salonId=${displaySalon.id}`)}>
          View Services &amp; Book
        </button>
      </div>

      <p className="body" style={{ marginBottom: 24 }}>
        {displaySalon.description || 'Premium grooming lounge specializing in modern fades, precision beard styling, and hot towel shaves. Relaxed atmosphere with top-tier barbers.'}
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="flex items-start gap-4" style={{ marginBottom: 16 }}>
          <div className="icon-box" style={{ background: 'var(--tag-ok-bg)' }}>
            <MapPin size={20} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="h3">Location</div>
            <div className="caption" style={{ marginTop: 2 }}>
              {displaySalon.location}<br />
              {(() => {
                const d = calculateDistanceBetweenLocationAndMap(userSelectedLocation, displaySalon.map_url, displaySalon.location);
                return (
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {d < 1 ? `${Math.round(d * 1000)} m` : `${d} km`} away from {userSelectedLocation.split(',')[0]}
                  </span>
                );
              })()}
            </div>

            {/* Map Link / Button */}
            {displaySalon.map_url && (
              <div style={{ marginTop: 12 }}>
                <a
                  href={displaySalon.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    textDecoration: 'none',
                    borderRadius: 'var(--r-md)',
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)',
                    fontWeight: 600
                  }}
                >
                  <MapPin size={15} /> Open in Google Maps ↗
                </a>
              </div>
            )}

            {/* Embedded Interactive Map using coordinates from map_url or salon location */}
            {(() => {
              const coords = extractCoordsStrictlyFromMapUrl(displaySalon.map_url, displaySalon.location);
              return (
                <iframe
                  src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: 'var(--r-md)', marginTop: '14px', background: 'var(--bg)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              );
            })()}
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
          { name: 'Arun S.', rating: 4, text: 'Great service, but usually busy. Book ahead.' },
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
  const location = useLocation();
  const { showError } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const salonId = searchParams.get('salonId');

  const [salonName, setSalonName] = useState('Fade & Shave Studio');

  useEffect(() => {
    if (salonId) {
      fetch(`http://localhost:5000/api/salons/${salonId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data?.name) {
            setSalonName(data.data.name);
          }
        })
        .catch(console.error);
    }
  }, [salonId]);

  const toggle = (id: string) => {
    if (cart.includes(id)) { setCart(cart.filter(c => c !== id)); return; }
    if (cart.length >= 2) { showError('Select up to 2 services per booking.'); return; }
    setCart([...cart, id]);
  };

  const total = cart.reduce((s, id) => s + (MOCK_SERVICES.find(x => x.id === id)?.price ?? 0), 0);
  const totalMin = cart.reduce((s, id) => s + (MOCK_SERVICES.find(x => x.id === id)?.durationMinutes ?? 0), 0);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container">
      <BackButton />

      {/* Header */}
      <div className="ios-header" style={{ marginBottom: 6 }}>
        <div className="ios-header-date">{salonName}</div>
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
                fontFamily: 'Poppins, sans-serif',
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
                fontFamily: 'Poppins, sans-serif',
                fontSize: 12, fontWeight: 600,
                color: 'var(--ink-muted)',
                alignSelf: 'flex-start',
              }}>
                <Clock size={11} /> {svc.durationMinutes} min
              </div>

              {/* Price */}
              <div style={{
                fontFamily: 'Poppins, sans-serif',
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
                      fontFamily: 'Poppins, sans-serif',
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
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
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
  const [time, setTime] = useState('10:00 AM');
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
            fontFamily: 'Poppins, sans-serif', fontSize: 15, fontWeight: 600,
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
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--tag-warn-ink)', marginBottom: 4 }}>
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
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 72, fontWeight: 700, color: '#fff', lineHeight: 1 }}>15</div>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>minutes</div>
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
        { pos: 2, name: 'You', sub: 'Premium Haircut', active: true }].map(row => (
          <div key={row.pos} className="flex items-center gap-3"
            style={{ paddingBottom: row.pos === 1 ? 14 : 0, marginBottom: row.pos === 1 ? 14 : 0, borderBottom: row.pos === 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: row.active ? 'var(--primary)' : 'var(--tag-ok-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16,
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
  const [bookings, setBookings] = useState(MOCK_BOOKINGS.filter(b => b.isAppBooking));

  const statusColors: Record<string, string> = {
    in_progress: 'tag tag-critical', booked: 'tag tag-warn',
    completed: 'tag tag-ok', cancelled: 'tag tag-ok', no_show: 'tag tag-critical',
  };
  const statusLabels: Record<string, string> = {
    in_progress: 'In Progress', booked: 'Upcoming',
    completed: 'Done', cancelled: 'Cancelled', no_show: 'No-show',
  };

  const handleCancel = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container" style={{ paddingTop: 0, paddingBottom: 100 }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(to bottom, var(--bg) 55%, rgba(255,251,245,0) 100%)',
        margin: '0 calc(-1 * var(--page-h-pad))',
        padding: '14px var(--page-h-pad) 40px var(--page-h-pad)',
        pointerEvents: 'none',
      }}>
        <div className="flex justify-between items-center" style={{ pointerEvents: 'auto' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
            Salonista
          </span>
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Heart size={18} color="var(--ink-muted)" />
          </button>
        </div>
      </div>

      <div className="ios-header" style={{ marginTop: 0 }}>
        <div className="ios-header-date">Your Activity</div>
        <div className="ios-header-title">Bookings</div>
      </div>

      {bookings.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div className="body">No bookings yet.</div>
          <button className="btn-primary" style={{ marginTop: 16, width: 'auto', margin: '16px auto 0' }} onClick={() => navigate('/')}>
            Browse Salons
          </button>
        </div>
      )}

      <div className="flex-col" style={{ gap: 12 }}>
        {bookings.map(b => {
          const svc = MOCK_SERVICES.find(s => s.id === b.serviceIds[0]);
          const canCancel = ['booked', 'in_progress'].includes(b.status);
          return (
            <div key={b.id} className="card" style={{ marginBottom: 0, padding: '16px 18px' }}>
              <div className="flex justify-between items-start" style={{ marginBottom: 8 }}>
                <div>
                  <div className="h3" style={{ fontSize: 15 }}>Fade & Shave Studio</div>
                  <div className="caption" style={{ marginTop: 2 }}>
                    {svc?.name} · {new Date(b.startTime).toLocaleDateString('en-IN')} at {new Date(b.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={statusColors[b.status] ?? 'tag'}>{statusLabels[b.status] ?? b.status}</span>
              </div>

              {canCancel && (
                <div className="flex gap-2" style={{ marginTop: 10 }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                    onClick={() => navigate('/slot')}>
                    Reschedule
                  </button>
                  <button className="btn-secondary" style={{
                    flex: 1, padding: '8px 12px', fontSize: 13,
                    color: 'var(--tag-critical-ink)', borderColor: 'var(--tag-critical-ink)',
                  }} onClick={() => handleCancel(b.id)}>
                    Cancel
                  </button>
                </div>
              )}

              {b.status === 'completed' && (
                <button className="btn-secondary" style={{ marginTop: 10, padding: '8px 12px', fontSize: 13 }}
                  onClick={() => navigate('/status')}>
                  View Details
                </button>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Screen 8: User Profile ─── */
function UserScreen() {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [phone, setPhone] = useState(() => localStorage.getItem('salonista_user_phone'));
  const [name, setName] = useState(() => localStorage.getItem('salonista_user_name') || 'Salonista Customer');
  const [isEditingName, setIsEditingName] = useState(false);

  // Sign In / Verify Modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleSendOtp = () => {
    if (phoneInput.trim().length < 10) {
      showError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim().length < 4) {
      showError('Please enter the 4-digit OTP.');
      return;
    }
    setIsOtpVerified(true);
  };

  const handleCompleteSignIn = async () => {
    const finalName = nameInput.trim() || 'Salonista Customer';
    localStorage.setItem('salonista_user_phone', phoneInput);
    localStorage.setItem('salonista_user_name', finalName);
    setPhone(phoneInput);
    setName(finalName);

    // Sync with backend database
    try {
      await fetch('http://localhost:5000/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput, name: finalName })
      });
    } catch (err) {
      console.warn('Failed to sync user with backend:', err);
    }

    setShowVerifyModal(false);
    setIsOtpVerified(false);
    setOtpSent(false);
    setOtpInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('salonista_user_phone');
    localStorage.removeItem('salonista_user_name');
    setPhone(null);
    setName('Salonista Customer');
  };

  const handleSaveName = async (newName: string) => {
    setName(newName);
    localStorage.setItem('salonista_user_name', newName);
    setIsEditingName(false);
    if (phone) {
      try {
        await fetch('http://localhost:5000/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, name: newName })
        });
      } catch (err) {
        console.warn('Failed to update name in backend:', err);
      }
    }
  };


  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
      className="page-container" style={{ paddingTop: 0, paddingBottom: 100 }}>

      {/* Sticky top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(to bottom, var(--bg) 55%, rgba(255,251,245,0) 100%)',
        margin: '0 calc(-1 * var(--page-h-pad))',
        padding: '14px var(--page-h-pad) 40px var(--page-h-pad)',
        pointerEvents: 'none',
      }}>
        <div className="flex justify-between items-center" style={{ pointerEvents: 'auto' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
            Salonista
          </span>
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Heart size={18} color="var(--ink-muted)" />
          </button>
        </div>
      </div>

      <div className="ios-header" style={{ marginTop: 0 }}>
        <div className="ios-header-title">Profile</div>
      </div>

      {/* Account Card (Dynamic: Signed In vs Not Verified) */}
      <div className="card text-center" style={{ padding: '28px 20px', marginBottom: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: phone ? 'var(--tag-critical-bg)' : 'var(--tag-warn-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <User size={36} color={phone ? 'var(--primary)' : 'var(--accent)'} />
        </div>


        {phone ? (
          <div>
            {isEditingName ? (
              <input
                autoFocus
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => handleSaveName(name)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName(name)}
                style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700,
                  textAlign: 'center', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)', padding: '4px 8px',
                  color: 'var(--ink)', width: '80%', maxWidth: 220, margin: '0 auto 6px',
                  background: 'var(--surface)'
                }}
              />
            ) : (
              <div className="h3" onClick={() => setIsEditingName(true)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {name} <Edit2 size={13} color="var(--ink-muted)" />
              </div>
            )}
            <div className="caption" style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Phone size={13} color="var(--ink-muted)" />
              +91 {phone}
              <span className="tag tag-ok" style={{ marginLeft: 4, fontSize: 10, padding: '2px 6px' }}>Verified</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                marginTop: 16, background: 'none', border: 'none',
                color: 'var(--tag-critical-ink)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif'
              }}
            >
              Sign out / Disconnect Phone
            </button>
          </div>
        ) : (
          <div>
            <div className="h3" style={{ marginBottom: 4 }}>Not Signed In</div>
            <div className="caption" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
              Sign in with your phone number to manage bookings, reserve chairs, and view activity.
            </div>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 24px', margin: '0 auto' }}
              onClick={() => { setOtpSent(false); setShowVerifyModal(true); }}
            >
              <Phone size={16} style={{ marginRight: 6 }} /> Sign In / Verify Phone
            </button>
          </div>
        )}
      </div>

      {/* Verify Phone Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(20,10,0,0.65)', zIndex: 140,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px 20px 96px 20px',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
            }}
            onClick={() => setShowVerifyModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring' as const, damping: 24, stiffness: 320 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--r-lg)',
                padding: '24px',
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column'
              }}>

              <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                  Sign In / Verify
                </div>
                <button onClick={() => setShowVerifyModal(false)} style={{ padding: 6, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', display: 'flex' }}>
                  <X size={14} color="var(--ink-muted)" />
                </button>
              </div>

              {!otpSent ? (
                <div className="flex-col" style={{ gap: 12 }}>
                  <div>
                    <div className="label" style={{ marginBottom: 6 }}>Mobile Number</div>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: 14, top: 14 }} />
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="input-field"
                        style={{ paddingLeft: 40 }}
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleSendOtp} style={{ marginTop: 4 }}>
                    Send Verification Code
                  </button>
                </div>
              ) : !isOtpVerified ? (
                <div className="flex-col" style={{ gap: 12 }}>
                  <div>
                    <div className="label" style={{ marginBottom: 6 }}>Enter 4-Digit OTP</div>
                    <input
                      type="text"
                      placeholder="e.g. 1234"
                      className="input-field text-center"
                      style={{ fontSize: 20, letterSpacing: 8, fontWeight: 700 }}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      maxLength={4}
                      autoFocus
                    />
                    <div className="caption" style={{ marginTop: 4, textAlign: 'center' }}>
                      Code sent to +91 {phoneInput} · <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Use 1234</span>
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                </div>
              ) : (
                <div className="flex-col" style={{ gap: 12 }}>
                  <div>
                    <div className="label" style={{ marginBottom: 6 }}>What should we call you?</div>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: 14, top: 14 }} />
                      <input
                        type="text"
                        placeholder="Your full name"
                        className="input-field"
                        style={{ paddingLeft: 40 }}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleCompleteSignIn()}
                      />
                    </div>
                  </div>

                  <button className="btn-primary" onClick={handleCompleteSignIn}>
                    Complete &amp; Sign In
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Partner / Add Salon Section */}
      <div className="h3" style={{ marginTop: 32, marginBottom: 12 }}>For Businesses</div>

      <div className="flex-col gap-3">
        <div className="card interactive" onClick={() => navigate('/admin')} style={{ marginBottom: 0 }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--tag-warn-bg)' }}>
              <User size={20} color="var(--accent)" />
            </div>
            <div>
              <div className="h3">Admin Portal</div>
              <div className="caption" style={{ marginTop: 4 }}>Platform & subscription control</div>
            </div>
          </div>
        </div>

        <div
          className="card interactive"
          onClick={() => {
            if (!phone) {
              setOtpSent(false);
              setShowVerifyModal(true);
            } else {
              navigate('/list-salon');
            }
          }}
          style={{ marginBottom: 0, border: '1.5px solid var(--primary)', background: 'var(--tag-critical-bg)' }}
        >
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--primary)' }}>
              <Building2 size={20} color="#fff" />
            </div>
            <div>
              <div className="h3" style={{ color: 'var(--primary)' }}>List your salon</div>
              <div className="caption" style={{ marginTop: 4 }}>Are you a salonista? Partner with us.</div>
            </div>
          </div>
        </div>
      </div>


      <div className="h3" style={{ marginTop: 32, marginBottom: 12 }}>Salonista Dashboards</div>

      <div className="flex-col gap-3">
        {/* Single Owner Dashboard */}
        <div className="card interactive" onClick={() => navigate('/owner/solo/dashboard')} style={{ marginBottom: 0 }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--tag-ok-bg)' }}>
              <User size={20} color="var(--tag-ok-ink)" />
            </div>
            <div>
              <div className="h3">Single Owner Dashboard</div>
              <div className="caption" style={{ marginTop: 4 }}>For salons run by one person — you handle everything.</div>
            </div>
          </div>
        </div>

        {/* Owner + Staff Dashboard */}
        <div className="card interactive" onClick={() => navigate('/owner/team/dashboard')} style={{ marginBottom: 0 }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--tag-warn-bg)' }}>
              <CalendarDays size={20} color="var(--tag-warn-ink)" />
            </div>
            <div>
              <div className="h3">Owner + Staff Dashboard</div>
              <div className="caption" style={{ marginTop: 4 }}>Manage staff, view all chairs, and control operations.</div>
            </div>
          </div>
        </div>

        {/* Staff Dashboard */}
        <div className="card interactive" onClick={() => navigate('/staff')} style={{ marginBottom: 0 }}>
          <div className="flex items-start gap-4">
            <div className="icon-box" style={{ background: 'var(--tag-critical-bg)' }}>
              <CalendarDays size={20} color="var(--primary)" />
            </div>
            <div>
              <div className="h3">Staff Dashboard</div>
              <div className="caption" style={{ marginTop: 4 }}>Your own queue only — add walk-ins, mark done.</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Screen 9: List Salon ─── */
function ListSalonScreen() {
  const navigate = useNavigate();
  const phone = localStorage.getItem('salonista_user_phone');
  const { showError, showSuccess } = useToast();

  // Guard: if user is not logged in, redirect them to user profile to verify
  useEffect(() => {
    if (!phone) {
      showError('Please sign in / verify your phone number before listing your salon.');
      navigate('/user');
    }
  }, [phone, navigate, showError]);

  const [salonType, setSalonType] = useState<'solo' | 'team' | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async () => {
    // Validations
    if (!salonType) {
      showError('Please select how you operate.');
      return;
    }
    if (!name.trim()) {
      showError('Salon Name is required.');
      return;
    }
    if (!location.trim()) {
      showError('Location is required.');
      return;
    }
    if (!mapUrl.trim()) {
      showError('Google Maps Link is required.');
      return;
    }
    if (!mapUrl.includes('google.com/maps') && !mapUrl.includes('maps.app.goo.gl')) {
      showError('Please provide a valid Google Maps link.');
      return;
    }
    if (imageFiles.length === 0) {
      showError('Please upload at least 1 salon photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload photos to Cloudinary via backend API
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        if (imageFiles.length === 1) {
          formData.append('image', imageFiles[0]);
          const uploadRes = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            uploadedImageUrls.push(uploadData.url);
          } else {
            throw new Error(uploadData.error || 'Image upload failed');
          }
        } else {
          imageFiles.forEach(f => formData.append('images', f));
          const uploadRes = await fetch('http://localhost:5000/api/upload/multiple', {
            method: 'POST',
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && Array.isArray(uploadData.urls)) {
            uploadedImageUrls = uploadData.urls;
          } else {
            throw new Error(uploadData.error || 'Images upload failed');
          }
        }
      }

      // 2. Create Salon Record with photos JSONB array and owner_phone link
      const res = await fetch('http://localhost:5000/api/salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_phone: phone,
          name,
          location,
          map_url: mapUrl,
          description: description || 'Premium grooming and styling services.',
          photos: uploadedImageUrls,
          price: '$$',
          avail: 'Available now',
          rating: 4.9
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Save the registered salon as the owner's active salon
        localStorage.setItem('salonista_owner_salon_id', data.data.id);
        localStorage.setItem('salonista_owner_salon', JSON.stringify(data.data));

        showSuccess(`Salon listed successfully with ${uploadedImageUrls.length} photo${uploadedImageUrls.length > 1 ? 's' : ''}!`);
        navigate(salonType === 'solo' ? '/owner/solo/dashboard' : '/owner/team/dashboard');
      } else {
        showError('Failed to list salon: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      console.error('Error listing salon:', err);
      showError('Network error during upload. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Salon Type Selector */}
      <div className="label" style={{ marginBottom: 8 }}>How do you operate? *</div>
      <div className="flex gap-3" style={{ marginBottom: 24 }}>
        <button
          onClick={() => setSalonType('solo')}
          className="card flex-col"
          style={{
            flex: 1, marginBottom: 0, textAlign: 'center', cursor: 'pointer', padding: '20px 12px',
            border: salonType === 'solo' ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: salonType === 'solo' ? 'var(--tag-critical-bg)' : 'var(--surface)',
          }}>
          <User size={28} color={salonType === 'solo' ? 'var(--primary)' : 'var(--ink-muted)'} style={{ margin: '0 auto 8px' }} />
          <div className="h3" style={{ fontSize: 14, color: salonType === 'solo' ? 'var(--primary)' : 'var(--ink)' }}>Single Owner</div>
          <div className="caption" style={{ marginTop: 4, fontSize: 11 }}>I run the salon alone</div>
        </button>
        <button
          onClick={() => setSalonType('team')}
          className="card flex-col"
          style={{
            flex: 1, marginBottom: 0, textAlign: 'center', cursor: 'pointer', padding: '20px 12px',
            border: salonType === 'team' ? '2px solid var(--primary)' : '1px solid var(--border)',
            background: salonType === 'team' ? 'var(--tag-critical-bg)' : 'var(--surface)',
          }}>
          <CalendarDays size={28} color={salonType === 'team' ? 'var(--primary)' : 'var(--ink-muted)'} style={{ margin: '0 auto 8px' }} />
          <div className="h3" style={{ fontSize: 14, color: salonType === 'team' ? 'var(--primary)' : 'var(--ink)' }}>Owner + Staff</div>
          <div className="caption" style={{ marginTop: 4, fontSize: 11 }}>I have staff members</div>
        </button>
      </div>

      <div className="flex-col gap-4">
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
            <div className="label" style={{ marginBottom: 0 }}>Salon Photos * (Up to 5)</div>
            {imagePreviews.length > 0 && (
              <span className="caption" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {imagePreviews.length} / 5 selected
              </span>
            )}
          </div>

          {/* Grid of uploaded previews + add button */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 8 }}>
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  height: 96,
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  background: 'var(--surface)',
                }}
              >
                <img src={preview} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {index === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--r-pill)',
                    }}
                  >
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImageFiles(prev => prev.filter((_, i) => i !== index));
                    setImagePreviews(prev => prev.filter((_, i) => i !== index));
                  }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.65)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {imagePreviews.length < 5 && (
              <label
                style={{
                  height: 96,
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--r-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'var(--surface)',
                  color: 'var(--ink-muted)',
                  gap: 4,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      const combinedFiles = [...imageFiles, ...newFiles].slice(0, 5);
                      setImageFiles(combinedFiles);
                      setImagePreviews(combinedFiles.map(f => URL.createObjectURL(f)));
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <Camera size={20} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>{imagePreviews.length === 0 ? 'Add Photos' : 'Add More'}</span>
              </label>
            )}
          </div>
          <div className="caption" style={{ marginTop: 6, fontSize: 11 }}>
            The first photo will be used as the primary cover.
          </div>
        </div>

        <div>
          <div className="label">Salon Name *</div>
          <input
            type="text"
            placeholder="e.g. Urban Cuts &amp; Grooming Studio"
            className="input-field mt-1"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <div className="label">Location (City, Area) *</div>
          <input
            type="text"
            placeholder="e.g. Kunnamkulam, Thrissur, Kerala"
            className="input-field mt-1"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        <div>
          <div className="label">Google Maps Link *</div>
          <input
            type="url"
            placeholder="e.g. https://maps.app.goo.gl/..."
            className="input-field mt-1"
            value={mapUrl}
            onChange={e => setMapUrl(e.target.value)}
          />
        </div>

        <div>
          <div className="label">Description / Bio</div>
          <textarea
            placeholder="e.g. Premium grooming and styling lounge with experienced stylists..."
            className="input-field mt-1"
            style={{ minHeight: 80, resize: 'none' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 32, paddingBottom: 24 }}>
        <button
          className="btn-primary"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Saving Salon...' : (salonType ? `Register as ${salonType === 'solo' ? 'Single Owner' : 'Owner + Staff'}` : 'Register Salon')}
        </button>
      </div>
    </motion.div>
  );
}

import NotFound from '../../pages/NotFound';

/* ─── Router ─── */
export default function CustomerFlow() {
  const location = useLocation();
  const [cart, setCart] = useState<string[]>([]);

  // Only show bottom nav on top-level tabs
  const showNav = ['/', '/appointments', '/user'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<DiscoveryScreen />} />
        <Route path="/appointments" element={<AppointmentsScreen />} />
        <Route path="/user" element={<UserScreen />} />
        <Route path="/list-salon" element={<ListSalonScreen />} />
        <Route path="/salon/:id" element={<SalonProfile />} />
        <Route path="/services" element={<ServiceList cart={cart} setCart={setCart} />} />
        <Route path="/slot" element={<SlotPicker />} />
        <Route path="/otp" element={<OtpScreen />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
        <Route path="/status" element={<StatusScreen />} />
        <Route path="/qr" element={<QRLanding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}
