import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Ticket,
  QrCode,
  Share2,
  Copy,
  Check,
  Clock,
  Gamepad2,
  LogOut,
  Edit3,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeToast } from '@/components/SwipeToast';
import gridData from '@/data/gridData.json';
import { authService } from '@/services/authService';

function formatModeLabel(modeKey) {
  const modeConfig =
    gridData.pricingMatrix[modeKey] || gridData.pricingMatrix.Single;
  if (modeKey === 'Triple') return '3 Players (Triple)';
  if (modeKey === 'SimDrive') return 'SimDrive (Cockpit)';
  if (modeKey === 'GTA6_Launch') return 'GTA 6 Launch Special';
  return `${modeConfig.label} (${modeConfig.players}P)`;
}

export default function ProfilePage({
  user,
  onUserUpdate,
  onRequireLogin,
  onLogout,
}) {
  const navigate = useNavigate();
  const toast = useSwipeToast();

  const [profile, setProfile] = useState(user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [copiedToken, setCopiedToken] = useState('');

  const userPhone = user?.phone || '';

  const loadProfileData = useCallback(async () => {
    if (!userPhone && !localStorage.getItem('grid_token')) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.getProfile(userPhone);
      if (data?.user) {
        setProfile(data.user);
        setNameInput(data.user.name || '');
      }
      if (Array.isArray(data?.bookings)) {
        setBookings(data.bookings);
      }
    } catch {
      // Fallback to localStorage pass only if backend is unreachable
      try {
        const raw = localStorage.getItem('grid_last_pass');
        const cached = raw ? JSON.parse(raw) : null;
        if (cached) {
          setBookings([
            {
              ticketToken: cached.ticketToken || cached.bookingId,
              bookingCode: cached.bookingId,
              customerName: user?.name || 'Grid Player',
              screen: cached.screenName || 'Screen 1',
              screenCode: cached.screenCode || 'Screen1',
              mode: cached.modeKey || 'Single',
              duration: cached.duration || 60,
              date: cached.rawDate || cached.date || 'Today',
              startTime: cached.slot || '07:00 PM',
              endTime: cached.endTime || '',
              totalAmount: cached.price || 160,
              paymentStatus: 'paid',
              status: 'confirmed',
              selectedGames: cached.games || [],
            },
          ]);
        }
      } catch {
        // Ignore
      }
    } finally {
      setLoading(false);
    }
  }, [userPhone, user?.name]);

  // Fetch once on mount or when logged-in phone number changes (no infinite loop)
  useEffect(() => {
    if (userPhone) {
      setProfile((prev) => prev || user);
      setNameInput((prev) => prev || user?.name || '');
      loadProfileData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPhone]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) return;

    setSavingName(true);
    setProfileMsg('');
    try {
      const data = await authService.updateProfile({
        name: trimmed,
        phone: userPhone,
      });
      const updatedUser = data?.user || {
        ...(profile || user),
        name: trimmed,
      };
      setProfile(updatedUser);
      onUserUpdate?.(updatedUser);
      setEditingName(false);
      setProfileMsg('Profile updated');
      toast.success('Profile Updated', `Display name saved as ${trimmed}.`);
      setTimeout(() => setProfileMsg(''), 2500);
    } catch {
      const updated = { ...(profile || user), name: trimmed };
      setProfile(updated);
      onUserUpdate?.(updated);
      setEditingName(false);
      toast.success('Profile Updated', `Display name saved as ${trimmed}.`);
    } finally {
      setSavingName(false);
    }
  };

  const handleCopyPassLink = async (ticketToken) => {
    const url = `${window.location.origin}/ticket/${ticketToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(ticketToken);
      toast.success('Pass Link Copied!', 'Ready to paste and share.');
      setTimeout(() => setCopiedToken(''), 2500);
    } catch {
      // Ignore
    }
  };

  const handleSharePassWhatsApp = (b) => {
    const passUrl = `${window.location.origin}/ticket/${b.ticketToken || b.bookingCode}`;
    const timeRange = b.endTime ? `${b.startTime} – ${b.endTime}` : b.startTime;
    const text = [
      `🎮 *The Grid Gaming Lounge — Entry Pass*`,
      `Booking ID: *${b.bookingCode}*`,
      `Screen: ${b.screen}`,
      `Mode: ${formatModeLabel(b.mode)} · ${b.duration} Mins`,
      `Date & Time: ${b.date} · ${timeRange}`,
      `Pass Link: ${passUrl}`,
    ].join('\n');

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!user) {
    return (
      <section className="min-h-screen bg-obsidian pt-32 pb-24 text-white">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-7 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neon/30 bg-neon/10 text-neon">
              <User size={22} />
            </div>
            <h1 className="font-display mt-4 text-2xl font-semibold text-white">
              Player Profile &amp; Passes
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
              Sign in with your WhatsApp number to view your active booking passes, session history, and player profile.
            </p>
            <Button
              onClick={onRequireLogin}
              className="mt-6 h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
            >
              <LogIn size={15} className="mr-1.5" />
              Sign In with WhatsApp OTP
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-obsidian pt-28 sm:pt-32 pb-24 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Top Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neon/40 bg-neon/15 font-display text-xl font-bold text-neon">
                {(profile?.name || user?.name || 'GP').slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-neon/30 bg-neon/10 px-2.5 py-0.5 text-[10px] font-semibold text-neon">
                    Verified Player
                  </span>
                  {profileMsg && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-neon">
                      <CheckCircle2 size={12} /> {profileMsg}
                    </span>
                  )}
                </div>

                {editingName ? (
                  <form
                    onSubmit={handleSaveName}
                    className="mt-2 flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="rounded-xl border border-white/20 bg-obsidian px-3 py-1.5 text-sm font-semibold text-white outline-none focus:border-neon"
                      placeholder="Your Name"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={savingName}
                      className="h-8 rounded-lg bg-neon px-3 text-xs font-semibold text-obsidian hover:bg-neon/90 cursor-pointer"
                    >
                      {savingName ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingName(false);
                        setNameInput(profile?.name || user?.name || '');
                      }}
                      className="h-8 text-xs text-white/60 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <div className="mt-1.5 flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {profile?.name || user?.name || 'Grid Player'}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setEditingName(true)}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-white/60 hover:text-white cursor-pointer"
                      title="Edit Name"
                    >
                      <Edit3 size={13} />
                    </button>
                  </div>
                )}

                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                  <Phone size={12} className="text-neon" />
                  <span>{profile?.phone || user.phone}</span>
                  <span className="text-white/30">·</span>
                  <span>
                    {bookings.length}{' '}
                    {bookings.length === 1 ? 'Booking' : 'Bookings'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={() => navigate('/book')}
                className="h-10 cursor-pointer rounded-xl bg-white px-4 text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                <Ticket size={14} className="mr-1.5" />
                Book New Slot
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onLogout?.();
                  navigate('/');
                }}
                className="h-10 cursor-pointer rounded-xl border-white/15 bg-transparent px-4 text-xs font-semibold text-vice hover:bg-vice/10"
              >
                <LogOut size={14} className="mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                My Digital Passes
              </h2>
              <p className="text-xs text-white/55">
                Open any pass to show the QR code at The Grid counter or share with friends.
              </p>
            </div>

            <button
              type="button"
              onClick={loadProfileData}
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#0d1017] py-16">
              <RefreshCw size={22} className="animate-spin text-neon mr-2.5" />
              <span className="text-xs text-white/70">
                Loading your passes...
              </span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-neon">
                <Ticket size={22} />
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold text-white">
                No Passes Yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-white/55">
                Book Screen 1, Screen 2, or the SimDrive Racing Cockpit online to get your instant digital entry pass.
              </p>
              <Button
                onClick={() => navigate('/book')}
                className="mt-5 h-10 cursor-pointer rounded-xl bg-white px-5 text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                Book Your First Session <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {bookings.map((b, idx) => {
                const matchedScreen =
                  gridData.screens.find((s) => s.code === b.screenCode) ||
                  gridData.screens[0];
                const passToken = b.ticketToken || b.bookingCode;
                const timeRange = b.endTime
                  ? `${b.startTime} – ${b.endTime}`
                  : b.startTime;

                return (
                  <div
                    key={passToken || idx}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1017] p-5 transition-colors hover:border-neon/40"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="font-mono text-xs font-bold text-neon">
                          {b.bookingCode}
                        </span>
                        <span className="rounded-full border border-neon/30 bg-neon/10 px-2.5 py-0.5 text-[10px] font-semibold text-neon capitalize">
                          {b.status === 'checked_in'
                            ? 'Checked In'
                            : b.status || 'Confirmed'}
                        </span>
                      </div>

                      <div className="mt-3.5">
                        <h3 className="font-display text-lg font-bold text-white">
                          {matchedScreen.name} ({matchedScreen.tv})
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-white/70">
                          {formatModeLabel(b.mode)} · {b.duration} Mins
                        </p>
                      </div>

                      <div className="mt-3 space-y-1.5 rounded-xl border border-white/10 bg-obsidian p-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-white/50">
                            <Clock size={12} className="text-neon" /> Date &amp; Time
                          </span>
                          <span className="font-semibold text-neon">
                            {b.date} · {timeRange}
                          </span>
                        </div>

                        {b.selectedGames?.length > 0 && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex shrink-0 items-center gap-1.5 text-white/50">
                              <Gamepad2 size={12} className="text-cyber" /> Games
                            </span>
                            <span className="truncate font-medium text-white/85">
                              {b.selectedGames.join(', ')}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-white/10 pt-2">
                          <span className="text-white/50">Total Paid</span>
                          <span className="font-bold text-white">
                            ₹{b.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        onClick={() => navigate(`/ticket/${passToken}`)}
                        className="h-9 flex-1 cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
                      >
                        <QrCode size={14} className="mr-1.5" />
                        Open Pass
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyPassLink(passToken)}
                        title="Copy Shareable Pass Link"
                        className="h-9 w-9 cursor-pointer rounded-xl border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                      >
                        {copiedToken === passToken ? (
                          <Check size={14} className="text-neon" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSharePassWhatsApp(b)}
                        title="Share Pass on WhatsApp"
                        className="h-9 w-9 cursor-pointer rounded-xl border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                      >
                        <Share2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
