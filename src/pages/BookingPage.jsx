import React, { useState, useEffect } from 'react';
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
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import gridData from '@/data/gridData.json';

const { screens, pricingMatrix, loungeInfo } = gridData;

const MODE_OPTIONS = [
  {
    key: 'Single',
    label: 'Single (1P)',
    sub: '1 Player',
    icon: Gamepad2,
  },
  {
    key: 'Dual',
    label: 'Dual (2P)',
    sub: '2 Players',
    icon: Users,
  },
  {
    key: 'Triple',
    label: 'Triple (3P)',
    sub: '3 Players',
    icon: Users,
  },
  {
    key: 'Big',
    label: 'Big (4P)',
    sub: '4 Players',
    icon: Users,
  },
  {
    key: 'SimDrive',
    label: 'SimDrive',
    sub: 'Racing Cockpit (Screen 3)',
    icon: Gauge,
  },
  {
    key: 'GTA6_Launch',
    label: 'GTA 6 Launch Special',
    sub: 'First 7 Days Exclusive',
    icon: Flame,
  },
];

// Clean time slots between 10:00 AM and 10:00 PM
const TIME_SLOTS = [
  { time: '10:00 AM', status: 'available' },
  { time: '11:00 AM', status: 'available' },
  { time: '12:00 PM', status: 'booked' },
  { time: '01:00 PM', status: 'available' },
  { time: '02:00 PM', status: 'available' },
  { time: '03:00 PM', status: 'available' },
  { time: '04:00 PM', status: 'booked' },
  { time: '05:00 PM', status: 'available' },
  { time: '06:00 PM', status: 'available' },
  { time: '07:00 PM', status: 'available' },
  { time: '08:00 PM', status: 'available' },
  { time: '09:00 PM', status: 'available' },
];

const DATES = [
  { id: '2026-11-12', label: 'Today', sub: 'Thu, Nov 12' },
  { id: '2026-11-13', label: 'Tomorrow', sub: 'Fri, Nov 13' },
  { id: '2026-11-14', label: 'Saturday', sub: 'Sat, Nov 14' },
  { id: '2026-11-15', label: 'Sunday', sub: 'Sun, Nov 15' },
  { id: '2026-11-16', label: 'Monday', sub: 'Mon, Nov 16' },
];

function normalizeModeParam(rawMode) {
  if (!rawMode) return 'Single';
  if (rawMode === 'GTA6' || rawMode === 'GTA6_Launch') return 'GTA6_Launch';
  if (pricingMatrix[rawMode]) return rawMode;
  return 'Single';
}

function normalizeScreenParam(rawScreen, modeKey) {
  if (modeKey === 'SimDrive') return 'Screen3';
  if (rawScreen && screens.some((s) => s.code === rawScreen)) {
    return rawScreen;
  }
  return 'Screen1';
}

export default function BookingPage({ user, onRequireLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMode = normalizeModeParam(searchParams.get('mode'));
  const initialScreen = normalizeScreenParam(
    searchParams.get('screen'),
    initialMode
  );
  const queryDuration = String(searchParams.get('duration') || '60');
  const queryGame = searchParams.get('game') || '';

  const [selectedScreenCode, setSelectedScreenCode] = useState(initialScreen);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [duration, setDuration] = useState(
    ['15', '30', '60'].includes(queryDuration) ? queryDuration : '60'
  );
  const [selectedDate, setSelectedDate] = useState(DATES[0].id);
  const [selectedSlot, setSelectedSlot] = useState('07:00 PM');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);

  // Rule: If GTA 6 Launch Special is selected, 15 minutes is NOT offered
  useEffect(() => {
    if (selectedMode === 'GTA6_Launch' && duration === '15') {
      setDuration('60');
    }
  }, [selectedMode, duration]);

  // Rule: SimDrive requires Screen 3; if user picks Screen 1 or 2 while SimDrive is active, switch mode to Single
  const handleSelectScreen = (screenCode) => {
    setSelectedScreenCode(screenCode);
    if (screenCode !== 'Screen3' && selectedMode === 'SimDrive') {
      setSelectedMode('Single');
    }
  };

  // Rule: Clicking SimDrive auto-selects Screen 3
  const handleSelectMode = (modeKey) => {
    setSelectedMode(modeKey);
    if (modeKey === 'SimDrive') {
      setSelectedScreenCode('Screen3');
    }
    if (modeKey === 'GTA6_Launch' && duration === '15') {
      setDuration('60');
    }
  };

  const currentScreen =
    screens.find((s) => s.code === selectedScreenCode) || screens[0];
  const currentModeConfig =
    pricingMatrix[selectedMode] || pricingMatrix.Single;

  const availableDurations =
    selectedMode === 'GTA6_Launch'
      ? [
          { mins: '30', label: '30 Mins' },
          { mins: '60', label: '1 Hour (60 Mins)' },
        ]
      : [
          { mins: '15', label: '15 Mins' },
          { mins: '30', label: '30 Mins' },
          { mins: '60', label: '1 Hour (60 Mins)' },
        ];

  const effectiveDuration =
    selectedMode === 'GTA6_Launch' && duration === '15' ? '60' : duration;
  const price =
    currentModeConfig.sessions[effectiveDuration] ||
    currentModeConfig.sessions['60'];
  const extensionPrice =
    currentModeConfig.extensions[effectiveDuration] ||
    currentModeConfig.extensions['60'];

  const handleConfirmBooking = () => {
    if (!user) {
      onRequireLogin?.();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newPass = {
        bookingId: `GRID-${Math.floor(100000 + Math.random() * 900000)}`,
        screenCode: currentScreen.code,
        screenName: `${currentScreen.name} (${currentScreen.tv})`,
        modeKey: selectedMode,
        modeLabel:
          selectedMode === 'Triple'
            ? 'Triple (3 Players)'
            : `${currentModeConfig.label} (${currentModeConfig.players} ${
                currentModeConfig.players === 1 ? 'Player' : 'Players'
              })`,
        date: DATES.find((d) => d.id === selectedDate)?.sub || 'Today',
        duration: Number(effectiveDuration),
        slot: selectedSlot,
        price,
        phone: user.phone,
        games: currentScreen.games,
      };
      localStorage.setItem('grid_last_pass', JSON.stringify(newPass));
      setConfirmedPass(newPass);
    }, 500);
  };

  return (
    <section className="min-h-screen bg-obsidian pt-28 sm:pt-32 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mb-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Book Your Screen
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {loungeInfo.address.fullAddress} · Open {loungeInfo.timings.open} to{' '}
              {loungeInfo.timings.close}
            </p>
            {queryGame && (
              <p className="mt-1.5 text-xs text-neon">
                Selected Game: <strong>{queryGame}</strong>
              </p>
            )}
          </div>
        </div>

        {/* CONFIRMED BOOKING VIEW */}
        {confirmedPass ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-neon/40 bg-[#0d1017] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon/15 text-neon">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold text-neon">
                  Booking Confirmed · {confirmedPass.bookingId}
                </span>
                <h2 className="font-display text-2xl font-semibold text-white">
                  You&apos;re All Set!
                </h2>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-white/65 sm:text-sm">
              Your booking pass has been sent to{' '}
              <strong className="text-white">{confirmedPass.phone}</strong>. Show this pass at The Grid counter when you arrive.
            </p>

            <div className="my-6 flex flex-col items-center justify-between gap-5 rounded-xl border border-white/10 bg-obsidian p-5 sm:flex-row">
              <div className="w-full space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Screen:</span>
                  <span className="font-semibold text-white">
                    {confirmedPass.screenName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Mode:</span>
                  <span className="font-semibold text-white">
                    {confirmedPass.modeLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Date &amp; Time:</span>
                  <span className="font-semibold text-neon">
                    {confirmedPass.date} · {confirmedPass.slot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Duration:</span>
                  <span className="font-semibold text-white">
                    {confirmedPass.duration} Mins
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2.5">
                  <span className="text-white/50">Total Paid:</span>
                  <span className="text-base font-bold text-neon">
                    ₹{confirmedPass.price}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] p-4 text-neon">
                <QrCode size={68} />
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Show at Counter
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/ticket/${confirmedPass.bookingId}`)}
                className="h-11 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs font-semibold text-white hover:bg-white/[0.06]"
              >
                View &amp; Share Pass
              </Button>
              <Button
                onClick={() => setConfirmedPass(null)}
                className="h-11 cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                Book Another Slot
              </Button>
            </div>
          </div>
        ) : (
          /* CLEAN 4-STEP BOOKING BUILDER + SIMPLE CHECKOUT SUMMARY */
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* LEFT 8 COLUMNS: STEPS 1 TO 4 */}
            <div className="space-y-6 lg:col-span-8">
              {/* STEP 1: Pick Your Screen */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                      1. Pick Your Screen
                    </h2>
                    <p className="text-xs text-white/55">
                      Check the installed games on each screen below — screens cannot be switched after booking.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {screens.map((scr) => {
                    const active = selectedScreenCode === scr.code;
                    const hasSim = Boolean(scr.simRig?.available);

                    return (
                      <button
                        key={scr.code}
                        type="button"
                        onClick={() => handleSelectScreen(scr.code)}
                        className={`flex h-full cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] shadow-[0_0_20px_-6px_rgba(0,255,102,0.35)]'
                            : 'border-white/10 bg-obsidian hover:border-white/25'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span
                                className={`text-xs font-semibold ${
                                  active ? 'text-neon' : 'text-white/55'
                                }`}
                              >
                                {scr.tv}
                              </span>
                              <h3 className="font-display text-lg font-semibold text-white">
                                {scr.name}
                              </h3>
                            </div>
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                active
                                  ? 'border-neon/40 bg-neon/15 text-neon'
                                  : 'border-white/10 bg-white/[0.03] text-white/60'
                              }`}
                            >
                              {hasSim ? <Gauge size={16} /> : <Tv size={16} />}
                            </div>
                          </div>

                          <p className="mt-1 text-xs font-medium text-white/70">
                            {scr.console}
                            {hasSim ? ' + SimDrive Cockpit' : ''}
                          </p>

                          {hasSim && (
                            <p className="mt-1.5 rounded-lg border border-cyber/25 bg-cyber/10 px-2.5 py-1 text-[11px] text-cyber">
                              Logitech G923 Wheel + TRONE RS1 Chair (or play with controllers)
                            </p>
                          )}

                          {/* Exact list of games installed on this screen */}
                          <div className="mt-3.5 border-t border-white/10 pt-3">
                            <p className="mb-1.5 text-[11px] font-medium text-white/50">
                              Installed Games ({scr.games.length}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {scr.games.map((g) => (
                                <span
                                  key={g}
                                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/85"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                          <span
                            className={`font-semibold ${
                              active ? 'text-neon' : 'text-white/45'
                            }`}
                          >
                            {active ? '✓ Selected Screen' : 'Select Screen'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Pick Your Mode & Player Count */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 sm:p-6">
                <div className="mb-4">
                  <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                    2. Pick Your Mode &amp; Player Count
                  </h2>
                  <p className="text-xs text-white/55">
                    Single, Dual, Triple, and Big indicate how many players are playing together.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {MODE_OPTIONS.map((m) => {
                    const Icon = m.icon;
                    const active = selectedMode === m.key;
                    const mConfig = pricingMatrix[m.key];
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
                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] text-white shadow-[0_0_20px_-6px_rgba(0,255,102,0.35)]'
                            : 'border-white/10 bg-obsidian text-white/80 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon
                            size={17}
                            className={active ? 'text-neon' : 'text-white/55'}
                          />
                          <span className="text-xs font-semibold text-neon">
                            ₹{modePrice}
                          </span>
                        </div>
                        <div className="mt-3">
                          <p className="font-display text-sm font-semibold text-white sm:text-base">
                            {m.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/50">
                            {m.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Pick Duration */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                      3. Pick Session Duration
                    </h2>
                    <p className="text-xs text-white/55">
                      {selectedMode === 'GTA6_Launch'
                        ? 'GTA 6 Launch Special is available in 30-minute and 1-hour sessions.'
                        : 'Choose 15 minutes, 30 minutes, or 1 hour.'}
                    </p>
                  </div>
                </div>

                <div
                  className={`grid gap-3 ${
                    availableDurations.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  }`}
                >
                  {availableDurations.map((d) => {
                    const active = effectiveDuration === d.mins;
                    const dPrice = currentModeConfig.sessions[d.mins];
                    const extPrice = currentModeConfig.extensions[d.mins];

                    return (
                      <button
                        key={d.mins}
                        type="button"
                        onClick={() => setDuration(d.mins)}
                        className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] text-white shadow-[0_0_20px_-6px_rgba(0,255,102,0.35)]'
                            : 'border-white/10 bg-obsidian text-white/75 hover:border-white/25'
                        }`}
                      >
                        <p className="font-display text-base font-semibold text-white sm:text-lg">
                          {d.label}
                        </p>
                        <p className="mt-1 text-lg font-bold text-neon">
                          ₹{dPrice}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/45">
                          Extension: ₹{extPrice}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: Pick Date & Time Slot (10:00 AM – 10:00 PM) */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 sm:p-6">
                <div className="mb-4">
                  <h2 className="font-display text-lg font-semibold text-white sm:text-xl">
                    4. Pick Date &amp; Time Slot (10:00 AM – 10:00 PM)
                  </h2>
                  <p className="text-xs text-white/55">
                    Open every day from 10:00 AM to 10:00 PM.
                  </p>
                </div>

                {/* Date Pills */}
                <div className="mb-5 flex items-center gap-2.5 overflow-x-auto pb-1">
                  {DATES.map((d) => {
                    const active = selectedDate === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDate(d.id)}
                        className={`shrink-0 cursor-pointer rounded-xl border px-4 py-2.5 text-left transition-all ${
                          active
                            ? 'border-neon bg-neon/[0.08] text-white'
                            : 'border-white/10 bg-obsidian text-white/70 hover:border-white/25'
                        }`}
                      >
                        <p className="text-[11px] font-medium text-white/50">
                          {d.label}
                        </p>
                        <p className="text-xs font-semibold text-white">
                          {d.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slot Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                  {TIME_SLOTS.map((item) => {
                    const isBooked = item.status === 'booked';
                    const isSelected = selectedSlot === item.time;
                    return (
                      <button
                        key={item.time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(item.time)}
                        className={`rounded-xl border py-3 px-2.5 text-center text-xs font-semibold transition-all ${
                          isBooked
                            ? 'cursor-not-allowed border-white/5 bg-white/[0.01] text-white/25 line-through'
                            : isSelected
                            ? 'cursor-pointer border-neon bg-neon text-obsidian'
                            : 'cursor-pointer border-white/10 bg-obsidian text-white/85 hover:border-white/25'
                        }`}
                      >
                        {item.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT 4 COLUMNS: SIMPLE CHECKOUT SUMMARY */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/15 bg-[#0d1017] p-6 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-display text-xl font-semibold text-white">
                    Booking Summary
                  </h2>
                  <p className="mt-1 text-xs text-white/55">
                    {currentScreen.name} · {currentScreen.tv}
                  </p>
                </div>

                <div className="mt-5 space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/55">Selected Screen</span>
                    <span className="font-semibold text-white">
                      {currentScreen.name} ({currentScreen.tv})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/55">Mode &amp; Players</span>
                    <span className="font-semibold text-white">
                      {selectedMode === 'Triple'
                        ? 'Triple (3 Players)'
                        : `${currentModeConfig.label} (${currentModeConfig.players}P)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/55">Session Duration</span>
                    <span className="font-semibold text-white">
                      {effectiveDuration === '60'
                        ? '1 Hour (60 Mins)'
                        : `${effectiveDuration} Mins`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/55">Date &amp; Time Slot</span>
                    <span className="font-semibold text-neon">
                      {DATES.find((d) => d.id === selectedDate)?.sub} ·{' '}
                      {selectedSlot}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">
                      Extension Rate ({effectiveDuration}m)
                    </span>
                    <span className="text-white/75">₹{extensionPrice}</span>
                  </div>

                  {/* Installed Games Reminder */}
                  <div className="rounded-xl border border-white/10 bg-obsidian p-3 text-xs">
                    <p className="font-medium text-white/70">
                      Games on {currentScreen.name}:
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                      {currentScreen.games.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                    <span className="font-semibold text-white">Total Price</span>
                    <span className="font-display text-3xl font-bold text-neon">
                      ₹{price}
                    </span>
                  </div>

                  <Button
                    onClick={handleConfirmBooking}
                    disabled={isProcessing}
                    className="mt-2 h-12 w-full cursor-pointer rounded-xl bg-white text-sm font-semibold text-obsidian transition-colors hover:bg-white/90"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <Ticket size={17} className="mr-2" />
                        Pay &amp; Confirm Booking
                      </>
                    )}
                  </Button>

                  <p className="flex items-start gap-1.5 pt-1 text-[11px] text-white/50">
                    <AlertCircle size={13} className="mt-0.5 shrink-0 text-white/40" />
                    <span>
                      Please verify your selected screen above, as screens cannot be changed after booking.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
