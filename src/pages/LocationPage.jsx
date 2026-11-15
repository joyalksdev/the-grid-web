import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Tv,
  Gauge,
  Sofa,
  Gamepad2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import CircularGallery from '@/components/CircularGallery';
import gridData from '@/data/gridData.json';
import { isBookingEnabled } from '@/utils/bookingConfig';

// High-resolution dummy & lounge images for a clean, immersive look
const SHOP_HERO_IMAGES = [
  '/img/shop-1.jpg',
  '/img/shop-2.jpg',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  '/img/shop-3.jpg',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  '/img/shop-4.jpg',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
];

export default function LocationPage() {
  const navigate = useNavigate();
  const { loungeInfo, screens } = gridData;
  const bookingActive = isBookingEnabled();

  return (
    <section className="min-h-screen bg-obsidian pt-28 sm:pt-32 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* CLEAN HERO HEADER */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
            <Sparkles size={13} /> {loungeInfo.address.area}, {loungeInfo.address.district}
          </span>
          <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Inside The Lounge
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base text-white/60">
            Take a 3D tour through our gaming stations, 4K setups, and cockpit racing rig.
          </p>
        </div>

        {/* 3D CIRCULAR GALLERY (CLEAN LOOK - NO TEXT OVERLAYS) */}
        <div className="mb-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b0e17] via-obsidian to-obsidian p-2 sm:p-6 shadow-2xl shadow-neon/5">
          <CircularGallery
            items={SHOP_HERO_IMAGES}
            radius={380}
            autoSpin={true}
            autoSpinSpeed={0.25}
          />
        </div>

        {/* 3-Column Info Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Address & Contact */}
          <SpotlightCard
            spotlightColor="rgba(0, 255, 102, 0.1)"
            className="rounded-2xl border border-white/10 bg-[#0d1017] p-7 sm:p-8"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-white/60">
                    Lounge Address
                  </span>
                  <MapPin size={18} className="text-neon" />
                </div>
                <h2 className="font-display mt-5 text-2xl font-semibold text-white">
                  {loungeInfo.name} {loungeInfo.subtitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {loungeInfo.address.fullAddress}
                </p>

                <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white/55">
                      <Phone size={14} className="text-cyber" /> Call
                    </span>
                    <a
                      href={`tel:${loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                      className="font-semibold text-white hover:text-neon"
                    >
                      {loungeInfo.contact.primaryPhone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white/55">
                      <MessageCircle size={14} className="text-neon" /> WhatsApp
                    </span>
                    <a
                      href={loungeInfo.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neon hover:underline"
                    >
                      {loungeInfo.contact.whatsappNumber}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] text-white/50">
                📍 Located at Ground Floor, Town Square Shopping Centre, Thondiyil, Peravoor.
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Opening Hours */}
          <SpotlightCard
            spotlightColor="rgba(0, 240, 255, 0.1)"
            className="rounded-2xl border border-white/10 bg-[#0d1017] p-7 sm:p-8"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-white/60">
                    Operating Hours
                  </span>
                  <Clock size={18} className="text-cyber" />
                </div>
                <h3 className="font-display mt-5 text-2xl font-semibold text-white">
                  Open All 7 Days
                </h3>
                <p className="mt-2 text-sm text-white/75">
                  {loungeInfo.timings.days}
                </p>
                <div className="mt-6 space-y-2 rounded-xl border border-white/10 bg-obsidian p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Doors Open:</span>
                    <span className="font-semibold text-neon">
                      {loungeInfo.timings.open}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Final Session:</span>
                    <span className="font-semibold text-cyber">
                      {loungeInfo.timings.close}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neon/20 bg-neon/[0.04] p-3.5 text-xs text-white/80">
                <span className="font-semibold text-neon">Walk-in Friendly:</span>{' '}
                Stop by anytime during operating hours or message us on WhatsApp for fast reservations.
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Lounge Amenities */}
          <SpotlightCard
            spotlightColor="rgba(255, 0, 102, 0.1)"
            className="rounded-2xl border border-white/10 bg-[#0d1017] p-7 sm:p-8"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-white/60">
                    Premium Amenities
                  </span>
                  <Sofa size={18} className="text-vice" />
                </div>
                <h3 className="font-display mt-5 text-2xl font-semibold text-white">
                  Pro Setup &amp; Comfort
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-white/70">
                  {loungeInfo.amenities.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigate('/book')}
                className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-semibold text-obsidian transition-colors hover:bg-white/90"
              >
                <span>{bookingActive ? 'Book Your Screen' : 'Calculate Session Rates'}</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </SpotlightCard>
        </div>

        {/* Our 3 Screens Breakdown */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#0d1017] p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                Our 3 Gaming Screens &amp; Installed Games
              </h3>
              <p className="mt-0.5 text-xs text-white/55">
                Check which games are on each screen before you visit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {screens.map((scr) => (
              <div
                key={scr.code}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-obsidian p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neon">
                      {scr.tv}
                    </span>
                    {scr.simRig?.available ? (
                      <Gauge size={16} className="text-cyber" />
                    ) : (
                      <Tv size={16} className="text-white/50" />
                    )}
                  </div>
                  <h4 className="font-display mt-1 text-lg font-semibold text-white">
                    {scr.name} · {scr.console}
                  </h4>
                  {scr.simRig?.available && (
                    <p className="mt-1.5 text-xs text-cyber">
                      + {scr.simRig.wheel} &amp; {scr.simRig.cockpit}
                    </p>
                  )}

                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-white/55">
                      <Gamepad2 size={13} className="text-neon" />
                      <span>Installed Games:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
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

                <button
                  type="button"
                  onClick={() => navigate(`/book?screen=${scr.code}`)}
                  className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-neon hover:text-white"
                >
                  {bookingActive ? `Book ${scr.name}` : `View ${scr.name} Rates`}
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
