import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  QrCode,
  Share2,
  ArrowLeft,
  MapPin,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import gridData from '@/data/gridData.json';

export default function TicketPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const savedPass = (() => {
    try {
      const raw = localStorage.getItem('grid_last_pass');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const pass =
    savedPass && savedPass.bookingId === bookingId
      ? savedPass
      : {
          bookingId: bookingId || 'GRID-849201',
          screenCode: 'Screen1',
          screenName: 'Screen 1 (55" TCL 4K HDR TV)',
          modeLabel: 'Single (1 Player)',
          date: 'Today',
          duration: 60,
          slot: '07:00 PM',
          price: 160,
          phone: '+91 98765 43210',
        };

  const handleShareWhatsApp = () => {
    const text = `The Grid Gaming Lounge Booking Pass\nBooking ID: ${pass.bookingId}\nScreen: ${pass.screenName}\nMode: ${pass.modeLabel}\nTime: ${pass.date} · ${pass.slot} (${pass.duration} mins)\nLocation: ${gridData.loungeInfo.address.fullAddress}\nPass Link: ${window.location.href}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="min-h-screen bg-obsidian pt-32 pb-24 text-white">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/book')}
          className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white"
        >
          <ArrowLeft size={14} /> Back to Booking Page
        </button>

        <div className="rounded-2xl border border-neon/40 bg-[#0d1017] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-neon" />
              <span className="text-xs font-semibold text-neon">
                Booking Confirmed · {pass.bookingId}
              </span>
            </div>
            <span className="rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/80">
              Paid Online
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs text-white/55">
              {gridData.loungeInfo.name} {gridData.loungeInfo.subtitle}
            </p>
            <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-white">
              {pass.screenName}
            </h1>
            <p className="mt-1 text-xs text-white/60">
              Booked for: <strong className="text-white">{pass.phone}</strong>
            </p>
          </div>

          <div className="my-6 flex flex-col items-center justify-between gap-5 rounded-xl border border-white/10 bg-obsidian p-5 sm:flex-row">
            <div className="w-full space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Booking ID:</span>
                <span className="font-semibold text-white">{pass.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Screen:</span>
                <span className="font-semibold text-white">
                  {pass.screenName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Mode:</span>
                <span className="font-semibold text-white">
                  {pass.modeLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Date &amp; Time:</span>
                <span className="font-semibold text-neon">
                  {pass.date} · {pass.slot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Duration:</span>
                <span className="font-semibold text-white">
                  {pass.duration} Mins
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2.5">
                <span className="text-white/50">Total Paid:</span>
                <span className="text-base font-bold text-neon">
                  ₹{pass.price}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] p-4 text-neon">
              <QrCode size={72} />
              <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Show at Counter
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              onClick={handleShareWhatsApp}
              className="h-11 cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
            >
              <Share2 size={15} className="mr-2" />
              Share on WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/book')}
              className="h-11 cursor-pointer rounded-xl border-white/15 bg-transparent text-xs font-semibold text-white hover:bg-white/[0.06]"
            >
              <Ticket size={15} className="mr-2" />
              Book Another Slot
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-white/10 pt-4 text-xs text-white/50">
            <MapPin size={13} className="text-neon" />
            <span>{gridData.loungeInfo.address.fullAddress}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
