import React, { useState } from 'react';
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
  ArrowUpRight,
  Navigation,
  Ticket,
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';
import { isBookingEnabled } from '@/utils/bookingConfig';

export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/abn9mNczw6RCNAcN7';

// Replace these dummy URLs with your actual shop photos (e.g. '/img/shop-1.jpg')
const SHOP_PHOTOS = [
  {
    id: 'shop-main',
    src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=85',
    title: 'Main Lounge & 55" 4K PS5 Setup',
    tag: 'Screen 1',
  },
  {
    id: 'shop-sim',
    src: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80',
    title: 'Logitech G923 + TRONE RS1 Cockpit',
    tag: 'Screen 3 · SimDrive',
  },
  {
    id: 'shop-screen2',
    src: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    title: '43" 4K UHD Couch Gaming Zone',
    tag: 'Screen 2',
  },
  {
    id: 'shop-lounge',
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    title: 'Town Square Shopping Centre, Thondiyil',
    tag: 'Lounge Interior',
  },
];

export default function LocationPage() {
  const navigate = useNavigate();
  const { loungeInfo, screens } = gridData;
  const bookingActive = isBookingEnabled();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const featuredPhoto = SHOP_PHOTOS[activePhotoIndex] || SHOP_PHOTOS[0];

  return (
    <section className="min-h-screen bg-obsidian pt-24 sm:pt-32 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====================================================================
            SHOP & LOCATION HERO
           ==================================================================== */}
        <div className="mb-14">
          {/* Top Header & Direct Map / Booking Actions */}
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                <span>
                  {loungeInfo.address.area}, {loungeInfo.address.district} · Open{' '}
                  {loungeInfo.timings.open} – {loungeInfo.timings.close}
                </span>
              </div>

              <h1 className="font-display mt-3.5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {loungeInfo.name} {loungeInfo.subtitle}
              </h1>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-white/60 sm:text-sm">
                <MapPin size={15} className="shrink-0 text-neon" />
                <span>{loungeInfo.address.fullAddress}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-obsidian transition-colors hover:bg-white/90"
              >
                <Navigation size={14} />
                <span>Open in Google Maps</span>
                <ArrowUpRight size={14} />
              </a>

              <button
                type="button"
                onClick={() => navigate('/book')}
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-xs font-semibold text-white transition-colors hover:bg-white/[0.09]"
              >
                <Ticket size={14} className="text-neon" />
                <span>Book a Slot</span>
              </button>

              <a
                href={`tel:${loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 text-xs font-medium text-white/75 transition-colors hover:border-white/25 hover:text-white"
              >
                <Phone size={14} className="text-cyber" />
                <span>{loungeInfo.contact.primaryPhone}</span>
              </a>
            </div>
          </div>

          {/* Bento Shop Photo Showcase + Location Card */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left 8 Cols: Main Featured Shop Photo */}
            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017] lg:col-span-8">
              <img
                src={featuredPhoto.src}
                alt={featuredPhoto.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

              {/* Bottom Caption Bar */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
                <div>
                  <span className="inline-block rounded-md border border-white/15 bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-neon backdrop-blur-md">
                    {featuredPhoto.tag}
                  </span>
                  <p className="font-display mt-1.5 text-base font-semibold text-white sm:text-xl">
                    {featuredPhoto.title}
                  </p>
                </div>

                <span className="font-mono text-xs text-white/60">
                  0{activePhotoIndex + 1} / 0{SHOP_PHOTOS.length}
                </span>
              </div>
            </div>

            {/* Right 4 Cols: Thumbnail Grid + Quick Directions Card */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-4">
              {/* 2x2 Thumbnail Switcher */}
              <div className="grid grid-cols-2 gap-3">
                {SHOP_PHOTOS.map((photo, idx) => {
                  const isSelected = idx === activePhotoIndex;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`group relative aspect-[16/11] cursor-pointer overflow-hidden rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-neon ring-1 ring-neon/50'
                          : 'border-white/10 opacity-70 hover:border-white/30 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2.5 right-2 truncate text-[10px] font-semibold text-white">
                        {photo.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Direct Location & Landmark Card */}
              <div className="flex flex-1 flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1017] p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neon">
                      Landmark &amp; Directions
                    </span>
                    <MapPin size={15} className="text-neon" />
                  </div>

                  <p className="font-display mt-2 text-base font-semibold text-white">
                    Town Square Shopping Centre
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    Ground Floor, Thondiyil, Peravoor, Kannur, Kerala. Easy parking available right in front of the complex.
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-white/55">
                    <span className="block font-semibold text-white">10:00 AM – 10:00 PM</span>
                    <span>Open Monday – Sunday</span>
                  </div>

                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neon/35 bg-neon/10 px-3 py-2 text-xs font-bold text-neon transition-colors hover:bg-neon hover:text-obsidian"
                  >
                    <Navigation size={12} />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
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

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs font-medium text-white/75 transition-colors hover:border-neon/40 hover:text-white"
              >
                <span>📍 Ground Floor, Town Square, Thondiyil</span>
                <ArrowUpRight size={14} className="shrink-0 text-neon" />
              </a>
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
