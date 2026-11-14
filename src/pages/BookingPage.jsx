import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Ticket,
  CheckCircle2,
  Gamepad2,
  Users,
  Flame,
  Gauge,
  Tv,
  QrCode,
  ArrowLeft,
  RefreshCw,
  Clock,
  Calendar,
  Share2,
  Sparkles,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeToast } from '@/components/SwipeToast';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';
import { openCashfreeCheckout } from '@/services/cashfree';
import { socket } from '@/services/socket';

const { screens, pricingMatrix: defaultPricingMatrix, loungeInfo } = gridData;

const MODE_OPTIONS = [
  {
    key: 'Single',
    label: '1 Player',
    tag: 'Solo',
    icon: Gamepad2,
  },
  {
    key: 'Dual',
    label: '2 Players',
    tag: 'Duo',
    icon: Users,
  },
  {
    key: 'Triple',
    label: '3 Players',
    tag: 'Trio',
    icon: Users,
  },
  {
    key: 'Big',
    label: '4 Players',
    tag: 'Squad',
    icon: Users,
  },
  {
    key: 'SimDrive',
    label: 'SimDrive',
    tag: 'Racing Rig',
    icon: Gauge,
  },
  {
    key: 'GTA6_Launch',
    label: 'GTA 6 Special',
    tag: 'Launch Pass',
    icon: Flame,
  },
];

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
    const fullLabel = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    result.push({ id, label, sub, fullLabel });
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
  const [h, m] = trimmed.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function checkOverlap(slot1Str, dur1, slot2Str, dur2) {
  const s1 = to24HourMinutes(slot1Str);
  const e1 = s1 + Number(dur1 || 60);
  const s2 = to24HourMinutes(slot2Str);
  const e2 = s2 + Number(dur2 || 60);
  return Math.max(s1, s2) < Math.min(e1, e2);
}

function normalizeBookingScreenCode(item) {
  if (!item) return 'Screen1';
  if (item.screenCode && /^Screen[123]$/i.test(item.screenCode)) {
    return `Screen${item.screenCode.slice(-1)}`;
  }
  const raw = String(item.screenCode || item.station || '');
  if (/simdrive/i.test(raw)) return 'Screen3';
  const match = raw.match(/(\d+)/);
  if (match) return `Screen${match[1]}`;
  return 'Screen1';
}

function normalizeModeParam(rawMode) {
  if (!rawMode) return 'Single';
  if (rawMode === 'GTA6' || rawMode === 'GTA6_Launch') return 'GTA6_Launch';
  if (defaultPricingMatrix[rawMode]) return rawMode;
  return 'Single';
}

function normalizeScreenParam(rawScreen, modeKey) {
  if (modeKey === 'SimDrive') return 'Screen3';
  if (rawScreen && screens.some((s) => s.code === rawScreen)) {
    return rawScreen;
  }
  return 'Screen1';
}

function getGamesForScreen(screenCode, dbGames, staticScreens) {
  if (Array.isArray(dbGames) && dbGames.length > 0) {
    const screenNum = parseInt(String(screenCode).replace(/\D/g, ''), 10);
    const matched = dbGames.filter((g) => {
      if (!g.availableScreens || g.availableScreens.length === 0) return true;
      return g.availableScreens.some((s) => {
        const sNum = s.screenId !== undefined ? Number(s.screenId) : null;
        const sCode = s.code || (sNum ? `Screen${sNum}` : null);
        return (
          sNum === screenNum ||
          sCode === screenCode ||
          (s.name && s.name.toLowerCase().includes(`screen ${screenNum}`))
        );
      });
    });
    if (matched.length > 0) {
      return matched.map((g) => g.title);
    }
  }
  const fallback = staticScreens.find((s) => s.code === screenCode);
  return fallback?.games || [];
}

export default function BookingPage({ user, onRequireLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useSwipeToast();

  const initialMode = normalizeModeParam(searchParams.get('mode'));
  const initialScreen = normalizeScreenParam(
    searchParams.get('screen'),
    initialMode
  );
  const queryDuration = String(searchParams.get('duration') || '60');
  const queryGame = searchParams.get('game') || '';

  const [liveMatrix, setLiveMatrix] = useState(defaultPricingMatrix);
  const [charges, setCharges] = useState({
    convenienceFee: 15,
    gstPercent: 18,
  });
  const [dbGames, setDbGames] = useState([]);
  const [selectedScreenCode, setSelectedScreenCode] = useState(initialScreen);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [duration, setDuration] = useState(
    ['15', '30', '60'].includes(queryDuration) ? queryDuration : '60'
  );
  const [selectedDate, setSelectedDate] = useState(DATES[0].id);
  const [selectedSlot, setSelectedSlot] = useState('07:00 PM');
  const [selectedGames, setSelectedGames] = useState(() =>
    queryGame ? [queryGame] : []
  );

  const [bookedSlots, setBookedSlots] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);

  const currentScreen =
    screens.find((s) => s.code === selectedScreenCode) || screens[0];

  const currentScreenGames = useMemo(
    () => getGamesForScreen(selectedScreenCode, dbGames, screens),
    [selectedScreenCode, dbGames]
  );

  useEffect(() => {
    setSelectedGames((prev) => {
      const valid = prev.filter((g) => currentScreenGames.includes(g));
      if (valid.length > 0) return valid;
      if (queryGame && currentScreenGames.includes(queryGame)) {
        return [queryGame];
      }
      return currentScreenGames.length > 0 ? [currentScreenGames[0]] : [];
    });
  }, [selectedScreenCode, currentScreenGames, queryGame]);

  useEffect(() => {
    if (selectedMode === 'GTA6_Launch' && duration === '15') {
      setDuration('60');
    }
  }, [selectedMode, duration]);

  useEffect(() => {
    let active = true;
    bookingService
      .getPublicConfig()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data?.games)) {
          setDbGames(data.games);
        }
        if (data?.charges) {
          setCharges({
            convenienceFee:
              data.charges.convenienceFee !== undefined
                ? Number(data.charges.convenienceFee)
                : 15,
            gstPercent:
              data.charges.gstPercent !== undefined
                ? Number(data.charges.gstPercent)
                : 18,
          });
        }
        if (!data?.pricing?.matrix) return;
        setLiveMatrix((prev) => {
          const merged = { ...prev };
          for (const key of Object.keys(prev)) {
            if (data.pricing.matrix[key]) {
              merged[key] = {
                ...prev[key],
                sessions: {
                  ...prev[key].sessions,
                  ...data.pricing.matrix[key].sessions,
                },
                extensions: {
                  ...prev[key].extensions,
                  ...data.pricing.matrix[key].extensions,
                },
              };
            }
          }
          return merged;
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
      // Keep current state if offline
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability(selectedDate);
  }, [selectedDate, selectedScreenCode, loadAvailability]);

  useEffect(() => {
    const handleRefreshBookings = () => {
      loadAvailability(selectedDate);
    };

    const handleLocksUpdated = (locks) => {
      if (Array.isArray(locks)) {
        setLockedSlots(locks.filter((l) => l.date === selectedDate));
      }
    };

    socket.on('booking_created', handleRefreshBookings);
    socket.on('booking_updated', handleRefreshBookings);
    socket.on('booking_deleted', handleRefreshBookings);
    socket.on('slots_locked_updated', handleLocksUpdated);

    return () => {
      socket.off('booking_created', handleRefreshBookings);
      socket.off('booking_updated', handleRefreshBookings);
      socket.off('booking_deleted', handleRefreshBookings);
      socket.off('slots_locked_updated', handleLocksUpdated);
    };
  }, [selectedDate, loadAvailability]);

  const handleSelectScreen = (screenCode) => {
    setBookingError('');
    setSelectedScreenCode(screenCode);
    if (screenCode !== 'Screen3' && selectedMode === 'SimDrive') {
      setSelectedMode('Single');
    }
  };

  const handleSelectMode = (modeKey) => {
    setBookingError('');
    setSelectedMode(modeKey);
    if (modeKey === 'SimDrive') {
      setSelectedScreenCode('Screen3');
    }
    if (modeKey === 'GTA6_Launch' && duration === '15') {
      setDuration('60');
    }
  };

  const toggleGame = (gameTitle) => {
    setSelectedGames((prev) => {
      const exists = prev.includes(gameTitle);
      if (exists && prev.length === 1) return prev;
      return exists
        ? prev.filter((g) => g !== gameTitle)
        : [...prev, gameTitle];
    });
  };

  const currentModeConfig =
    liveMatrix[selectedMode] ||
    defaultPricingMatrix[selectedMode] ||
    defaultPricingMatrix.Single;

  const availableDurations =
    selectedMode === 'GTA6_Launch'
      ? [
          { mins: '30', label: '30 Mins' },
          { mins: '60', label: '1 Hour' },
        ]
      : [
          { mins: '15', label: '15 Mins' },
          { mins: '30', label: '30 Mins' },
          { mins: '60', label: '1 Hour' },
        ];

  const effectiveDuration =
    selectedMode === 'GTA6_Launch' && duration === '15' ? '60' : duration;
  const baseSessionPrice =
    currentModeConfig.sessions[effectiveDuration] ||
    currentModeConfig.sessions['60'] ||
    0;

  const taxAmount = Math.round((baseSessionPrice * charges.gstPercent) / 100);
  const convenienceFee = charges.convenienceFee;
  const totalPayable = baseSessionPrice + taxAmount + convenienceFee;
  const price = totalPayable;

  const computedTimeSlots = useMemo(() => {
    return BASE_TIME_SLOTS.map((timeLabel) => {
      const isBookedInDb = bookedSlots.some(
        (b) =>
          normalizeBookingScreenCode(b) === selectedScreenCode &&
          checkOverlap(timeLabel, effectiveDuration, b.startTime, b.duration)
      );

      const isLockedByOther = lockedSlots.some(
        (l) =>
          normalizeBookingScreenCode(l) === selectedScreenCode &&
          l.socketId !== socket.id &&
          checkOverlap(timeLabel, effectiveDuration, l.startTime, l.duration)
      );

      return {
        time: timeLabel,
        status: isBookedInDb
          ? 'booked'
          : isLockedByOther
          ? 'locked'
          : 'available',
      };
    });
  }, [bookedSlots, lockedSlots, selectedScreenCode, effectiveDuration]);

  // Automatically ensure selectedSlot never stays on a booked/locked slot
  useEffect(() => {
    const currentItem = computedTimeSlots.find((s) => s.time === selectedSlot);
    if (!currentItem || currentItem.status !== 'available') {
      const firstAvailable = computedTimeSlots.find(
        (s) => s.status === 'available'
      );
      setSelectedSlot(firstAvailable ? firstAvailable.time : '');
    }
  }, [computedTimeSlots, selectedSlot]);

  const handleSelectTimeSlot = (timeLabel) => {
    setBookingError('');
    setSelectedSlot(timeLabel);
    if (socket.connected) {
      socket.emit('lock_slot', {
        screenCode: selectedScreenCode,
        date: selectedDate,
        startTime: timeLabel,
        duration: Number(effectiveDuration),
      });
    }
  };

  const applyVerifiedTicket = useCallback(
    (ticket) => {
      const matchedScreen =
        screens.find((s) => s.code === ticket.screenCode) || currentScreen;
      const modeCfg =
        liveMatrix[ticket.mode] ||
        defaultPricingMatrix[ticket.mode] ||
        currentModeConfig;
      const modeLabel =
        ticket.mode === 'Triple'
          ? '3 Players'
          : `${modeCfg.players} ${modeCfg.players === 1 ? 'Player' : 'Players'}`;
      const dateLabel =
        DATES.find((d) => d.id === ticket.date)?.fullLabel || ticket.date;

      const createdPass = {
        ticketToken:
          ticket.ticketToken || ticket.bookingCode || ticket.bookingId,
        bookingId: ticket.bookingCode || ticket.bookingId,
        customerName: ticket.customerName || user?.name || 'Grid Player',
        screenCode: matchedScreen.code,
        screenName: matchedScreen.name,
        screenTv: matchedScreen.tv,
        modeKey: ticket.mode,
        modeLabel,
        date: dateLabel,
        rawDate: ticket.date,
        duration: Number(ticket.duration),
        slot: ticket.startTime || ticket.slot,
        endTime: ticket.endTime || '',
        baseAmount: Number(ticket.baseAmount || 0),
        taxAmount: Number(ticket.taxAmount || 0),
        convenienceFee: Number(ticket.convenienceFee || 0),
        totalAmount:
          ticket.totalAmount !== undefined ? ticket.totalAmount : ticket.price,
        price:
          ticket.totalAmount !== undefined ? ticket.totalAmount : ticket.price,
        phone: user?.phone || '',
        games:
          ticket.selectedGames?.length > 0
            ? ticket.selectedGames
            : getGamesForScreen(matchedScreen.code, dbGames, screens),
      };

      localStorage.setItem('grid_last_pass', JSON.stringify(createdPass));
      setConfirmedPass(createdPass);
      loadAvailability(ticket.date || selectedDate);
      toast.success(
        'Booking Confirmed!',
        `${matchedScreen.name} booked for ${createdPass.date} at ${createdPass.slot}.`
      );
    },
    [
      currentScreen,
      liveMatrix,
      currentModeConfig,
      selectedDate,
      loadAvailability,
      user?.name,
      user?.phone,
      toast,
      dbGames,
    ]
  );

  useEffect(() => {
    const returnOrderId = searchParams.get('order_id');
    if (!returnOrderId) return;

    let active = true;
    setIsProcessing(true);
    setBookingError('');

    bookingService
      .verifyPaymentOrder(returnOrderId)
      .then((res) => {
        if (!active) return;
        if (res?.verified && res?.ticket) {
          applyVerifiedTicket(res.ticket);
        }
      })
      .catch((err) => {
        if (!active) return;
        const msg =
          err.response?.data?.error ||
          'Could not verify payment status. If amount was deducted, please contact support.';
        setBookingError(msg);
        toast.error('Payment Verification', msg);
      })
      .finally(() => {
        if (active) setIsProcessing(false);
      });

    return () => {
      active = false;
    };
  }, [searchParams, applyVerifiedTicket, toast]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      toast.warning(
        'No Available Slot Selected',
        'Please pick an available time slot or switch to another screen/date.'
      );
      return;
    }

    if (!user) {
      toast.info(
        'Sign In Required',
        'Verify your WhatsApp number to confirm your pass.'
      );
      onRequireLogin?.();
      return;
    }

    setBookingError('');
    setIsProcessing(true);

    const modeDisplayLabel =
      selectedMode === 'Triple'
        ? '3 Players'
        : `${currentModeConfig.players} ${
            currentModeConfig.players === 1 ? 'Player' : 'Players'
          }`;
    const dateDisplayLabel =
      DATES.find((d) => d.id === selectedDate)?.fullLabel || selectedDate;

    try {
      const orderData = await bookingService.createPaymentOrder({
        customerName: user.name || 'Grid Player',
        phoneNumber: user.phone,
        screenCode: currentScreen.code,
        mode: selectedMode,
        date: selectedDate,
        startTime: selectedSlot,
        duration: Number(effectiveDuration),
        selectedGames:
          selectedGames.length > 0
            ? selectedGames
            : currentScreenGames.length > 0
            ? [currentScreenGames[0]]
            : ['Game'],
        returnUrl: `${window.location.origin}/book?order_id={order_id}`,
      });

      const checkoutResult = await openCashfreeCheckout({
        paymentSessionId: orderData.paymentSessionId,
        mode: orderData.sdkMode || 'sandbox',
        redirectTarget: '_modal',
      });

      if (checkoutResult?.error) {
        const msg =
          checkoutResult.error.message ||
          'Payment window was closed before completion.';
        setBookingError(msg);
        toast.warning('Payment Not Completed', msg);
        return;
      }

      const verifyRes = await bookingService.verifyPaymentOrder(
        orderData.orderId
      );

      if (verifyRes?.verified && verifyRes?.ticket) {
        applyVerifiedTicket(verifyRes.ticket);
      } else {
        const msg =
          verifyRes?.error || 'Payment could not be verified. Please try again.';
        setBookingError(msg);
        toast.error('Payment Verification Failed', msg);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        const errMsg = error.response.data.error;
        setBookingError(errMsg);
        toast.error('Slot Unavailable', errMsg);
        loadAvailability(selectedDate);
      } else if (import.meta.env.DEV && !error.response) {
        const fallbackPass = {
          ticketToken: `GRID-${Math.floor(100000 + Math.random() * 900000)}`,
          bookingId: `GRID-${Math.floor(100000 + Math.random() * 900000)}`,
          customerName: user.name || 'Grid Player',
          screenCode: currentScreen.code,
          screenName: currentScreen.name,
          screenTv: currentScreen.tv,
          modeKey: selectedMode,
          modeLabel: modeDisplayLabel,
          date: dateDisplayLabel,
          rawDate: selectedDate,
          duration: Number(effectiveDuration),
          slot: selectedSlot,
          baseAmount: baseSessionPrice,
          taxAmount,
          convenienceFee,
          totalAmount: totalPayable,
          price: totalPayable,
          phone: user.phone,
          games:
            selectedGames.length > 0
              ? selectedGames
              : currentScreenGames.length > 0
              ? [currentScreenGames[0]]
              : ['Game'],
        };
        localStorage.setItem('grid_last_pass', JSON.stringify(fallbackPass));
        setConfirmedPass(fallbackPass);
        toast.success('Pass Created (Dev Mode)', `${currentScreen.name} · ${selectedSlot}`);
      } else {
        const msg =
          error.message || 'Unable to process payment right now. Please try again.';
        setBookingError(msg);
        toast.error('Booking Error', msg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const activeDateObj =
    DATES.find((d) => d.id === selectedDate) || DATES[0];
  const activeModeObj =
    MODE_OPTIONS.find((m) => m.key === selectedMode) || MODE_OPTIONS[0];

  return (
    <section className="min-h-screen bg-obsidian pt-28 sm:pt-32 pb-32 lg:pb-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Minimal Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mb-1.5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-white/55 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Home
            </button>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Book Your Session
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/70">
            <Clock size={13} className="text-neon" />
            <span>Open Daily · 10 AM – 10 PM</span>
          </div>
        </div>

        {/* CONFIRMED PASS VIEW */}
        {confirmedPass ? (
          <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-neon/40 bg-[#0d1017] shadow-2xl">
            <div className="bg-gradient-to-r from-neon/15 via-neon/5 to-transparent px-6 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-neon/15 px-3 py-0.5 text-[11px] font-bold text-neon">
                  <CheckCircle2 size={13} /> Booking Confirmed
                </span>
                <span className="font-mono text-xs font-bold text-white/80">
                  {confirmedPass.bookingId}
                </span>
              </div>
              <h2 className="font-display mt-3 text-2xl font-bold text-white">
                You&apos;re Ready to Play!
              </h2>
              <p className="mt-0.5 text-xs text-white/60">
                Show this pass at The Grid counter when you arrive.
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Big 2x2 Key Info Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-obsidian p-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Screen
                  </p>
                  <p className="mt-0.5 font-display text-base font-bold text-white">
                    {confirmedPass.screenName}
                  </p>
                  <p className="text-[11px] text-white/55">
                    {confirmedPass.screenTv}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Time Slot
                  </p>
                  <p className="mt-0.5 font-display text-base font-bold text-neon">
                    {confirmedPass.slot}
                  </p>
                  <p className="text-[11px] text-white/55">
                    {confirmedPass.date}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Players &amp; Mode
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {confirmedPass.modeLabel}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Duration &amp; Paid
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    {confirmedPass.duration} Mins ·{' '}
                    <span className="text-neon font-bold">
                      ₹{confirmedPass.price}
                    </span>
                  </p>
                  {confirmedPass.taxAmount > 0 && (
                    <p className="mt-0.5 text-[10px] text-white/45">
                      Session ₹{confirmedPass.baseAmount} + Tax ₹{confirmedPass.taxAmount} + Fee ₹{confirmedPass.convenienceFee}
                    </p>
                  )}
                </div>
              </div>

              {/* Counter Pass Code Box */}
              <div className="flex items-center justify-between rounded-2xl border border-neon/30 bg-neon/[0.05] px-5 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neon">
                    Counter Entry ID
                  </p>
                  <p className="font-mono mt-0.5 text-xl font-extrabold tracking-wider text-white">
                    {confirmedPass.bookingId}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    Player: {confirmedPass.customerName}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-neon/30 bg-obsidian text-neon">
                  <QrCode size={34} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Button
                  onClick={() =>
                    navigate(
                      `/ticket/${confirmedPass.ticketToken || confirmedPass.bookingId}`
                    )
                  }
                  className="h-11 cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
                >
                  <Share2 size={14} className="mr-1.5" />
                  Open Full Pass
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmedPass(null)}
                  className="h-11 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs font-semibold text-white hover:bg-white/[0.06]"
                >
                  Book Another Slot
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* STREAMLINED 3-STEP BUILDER + LIVE PASS SUMMARY */
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* LEFT 8 COLUMNS: 3 SIMPLE STEPS */}
            <div className="space-y-5 lg:col-span-8">
              {/* STEP 1: Choose Screen */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon text-xs font-bold text-obsidian">
                      1
                    </span>
                    <h2 className="font-display text-base font-bold text-white sm:text-lg">
                      Choose Your Screen
                    </h2>
                  </div>
                  <span className="text-[11px] text-white/45">
                    PS5 4K HDR Stations
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {screens.map((scr) => {
                    const active = selectedScreenCode === scr.code;
                    const hasSim = Boolean(scr.simRig?.available);

                    return (
                      <button
                        key={scr.code}
                        type="button"
                        onClick={() => handleSelectScreen(scr.code)}
                        className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] shadow-[0_0_20px_-8px_rgba(0,255,102,0.4)]'
                            : 'border-white/10 bg-obsidian hover:border-white/25'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-display text-base font-bold ${
                                active ? 'text-neon' : 'text-white'
                              }`}
                            >
                              {scr.name}
                            </span>
                            {hasSim ? (
                              <Gauge
                                size={16}
                                className={active ? 'text-neon' : 'text-cyber'}
                              />
                            ) : (
                              <Tv
                                size={16}
                                className={
                                  active ? 'text-neon' : 'text-white/45'
                                }
                              />
                            )}
                          </div>

                          <p className="mt-1 text-xs font-medium text-white/80">
                            {scr.tv}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/50">
                            {hasSim
                              ? 'PS5 + Logitech G923 Racing Rig'
                              : 'PS5 · 1 to 4 Players'}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[11px]">
                          <span className="text-white/45">
                            {getGamesForScreen(scr.code, dbGames, screens).length} Games Ready
                          </span>
                          <span
                            className={`font-semibold ${
                              active ? 'text-neon' : 'text-white/40'
                            }`}
                          >
                            {active ? 'Selected' : 'Pick'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Compact Game Pills for Selected Screen */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="mr-1 flex items-center gap-1 text-[11px] font-medium text-white/50">
                    <Gamepad2 size={12} className="text-neon" />
                    Games on {currentScreen.name}:
                  </span>
                  {currentScreenGames.map((gameTitle) => {
                    const isPicked = selectedGames.includes(gameTitle);
                    return (
                      <button
                        key={gameTitle}
                        type="button"
                        onClick={() => toggleGame(gameTitle)}
                        className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all ${
                          isPicked
                            ? 'border-neon/60 bg-neon/15 text-neon font-semibold'
                            : 'border-white/10 bg-obsidian text-white/65 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {isPicked ? `✓ ${gameTitle}` : gameTitle}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Players & Duration */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon text-xs font-bold text-obsidian">
                      2
                    </span>
                    <h2 className="font-display text-base font-bold text-white sm:text-lg">
                      Players &amp; Duration
                    </h2>
                  </div>
                  <span className="text-[11px] text-white/45">
                    Instant price preview
                  </span>
                </div>

                {/* Player / Mode Grid */}
                <p className="mb-2 text-xs font-medium text-white/60">
                  How many players?
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {MODE_OPTIONS.map((m) => {
                    const Icon = m.icon;
                    const active = selectedMode === m.key;
                    const mConfig =
                      liveMatrix[m.key] || defaultPricingMatrix[m.key];
                    const previewDuration =
                      m.key === 'GTA6_Launch' && effectiveDuration === '15'
                        ? '60'
                        : effectiveDuration;
                    const modePrice = mConfig.sessions[previewDuration];

                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => handleSelectMode(m.key)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] text-white'
                            : 'border-white/10 bg-obsidian text-white/80 hover:border-white/25'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              size={14}
                              className={
                                active
                                  ? 'text-neon shrink-0'
                                  : 'text-white/50 shrink-0'
                              }
                            />
                            <p className="truncate text-xs font-bold text-white sm:text-sm">
                              {m.label}
                            </p>
                          </div>
                          <p className="mt-0.5 text-[11px] text-white/45">
                            {m.tag}
                          </p>
                        </div>
                        <span
                          className={`ml-2 shrink-0 text-xs font-bold ${
                            active ? 'text-neon' : 'text-white/60'
                          }`}
                        >
                          ₹{modePrice}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Duration Pills */}
                <p className="mt-4 mb-2 text-xs font-medium text-white/60">
                  How long do you want to play?
                </p>
                <div
                  className={`grid gap-2.5 ${
                    availableDurations.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  }`}
                >
                  {availableDurations.map((d) => {
                    const active = effectiveDuration === d.mins;
                    const dPrice = currentModeConfig.sessions[d.mins];

                    return (
                      <button
                        key={d.mins}
                        type="button"
                        onClick={() => setDuration(d.mins)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                          active
                            ? 'border-neon bg-neon text-obsidian font-bold'
                            : 'border-white/10 bg-obsidian text-white hover:border-white/25'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold">
                          {d.label}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-extrabold ${
                            active ? 'text-obsidian' : 'text-neon'
                          }`}
                        >
                          ₹{dPrice}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Date & Time */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5">
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon text-xs font-bold text-obsidian">
                      3
                    </span>
                    <h2 className="font-display text-base font-bold text-white sm:text-lg">
                      Pick Date &amp; Time
                    </h2>
                  </div>

                  {loadingSlots ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50">
                      <RefreshCw size={11} className="animate-spin text-neon" />
                      Syncing slots...
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 text-[11px] text-white/55">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-neon" /> Selected
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white/30" /> Available
                      </span>
                      <span className="flex items-center gap-1.5 text-red-400/80">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Booked
                      </span>
                    </div>
                  )}
                </div>

                {/* Date Selector Row */}
                <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
                  {DATES.map((d) => {
                    const active = selectedDate === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDate(d.id)}
                        className={`shrink-0 cursor-pointer rounded-xl border px-3.5 py-2 text-center transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.1] text-white'
                            : 'border-white/10 bg-obsidian text-white/65 hover:border-white/25'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-semibold uppercase ${
                            active ? 'text-neon' : 'text-white/45'
                          }`}
                        >
                          {d.label}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-white">
                          {d.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Grid — Faded Red Disabled for Booked Slots */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
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
                        onClick={() =>
                          !isUnavailable && handleSelectTimeSlot(item.time)
                        }
                        title={
                          isUnavailable
                            ? `${item.time} is already booked on ${currentScreen.name}`
                            : `Select ${item.time}`
                        }
                        className={`flex flex-col items-center justify-center rounded-xl border py-2.5 px-2 text-center transition-all ${
                          isUnavailable
                            ? 'cursor-not-allowed border-red-500/35 bg-red-500/10 text-red-400/50 opacity-65 select-none'
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
                          <span className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400/80">
                            <Ban size={9} />
                            {item.status === 'locked' ? 'Held' : 'Booked'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT 4 COLUMNS: CLEAN TICKET SUMMARY CARD */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d1017] shadow-xl">
                <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-neon" />
                    <h2 className="font-display text-base font-bold text-white">
                      Your Pass Summary
                    </h2>
                  </div>
                  <span className="rounded-md border border-neon/30 bg-neon/10 px-2 py-0.5 text-[10px] font-semibold text-neon">
                    Instant Pass
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Clean 2x2 Summary Box */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-obsidian p-3.5 text-xs">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/45">
                        Screen
                      </p>
                      <p className="mt-0.5 font-bold text-white">
                        {currentScreen.name}
                      </p>
                      <p className="text-[11px] text-white/50">
                        {currentScreen.tv}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/45">
                        Mode &amp; Time
                      </p>
                      <p className="mt-0.5 font-bold text-white">
                        {activeModeObj.label}
                      </p>
                      <p className="text-[11px] text-white/50">
                        {effectiveDuration === '60'
                          ? '1 Hour'
                          : `${effectiveDuration} Mins`}
                      </p>
                    </div>

                    <div className="col-span-2 border-t border-white/10 pt-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/55">
                        <Calendar size={13} className="text-neon" />
                        {activeDateObj.fullLabel}
                      </span>
                      <span
                        className={`font-bold ${
                          selectedSlot ? 'text-neon' : 'text-red-400'
                        }`}
                      >
                        {selectedSlot || 'No Slot Available'}
                      </span>
                    </div>
                  </div>

                  {/* Selected Games Pill */}
                  <div className="flex items-center justify-between text-xs text-white/60 px-1">
                    <span>Selected Games</span>
                    <span className="max-w-[60%] truncate font-medium text-white">
                      {selectedGames.join(', ')}
                    </span>
                  </div>

                  {bookingError && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
                      {bookingError}
                    </div>
                  )}

                  {/* Transparent Itemized Breakdown Table */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      <span>Breakdown</span>
                      <span>Amount</span>
                    </div>

                    {/* 1. Session Cost */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white/90">Session Cost</p>
                        <p className="text-[11px] text-white/50">
                          {currentScreen.name} · {activeModeObj.label} ({effectiveDuration === '60' ? '1 Hour' : `${effectiveDuration} Mins`})
                        </p>
                      </div>
                      <span className="font-semibold text-white/90 shrink-0">
                        ₹{baseSessionPrice}
                      </span>
                    </div>

                    {/* 2. GST / Tax */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white/80">GST / Tax</p>
                        <p className="text-[11px] text-white/45">
                          Applicable Govt. GST ({charges.gstPercent}%)
                        </p>
                      </div>
                      <span className="font-medium text-white/80 shrink-0">
                        ₹{taxAmount}
                      </span>
                    </div>

                    {/* 3. Convenience Fee */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white/80">Convenience Fee</p>
                        <p className="text-[11px] text-white/45">
                          Instant slot hold & online gateway
                        </p>
                      </div>
                      <span className="font-medium text-white/80 shrink-0">
                        ₹{convenienceFee}
                      </span>
                    </div>

                    {/* Divider & Total */}
                    <div className="border-t border-white/10 pt-2.5 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white">Total Amount</span>
                        <p className="text-[10px] text-white/40">
                          Includes taxes & instant pass fee
                        </p>
                      </div>
                      <span className="font-display text-2xl font-extrabold text-neon">
                        ₹{totalPayable}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmBooking}
                    disabled={isProcessing || !selectedSlot}
                    className="h-12 w-full cursor-pointer rounded-xl bg-white text-sm font-bold text-obsidian transition-colors hover:bg-white/90 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Opening Payment...
                      </>
                    ) : !selectedSlot ? (
                      'All Slots Booked'
                    ) : (
                      <>
                        <Ticket size={17} className="mr-2" />
                        {user
                          ? `Pay ₹${totalPayable} & Get Pass`
                          : `Sign In to Book · ₹${totalPayable}`}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      {!confirmedPass && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-obsidian/95 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-white/60">
                {currentScreen.name} · {activeDateObj.label},{' '}
                {selectedSlot || 'Sold Out'}
              </p>
              <p className="font-display text-xl font-extrabold text-neon">
                ₹{totalPayable}{' '}
                <span className="text-xs font-normal text-white/50">
                  (incl. taxes & fee)
                </span>
              </p>
            </div>

            <Button
              onClick={handleConfirmBooking}
              disabled={isProcessing || !selectedSlot}
              className="h-11 rounded-xl bg-white px-5 text-xs font-bold text-obsidian hover:bg-white/90 disabled:opacity-50"
            >
              {isProcessing ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <>
                  <Ticket size={15} className="mr-1.5" />
                  {user ? 'Pay & Book' : 'Sign In & Book'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
