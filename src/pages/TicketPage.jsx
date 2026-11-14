import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  QrCode,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  MapPin,
  Navigation,
  Ticket,
  Gamepad2,
  User,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeToast } from '@/components/SwipeToast';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';

const MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=Town+Square+Shopping+Centre+Thondiyil+Peravoor+Kannur+Kerala';

function formatModeLabel(modeKey) {
  const modeConfig =
    gridData.pricingMatrix[modeKey] || gridData.pricingMatrix.Single;
  if (modeKey === 'Triple') return '3 Players (Triple)';
  if (modeKey === 'SimDrive') return 'SimDrive Racing Rig';
  if (modeKey === 'GTA6_Launch') return 'GTA 6 Launch Pass';
  return `${modeConfig.players} ${
    modeConfig.players === 1 ? 'Player' : 'Players'
  } (${modeConfig.label})`;
}

function getStatusBadge(status, paymentStatus) {
  if (status === 'cancelled') {
    return {
      label: 'Cancelled',
      className: 'border-vice/40 bg-vice/15 text-vice',
    };
  }
  if (status === 'checked_in') {
    return {
      label: 'Checked In · Active',
      className: 'border-cyber/40 bg-cyber/15 text-cyber',
    };
  }
  if (status === 'completed') {
    return {
      label: 'Completed',
      className: 'border-white/20 bg-white/10 text-white/80',
    };
  }
  return {
    label: paymentStatus === 'paid' ? 'Paid · Confirmed' : 'Confirmed',
    className: 'border-neon/40 bg-neon/15 text-neon',
  };
}

export default function TicketPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useSwipeToast();

  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrImgFailed, setQrImgFailed] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setInvalidToken(false);

    bookingService
      .getPublicTicket(token)
      .then((ticket) => {
        if (!active || !ticket) return;

        const matchedScreen =
          gridData.screens.find(
            (s) =>
              s.code === ticket.screenCode ||
              s.name.toLowerCase() === String(ticket.screen || '').toLowerCase()
          ) || gridData.screens[0];

        setPass({
          ticketToken: ticket.ticketToken || token,
          bookingCode: ticket.bookingCode || ticket.bookingId || 'GRID-PASS',
          customerName: ticket.customerName || 'Grid Player',
          screenCode: matchedScreen.code,
          screenName: matchedScreen.name,
          screenTv: matchedScreen.tv,
          modeKey: ticket.mode || 'Single',
          modeLabel: formatModeLabel(ticket.mode || 'Single'),
          duration: Number(ticket.duration || 60),
          date: ticket.date || 'Today',
          startTime: ticket.startTime || ticket.slot || '07:00 PM',
          endTime: ticket.endTime || '',
          baseAmount: Number(ticket.baseAmount || 0),
          taxAmount: Number(ticket.taxAmount || 0),
          convenienceFee: Number(ticket.convenienceFee || 0),
          totalAmount:
            ticket.totalAmount !== undefined ? ticket.totalAmount : ticket.price || 0,
          paymentStatus: ticket.paymentStatus || 'paid',
          status: ticket.status || 'confirmed',
          games: ticket.selectedGames || [],
        });
      })
      .catch(() => {
        if (!active) return;
        try {
          const raw = localStorage.getItem('grid_last_pass');
          const cached = raw ? JSON.parse(raw) : null;
          if (
            cached &&
            (cached.ticketToken === token || cached.bookingId === token)
          ) {
            const matchedScreen =
              gridData.screens.find((s) => s.code === cached.screenCode) ||
              gridData.screens[0];
            setPass({
              ticketToken: cached.ticketToken || token,
              bookingCode: cached.bookingId,
              customerName: cached.customerName || 'Grid Player',
              screenCode: matchedScreen.code,
              screenName: matchedScreen.name,
              screenTv: matchedScreen.tv,
              modeKey: cached.modeKey || 'Single',
              modeLabel: cached.modeLabel || '1 Player (Single)',
              duration: Number(cached.duration || 60),
              date: cached.date || 'Today',
              startTime: cached.slot || '07:00 PM',
              endTime: cached.endTime || '',
              totalAmount: cached.price || 160,
              paymentStatus: 'paid',
              status: 'confirmed',
              games: cached.games || [],
            });
            return;
          }
        } catch {
          // Ignore storage error
        }
        setInvalidToken(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const shareUrl = pass?.ticketToken
    ? `${window.location.origin}/ticket/${pass.ticketToken}`
    : window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(
        'Pass Link Copied!',
        'Share this link with your squad or open it at the counter.'
      );
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  const handleShareWhatsApp = () => {
    if (!pass) return;
    const timeRange = pass.endTime
      ? `${pass.startTime} – ${pass.endTime}`
      : pass.startTime;
    const text = [
      `🎮 *The Grid Gaming Lounge — Entry Pass*`,
      `Booking ID: *${pass.bookingCode}*`,
      `Player: ${pass.customerName}`,
      `Screen: ${pass.screenName} (${pass.screenTv})`,
      `Mode: ${pass.modeLabel} · ${pass.duration} Mins`,
      `Date & Time: ${pass.date} · ${timeRange}`,
      `Location: Town Square, Thondiyil, Peravoor`,
      `Pass Link: ${shareUrl}`,
    ].join('\n');

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-obsidian pt-32 pb-24 text-white flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <RefreshCw size={24} className="animate-spin text-neon" />
          <p className="text-sm font-medium text-white/70">
            Loading your pass...
          </p>
        </div>
      </section>
    );
  }

  if (invalidToken || !pass) {
    return (
      <section className="min-h-screen bg-obsidian pt-32 pb-24 text-white">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-7 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-vice/30 bg-vice/10 text-vice">
              <AlertTriangle size={24} />
            </div>
            <h1 className="font-display mt-4 text-2xl font-bold text-white">
              Pass Not Found
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
              This pass link is invalid or has expired. Check the link sent to your WhatsApp or book a new session below.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button
                onClick={() => navigate('/book')}
                className="h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                <Ticket size={15} className="mr-1.5" />
                Book a Screen
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="h-11 w-full cursor-pointer rounded-xl border-white/15 bg-transparent text-xs font-semibold text-white hover:bg-white/[0.06]"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const badge = getStatusBadge(pass.status, pass.paymentStatus);
  const timeSlotDisplay = pass.endTime
    ? `${pass.startTime} – ${pass.endTime}`
    : pass.startTime;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(
    pass.bookingCode
  )}`;

  return (
    <section className="min-h-screen bg-obsidian pt-28 sm:pt-32 pb-24 text-white">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        {/* Top Back Link */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/book')}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Book Another Slot
          </button>
          <span className="text-[11px] font-medium text-white/45">
            The Grid Entry Pass
          </span>
        </div>

        {/* SLEEK BOARDING-PASS TICKET CARD */}
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0d1017] shadow-2xl">
          {/* 1. Top Header Banner */}
          <div className="bg-gradient-to-r from-neon/15 via-neon/5 to-transparent px-6 py-5 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-neon">
                {gridData.loungeInfo.name} {gridData.loungeInfo.subtitle}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
              >
                <CheckCircle2 size={12} />
                {badge.label}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {pass.screenName}
                </h1>
                <p className="text-xs text-white/55">{pass.screenTv}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/45">
                  Amount Paid
                </p>
                <p className="font-display text-2xl font-extrabold text-neon">
                  ₹{pass.totalAmount}
                </p>
                {pass.taxAmount > 0 && (
                  <p className="text-[10px] text-white/45">
                    Incl. GST & Fees
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Key Session Info (Simple 2x2 Grid) */}
          <div className="px-6 pt-5 pb-4">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-obsidian p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                  Date
                </p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {pass.date}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                  Time Slot
                </p>
                <p className="mt-0.5 text-sm font-bold text-neon">
                  {timeSlotDisplay}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                  Players / Mode
                </p>
                <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                  {pass.modeLabel}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                  Duration
                </p>
                <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                  {pass.duration === 60 ? '1 Hour (60m)' : `${pass.duration} Mins`}
                </p>
              </div>
            </div>

            {/* Player & Games Row */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <User size={13} className="text-neon" />
                Player: <strong className="text-white">{pass.customerName}</strong>
              </span>

              {pass.games?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-white/60 truncate max-w-[200px]">
                  <Gamepad2 size={13} className="text-cyber shrink-0" />
                  <span className="truncate">{pass.games.join(', ')}</span>
                </span>
              )}
            </div>
          </div>

          {/* Perforated Ticket Divider */}
          <div className="relative flex items-center justify-between py-2">
            <div className="-ml-3 h-6 w-6 rounded-full border border-white/15 bg-obsidian" />
            <div className="flex-1 border-t-2 border-dashed border-white/15 mx-2" />
            <div className="-mr-3 h-6 w-6 rounded-full border border-white/15 bg-obsidian" />
          </div>

          {/* 3. Counter Check-In QR & Booking Code */}
          <div className="px-6 pt-3 pb-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
              Scan QR or Show Booking ID at Counter
            </p>

            <div className="mx-auto mt-3 flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-2.5 shadow-md">
              {!qrImgFailed ? (
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${pass.bookingCode}`}
                  className="h-full w-full object-contain"
                  onError={() => setQrImgFailed(true)}
                />
              ) : (
                <QrCode size={88} className="text-obsidian" />
              )}
            </div>

            <div className="mt-3 inline-block rounded-xl border border-neon/30 bg-neon/10 px-4 py-1.5">
              <span className="font-mono text-lg font-extrabold tracking-widest text-neon">
                {pass.bookingCode}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Button
                onClick={handleShareWhatsApp}
                className="h-11 cursor-pointer rounded-xl bg-white text-xs font-bold text-obsidian hover:bg-white/90"
              >
                <Share2 size={14} className="mr-1.5" />
                Share Pass
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="h-11 cursor-pointer rounded-xl border-white/15 bg-white/[0.03] text-xs font-semibold text-white hover:bg-white/[0.08]"
              >
                {copied ? (
                  <>
                    <Check size={14} className="mr-1.5 text-neon" />
                    <span className="text-neon">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1.5 text-white/70" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            {/* Compact Directions Footer */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-obsidian px-3.5 py-2.5 text-left">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} className="shrink-0 text-neon" />
                <div className="truncate">
                  <p className="truncate text-xs font-semibold text-white">
                    Town Square, Peravoor
                  </p>
                  <p className="truncate text-[10px] text-white/50">
                    Ground Floor, Thondiyil, Kannur
                  </p>
                </div>
              </div>

              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-lg bg-neon/15 border border-neon/30 px-2.5 py-1.5 text-[11px] font-bold text-neon hover:bg-neon hover:text-obsidian transition-colors"
              >
                <Navigation size={11} />
                Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
