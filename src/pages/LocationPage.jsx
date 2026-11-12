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
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';

export default function LocationPage() {
  const navigate = useNavigate();
  const { loungeInfo, screens } = gridData;

  return (
    <section className="min-h-screen bg-obsidian pt-32 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neon">
              {loungeInfo.address.area}, {loungeInfo.address.district}
            </span>
            <h1 className="font-display mt-2 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Shop &amp; Location
            </h1>
          </div>

          <p className="max-w-md text-sm text-white/60">
            Visit The Grid Gaming Lounge at Town Square in Thondiyil, Peravoor. Fully air-conditioned comfort with PS5 4K TVs and our Logitech G923 SimDrive cockpit.
          </p>
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
                    Opening Hours
                  </span>
                  <Clock size={18} className="text-cyber" />
                </div>
                <h2 className="font-display mt-5 text-2xl font-semibold text-white">
                  Open All Days
                </h2>

                <div className="mt-5 divide-y divide-white/10 rounded-xl border border-white/10 bg-obsidian text-xs">
                  <div className="flex justify-between px-4 py-3.5">
                    <span className="text-white/60">{loungeInfo.timings.days}</span>
                    <span className="font-semibold text-neon">
                      {loungeInfo.timings.open} – {loungeInfo.timings.close}
                    </span>
                  </div>
                  <div className="flex justify-between px-4 py-3.5">
                    <span className="text-white/60">Session Durations</span>
                    <span className="font-medium text-white">
                      15 Mins · 30 Mins · 1 Hour
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/55">
                Walk in anytime or reserve your preferred time slot online in advance.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 3: Lounge Comfort & Gear */}
          <SpotlightCard
            spotlightColor="rgba(255, 46, 136, 0.1)"
            className="rounded-2xl border border-white/10 bg-[#0d1017] p-7 sm:p-8"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-white/60">
                    Lounge Comfort &amp; Gear
                  </span>
                  <Sofa size={18} className="text-vice" />
                </div>
                <h2 className="font-display mt-5 text-2xl font-semibold text-white">
                  What&apos;s Inside
                </h2>

                <ul className="mt-5 space-y-2.5 text-xs text-white/75">
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
                <span>Book Your Screen</span>
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
                Customers cannot switch screens after booking — check which games are on each screen below.
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
                  Book {scr.name}
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
