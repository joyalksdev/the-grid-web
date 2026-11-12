import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';

const STEPS = [
  {
    step: 'Step 1',
    title: 'Pick Your Screen & Check Games',
    desc: 'Choose Screen 1 (55" TV), Screen 2 (43" TV), or Screen 3 (43" TV + SimDrive Cockpit). Each screen displays its exact installed games list so you pick the right setup.',
    icon: Tv,
    spotlight: 'rgba(0, 240, 255, 0.12)',
  },
  {
    step: 'Step 2',
    title: 'Choose Players, Duration & Time',
    desc: 'Select how many players are joining (Single 1P up to Big 4P, SimDrive racing, or GTA 6 Launch Special), pick 15, 30, or 60 minutes, and select a slot between 10 AM and 10 PM.',
    icon: Users,
    spotlight: 'rgba(0, 255, 102, 0.12)',
  },
  {
    step: 'Step 3',
    title: 'Pay Online & Start Playing',
    desc: 'Confirm your booking online and get instant booking confirmation on WhatsApp. Show your booking pass at The Grid counter in Town Square, Peravoor when you arrive.',
    icon: CheckCircle2,
    spotlight: 'rgba(255, 46, 136, 0.12)',
  },
];

export default function BookingFlowSection() {
  const navigate = useNavigate();

  return (
    <section className="relative border-t border-white/10 bg-obsidian py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neon">
              Easy Online Booking
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              How Booking Works
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/book')}
            className="group inline-flex cursor-pointer items-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-obsidian transition-colors hover:bg-white/90 md:self-auto"
          >
            Book Your Screen
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <SpotlightCard
                key={item.step}
                spotlightColor={item.spotlight}
                className="p-7 sm:p-8"
              >
                <div className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-neon">
                        {item.step}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/80">
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="font-display mt-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-white/60 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
