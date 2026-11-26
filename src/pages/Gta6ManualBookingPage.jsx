import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Flame,
  Copy,
  Check,
  Tv,
  RefreshCw,
  Ban,
  Share2,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeToast } from '@/components/SwipeToast';
import TermsModal from '@/components/TermsModal';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';
import { socket } from '@/services/socket';

// Restrict GTA 6 strictly to Screen 1 and Screen 2
const GTA6_SCREENS = gridData.screens.filter(
  (s) => s.code === 'Screen1' || s.code === 'Screen2'
);

const DEFAULT_GTA6_PRICING = {
  sessions: {
    '30': 150,
    '60': 250,
  },
  extensions: {
    '30': 130,
    '60': 230,
  },
};

const BASE_TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
];

function buildUpcomingDates() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const result = [];
  const base = new Date();

  for (let i = 0; i < 6; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const id = `${yyyy}-${mm}-${dd}`;
    const label =
      i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
    const sub = `${months[d.getMonth()]} ${d.getDate()}`;
    result.push({ id, label, sub });
  }
  return result;
}

const DATES = buildUpcomingDates();

function to24HourMinutes(timeStr) {
  if (!timeStr) return 0;
  const trimmed = String(timeStr).trim();
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10);
    const minute = parseInt(ampmMatch[2], 10) || 0;
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
  const parts = trimmed.split(':');
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10) || 0;
    const minute = parseInt(parts[1], 10) || 0;
    return hour * 60 + minute;
  }
  return 0;
}

export default function Gta6ManualBookingPage({ user, onRequireLogin }) {
  const toast = useSwipeToast();

  // Dynamic Pricing Matrix from pricingService
  const [gtaPricing, setGtaPricing] = useState(DEFAULT_GTA6_PRICING);

  // Minimal Form State
  const [selectedScreenCode, setSelectedScreenCode] = useState('Screen1');
  const [baseDuration, setBaseDuration] = useState('60');
  const [extensionDuration, setExtensionDuration] = useState('0');
  const [selectedDate, setSelectedDate] = useState(DATES[0].id);
  const [selectedSlot, setSelectedSlot] = useState('06:00 PM');

  // Availability & Submission State
  const [bookedSlots, setBookedSlots] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Locked Confirmation / Redirect State
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);

  // Terms & Conditions Acceptance Modal State
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsPreviewOnly, setTermsPreviewOnly] = useState(false);
  const [pendingBookingUser, setPendingBookingUser] = useState(null);

  // Fetch dynamic pricing from backend
  useEffect(() => {
    let active = true;
    bookingService
      .getPublicConfig()
      .then((data) => {
        if (!active) return;
        if (data?.pricing?.matrix?.GTA6_Launch) {
          const remoteGta = data.pricing.matrix.GTA6_Launch;
          setGtaPricing({
            sessions: {
              ...DEFAULT_GTA6_PRICING.sessions,
              ...(remoteGta.sessions || {}),
            },
            extensions: {
              ...DEFAULT_GTA6_PRICING.extensions,
              ...(remoteGta.extensions || {}),
            },
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Load slot availability
  const loadAvailability = useCallback(async (dateStr) => {
    setLoadingSlots(true);
    try {
      const data = await bookingService.getPublicAvailability(dateStr);
      if (Array.isArray(data?.bookedSlots)) {
        setBookedSlots(data.bookedSlots);
      }
      if (Array.isArray(data?.lockedSlots)) {
        setLockedSlots(data.lockedSlots);
      }
    } catch {
      // Keep current slots if offline
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability(selectedDate);
  }, [selectedDate, selectedScreenCode, loadAvailability]);

  // Real-time socket updates
  useEffect(() => {
    const handleRefresh = () => loadAvailability(selectedDate);
    const handleLocksUpdated = (locks) => {
      if (Array.isArray(locks)) {
        setLockedSlots(locks.filter((l) => l.date === selectedDate));
      }
    };

    socket.on('booking_created', handleRefresh);
    socket.on('booking_updated', handleRefresh);
    socket.on('booking_deleted', handleRefresh);
    socket.on('slot_unlocked', handleRefresh);
    socket.on('slots_locked_updated', handleLocksUpdated);

    return () => {
      socket.off('booking_created', handleRefresh);
      socket.off('booking_updated', handleRefresh);
      socket.off('booking_deleted', handleRefresh);
      socket.off('slot_unlocked', handleRefresh);
      socket.off('slots_locked_updated', handleLocksUpdated);
    };
  }, [selectedDate, loadAvailability]);

  // Pricing calculation
  const baseCost = Number(gtaPricing.sessions[baseDuration] || 250);
  const extCost =
    extensionDuration !== '0'
      ? Number(gtaPricing.extensions[extensionDuration] || 0)
      : 0;
  const totalAmount = baseCost + extCost;
  const totalDurationMins = Number(baseDuration) + Number(extensionDuration);

  // Time slots with overlap checking
  const computedTimeSlots = useMemo(() => {
    const now = new Date();
    const isToday =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')}` === selectedDate;
    const currentMins = now.getHours() * 60 + now.getMinutes();

    return BASE_TIME_SLOTS.map((timeStr) => {
      const slotStart = to24HourMinutes(timeStr);
      const slotEnd = slotStart + totalDurationMins;

      if (isToday && slotStart <= currentMins) {
        return { time: timeStr, status: 'booked' };
      }

      const hasBookedConflict = bookedSlots.some((b) => {
        if (b.screenCode !== selectedScreenCode) return false;
        const bStart = to24HourMinutes(b.startTime);
        const bEnd = bStart + (Number(b.duration) || 60);
        return slotStart < bEnd && slotEnd > bStart;
      });

      if (hasBookedConflict) {
        return { time: timeStr, status: 'booked' };
      }

      const hasLockedConflict = lockedSlots.some((l) => {
        if (l.screenCode !== selectedScreenCode) return false;
        const lStart = to24HourMinutes(l.time || l.startTime);
        const lEnd = lStart + (Number(l.duration) || 60);
        return slotStart < lEnd && slotEnd > lStart;
      });

      if (hasLockedConflict) {
        return { time: timeStr, status: 'locked' };
      }

      return { time: timeStr, status: 'available' };
    });
  }, [selectedDate, selectedScreenCode, bookedSlots, lockedSlots, totalDurationMins]);

  // Auto-select first available slot
  useEffect(() => {
    const current = computedTimeSlots.find((s) => s.time === selectedSlot);
    if (!current || current.status !== 'available') {
      const firstAvail = computedTimeSlots.find((s) => s.status === 'available');
      setSelectedSlot(firstAvail ? firstAvail.time : '');
    }
  }, [computedTimeSlots, selectedSlot]);

  // 15-minute countdown timer
  useEffect(() => {
    if (!pendingConfirmation) return;

    if (pendingConfirmation.expiresAt) {
      const diff = Math.max(
        0,
        Math.floor(
          (new Date(pendingConfirmation.expiresAt).getTime() - Date.now()) / 1000
        )
      );
      setRemainingSeconds(diff > 0 ? diff : 15 * 60);
    } else {
      setRemainingSeconds(15 * 60);
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingConfirmation]);

  const formattedTimer = useMemo(() => {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const getWhatsAppHandoffUrl = (orderId, amount) => {
    const rawMsg = `Hey Grid Team! I'm confirming my GTA 6 slot. My Order ID is ${orderId}. Total Amount: ₹${amount}. Here is my payment screenshot.`;
    return `https://wa.me/918075983910?text=${encodeURIComponent(rawMsg)}`;
  };

  // Core slot-locking & WhatsApp redirect logic (called directly or auto-resumed after AuthModal)
  const executeSlotLock = useCallback(
    async (activeUser) => {
      const targetUser = activeUser || user;
      if (!targetUser) return;

      if (!selectedSlot) {
        setBookingError('Please select an available time slot.');
        return;
      }

      setBookingError('');
      setIsSubmitting(true);

      try {
        const cleanPhone = String(targetUser.phone || '')
          .replace(/\D/g, '')
          .slice(-10);
        const cleanName =
          targetUser.name ||
          (targetUser.email ? targetUser.email.split('@')[0] : 'Grid Player');

        const payload = {
          customerName: cleanName,
          email: targetUser.email,
          phoneNumber: cleanPhone,
          screen: selectedScreenCode,
          screenCode: selectedScreenCode,
          date: selectedDate,
          startTime: selectedSlot,
          baseSessionDuration: Number(baseDuration),
          duration: Number(baseDuration),
          extensionDuration: Number(extensionDuration),
          mode: 'GTA6_Launch',
        };

        const res = await bookingService.createGta6ManualBooking(payload);
        const createdOrderId = res.orderId || res.booking?.orderId;
        const createdTotal = res.totalAmount || res.booking?.totalAmount || totalAmount;
        const createdExpiresAt = res.expiresAt || res.booking?.expiresAt;

        if (createdOrderId) {
          const waUrl = getWhatsAppHandoffUrl(createdOrderId, createdTotal);

          setPendingConfirmation({
            orderId: createdOrderId,
            expiresAt: createdExpiresAt,
            screenName:
              GTA6_SCREENS.find((s) => s.code === selectedScreenCode)?.name ||
              selectedScreenCode,
            date: selectedDate,
            startTime: selectedSlot,
            duration: totalDurationMins,
            extensionDuration: Number(extensionDuration),
            totalAmount: createdTotal,
            waUrl,
          });

          setIsRedirecting(true);
          toast.success?.(
            'Slot locked for 15 minutes!',
            'Redirecting to WhatsApp...'
          );

          // Display the prominent on-screen message briefly, then execute wa.me redirect
          setTimeout(() => {
            window.location.href = waUrl;
          }, 1500);
        } else {
          setBookingError(
            res.message || 'Unable to lock slot. Please choose another time.'
          );
        }
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to lock slot. This slot may have just been taken.';
        setBookingError(msg);
        loadAvailability(selectedDate);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      user,
      selectedSlot,
      selectedScreenCode,
      selectedDate,
      baseDuration,
      extensionDuration,
      totalAmount,
      totalDurationMins,
      loadAvailability,
      toast,
    ]
  );

  // Handle "Book via WhatsApp" button click
  const handleBookClick = (e) => {
    e?.preventDefault();
    setBookingError('');

    if (!selectedSlot) {
      setBookingError('Please select an available time slot.');
      return;
    }

    // 1. If unauthenticated, open AuthModal first, then open TermsModal with checkbox
    if (!user) {
      onRequireLogin?.((verifiedUser) => {
        setPendingBookingUser(verifiedUser);
        setTermsPreviewOnly(false);
        setTermsModalOpen(true);
      });
      return;
    }

    // 2. If already logged in, open TermsModal with checkbox before locking slot
    setPendingBookingUser(user);
    setTermsPreviewOnly(false);
    setTermsModalOpen(true);
  };

  const currentScreenObj =
    GTA6_SCREENS.find((s) => s.code === selectedScreenCode) || GTA6_SCREENS[0];

  return (
    <div className="relative min-h-screen bg-obsidian text-white pt-28 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* MINIMAL HEADER */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-neon uppercase tracking-wider">
              <Flame size={13} /> GTA VI PS5 Session
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
              Book Your GTA 6 Slot
            </h1>
          </div>
          {user && (
            <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/10 bg-[#0d1017] px-3 py-1 text-xs text-white/75">
              <span>{user.email || user.phone}</span>
            </div>
          )}
        </div>

        {/* PROMINENT TERMS NOTICE */}
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3.5 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-amber-400 shrink-0" />
            <p className="font-semibold text-amber-200">
              Controller sharing is not allowed for GTA 6. Please read our{' '}
              <button
                type="button"
                onClick={() => {
                  setPendingBookingUser(user);
                  setTermsPreviewOnly(false);
                  setTermsModalOpen(true);
                }}
                className="cursor-pointer underline decoration-amber-400/60 underline-offset-2 hover:text-white font-bold"
              >
                terms and conditions
              </button>
              .
            </p>
          </div>
        </div>

        {/* CONFIRMATION / REDIRECT VIEW */}
        {pendingConfirmation ? (
          <div className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-neon/40 bg-[#0d1017] p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Prominent On-Screen Lock & Redirect Banner */}
            <div className="rounded-2xl border border-neon/40 bg-neon/10 p-4 text-center space-y-1.5">
              <div className="inline-flex items-center justify-center gap-2 text-neon font-display text-base sm:text-lg font-extrabold">
                {isRedirecting ? (
                  <RefreshCw size={18} className="animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 size={18} className="shrink-0" />
                )}
                <span>Slot locked for 15 minutes! Redirecting to WhatsApp...</span>
              </div>
              <p className="text-xs text-white/70 font-mono">
                Hold expires in {formattedTimer} · Send your payment screenshot on WhatsApp to confirm.
              </p>
            </div>

            {/* Order ID & Summary */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-obsidian p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                  Order ID
                </p>
                <p className="font-mono text-2xl font-black text-amber-400 mt-0.5">
                  {pendingConfirmation.orderId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(pendingConfirmation.orderId);
                  setCopiedOrderId(true);
                  setTimeout(() => setCopiedOrderId(false), 2000);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 cursor-pointer"
              >
                {copiedOrderId ? (
                  <>
                    <Check size={14} className="text-neon" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy ID
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-obsidian p-4 text-xs">
              <div>
                <p className="text-[10px] uppercase text-white/45">Screen</p>
                <p className="font-bold text-white mt-0.5 text-sm">
                  {pendingConfirmation.screenName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/45">Date &amp; Slot</p>
                <p className="font-bold text-neon mt-0.5 text-sm">
                  {pendingConfirmation.startTime} · {pendingConfirmation.date}
                </p>
              </div>
              <div className="border-t border-white/10 pt-2.5">
                <p className="text-[10px] uppercase text-white/45">Duration</p>
                <p className="font-bold text-white mt-0.5">
                  {pendingConfirmation.duration} Mins
                </p>
              </div>
              <div className="border-t border-white/10 pt-2.5">
                <p className="text-[10px] uppercase text-white/45">Total Amount</p>
                <p className="font-display font-extrabold text-neon mt-0.5 text-base">
                  ₹{pendingConfirmation.totalAmount}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={pendingConfirmation.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neon text-obsidian font-display font-extrabold text-sm hover:bg-neon/90 transition-all cursor-pointer"
              >
                <Share2 size={17} /> Book via WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  setPendingConfirmation(null);
                  setIsRedirecting(false);
                  loadAvailability(selectedDate);
                }}
                className="h-10 w-full rounded-xl border border-white/10 bg-transparent text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Change Slot
              </button>
            </div>
          </div>
        ) : (
          /* ULTRA-CLEAN MINIMAL BOOKING FORM */
          <form
            onSubmit={handleBookClick}
            className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"
          >
            {/* LEFT 7 COLUMNS: CONTROLS */}
            <div className="space-y-4 lg:col-span-7">
              {/* 1. SCREEN SELECTION (STRICTLY SCREEN 1 & SCREEN 2) */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
                  1. Choose Screen
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {GTA6_SCREENS.map((scr) => {
                    const active = selectedScreenCode === scr.code;
                    return (
                      <button
                        key={scr.code}
                        type="button"
                        onClick={() => setSelectedScreenCode(scr.code)}
                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] shadow-[0_0_20px_-8px_rgba(0,255,102,0.4)]'
                            : 'border-white/10 bg-obsidian hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-display text-base font-bold ${
                              active ? 'text-neon' : 'text-white'
                            }`}
                          >
                            {scr.name}
                          </span>
                          <Tv
                            size={15}
                            className={active ? 'text-neon' : 'text-white/40'}
                          />
                        </div>
                        <p className="mt-1 text-xs text-white/65">{scr.tv}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. BASE SESSION & EXTENSIONS */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-4">
                <div>
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-white/50">
                    2. Base Session
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['30', '60'].map((mins) => {
                      const active = baseDuration === mins;
                      const price = gtaPricing.sessions[mins] || (mins === '30' ? 150 : 250);
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setBaseDuration(mins)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                            active
                              ? 'border-neon bg-neon text-obsidian font-bold'
                              : 'border-white/10 bg-obsidian text-white hover:border-white/25'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-semibold">
                            {mins === '60' ? '60 Mins (1 Hr)' : '30 Mins'}
                          </span>
                          <span
                            className={`font-display text-sm font-extrabold ${
                              active ? 'text-obsidian' : 'text-neon'
                            }`}
                          >
                            ₹{price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Extensions */}
                <div className="border-t border-white/10 pt-3.5">
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-white/50">
                    Add Extensions
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { mins: '0', label: 'None', price: 0 },
                      {
                        mins: '30',
                        label: '+30 Mins',
                        price: gtaPricing.extensions['30'] || 130,
                      },
                      {
                        mins: '60',
                        label: '+60 Mins',
                        price: gtaPricing.extensions['60'] || 230,
                      },
                    ].map((ext) => {
                      const active = extensionDuration === ext.mins;
                      return (
                        <button
                          key={ext.mins}
                          type="button"
                          onClick={() => setExtensionDuration(ext.mins)}
                          className={`cursor-pointer rounded-xl border p-2.5 text-center transition-all ${
                            active
                              ? 'border-neon bg-neon/15 text-neon font-bold'
                              : 'border-white/10 bg-obsidian text-white/70 hover:border-white/25'
                          }`}
                        >
                          <p className="text-xs font-semibold">{ext.label}</p>
                          <p className="text-[11px] font-mono mt-0.5 opacity-80">
                            {ext.price > 0 ? `+₹${ext.price}` : '₹0'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. DATE & TIME SLOT */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                    3. Date &amp; Time Slot
                  </p>
                  {loadingSlots ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50">
                      <RefreshCw size={11} className="animate-spin text-neon" />
                      Syncing...
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-neon" /> Selected
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-white/30" /> Available
                      </span>
                      <span className="flex items-center gap-1 text-red-400/80">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Booked/Locked
                      </span>
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="mb-3.5 flex items-center gap-2 overflow-x-auto pb-1">
                  {DATES.map((d) => {
                    const active = selectedDate === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDate(d.id)}
                        className={`shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-center transition-all ${
                          active
                            ? 'border-neon bg-neon/10 text-white'
                            : 'border-white/10 bg-obsidian text-white/60 hover:border-white/25'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-semibold uppercase ${
                            active ? 'text-neon' : 'text-white/45'
                          }`}
                        >
                          {d.label}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-white">{d.sub}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {computedTimeSlots.map((item) => {
                    const isUnavailable =
                      item.status === 'booked' || item.status === 'locked';
                    const isSelected =
                      !isUnavailable && selectedSlot === item.time;

                    return (
                      <button
                        key={item.time}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => !isUnavailable && setSelectedSlot(item.time)}
                        className={`flex flex-col items-center justify-center rounded-xl border py-2.5 px-2 text-center transition-all ${
                          isUnavailable
                            ? 'cursor-not-allowed border-red-500/30 bg-red-500/10 text-red-400/50 opacity-60 select-none'
                            : isSelected
                            ? 'cursor-pointer border-neon bg-neon text-obsidian font-bold shadow-[0_0_15px_-4px_rgba(0,255,102,0.5)]'
                            : 'cursor-pointer border-white/10 bg-obsidian text-white/85 hover:border-white/30'
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold ${
                            isUnavailable ? 'line-through' : ''
                          }`}
                        >
                          {item.time}
                        </span>
                        {isUnavailable && (
                          <span className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] font-bold uppercase text-red-400/80">
                            <Ban size={9} />
                            {item.status === 'locked' ? 'Locked' : 'Booked'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLUMNS: MINIMAL SUMMARY & CTA */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/15 bg-[#0d1017] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-display text-base font-bold text-white">
                    Booking Summary
                  </span>
                  <span className="font-mono text-xs text-neon font-semibold">
                    {totalDurationMins} Mins Total
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-obsidian p-3.5 text-xs">
                  <div>
                    <p className="text-[10px] uppercase text-white/45">Screen</p>
                    <p className="font-bold text-white mt-0.5">
                      {currentScreenObj.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/45">Slot</p>
                    <p className="font-bold text-neon mt-0.5">
                      {selectedSlot || 'None'}
                    </p>
                    <p className="text-[10px] text-white/50">{selectedDate}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs px-1">
                  <div className="flex justify-between text-white/75">
                    <span>Base Session ({baseDuration} Mins)</span>
                    <span className="font-mono font-semibold text-white">
                      ₹{baseCost}
                    </span>
                  </div>
                  {extensionDuration !== '0' && (
                    <div className="flex justify-between text-neon">
                      <span>Extension (+{extensionDuration} Mins)</span>
                      <span className="font-mono font-semibold">+₹{extCost}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-2.5">
                    <span className="font-bold text-white">Total Payable</span>
                    <span className="font-display text-2xl font-black text-neon">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {bookingError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
                    {bookingError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedSlot}
                  className="h-12 w-full rounded-xl bg-neon hover:bg-neon/90 text-obsidian text-sm font-extrabold cursor-pointer shadow-lg shadow-neon/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Locking Slot...
                    </>
                  ) : (
                    <>
                      <Share2 size={17} className="mr-2" />
                      Book via WhatsApp
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] text-white/45">
                  Locks your slot for 15 minutes and opens WhatsApp to confirm.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* TERMS & CONDITIONS ACCEPTANCE MODAL (Opens after login & before slot lock) */}
      <TermsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
        requireAcceptance={!termsPreviewOnly}
        onAccept={() => {
          executeSlotLock(pendingBookingUser || user);
        }}
      />
    </div>
  );
}
