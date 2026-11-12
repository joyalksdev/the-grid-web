import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Flame, Gauge, ArrowRight } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import CountUp from '@/components/CountUp';
import gridData from '@/data/gridData.json';

const matrix = gridData.pricingMatrix;

export const MODES_LIST = [
  {
    key: 'Single',
    title: 'Single',
    playersLabel: '1 Player',
    subtitle: matrix.Single.description,
    icon: Gamepad2,
    sessions: matrix.Single.sessions,
    extensions: matrix.Single.extensions,
    screensNote: 'Screen 1, Screen 2, or Screen 3',
    spotlight: 'rgba(0, 240, 255, 0.12)',
  },
  {
    key: 'Dual',
    title: 'Dual',
    playersLabel: '2 Players',
    subtitle: matrix.Dual.description,
    icon: Users,
    sessions: matrix.Dual.sessions,
    extensions: matrix.Dual.extensions,
    screensNote: 'Screen 1, Screen 2, or Screen 3',
    spotlight: 'rgba(0, 255, 102, 0.12)',
  },
  {
    key: 'Triple',
    title: 'Triple',
    playersLabel: '3 Players',
    subtitle: matrix.Triple.description,
    icon: Users,
    sessions: matrix.Triple.sessions,
    extensions: matrix.Triple.extensions,
    screensNote: 'Screen 1, Screen 2, or Screen 3',
    spotlight: 'rgba(255, 46, 136, 0.12)',
  },
  {
    key: 'Big',
    title: 'Big',
    playersLabel: '4 Players',
    subtitle: matrix.Big.description,
    icon: Users,
    sessions: matrix.Big.sessions,
    extensions: matrix.Big.extensions,
    screensNote: 'Screen 1, Screen 2, or Screen 3',
    spotlight: 'rgba(255, 138, 61, 0.12)',
  },
  {
    key: 'SimDrive',
    title: 'SimDrive',
    playersLabel: '1 Player · Racing Rig',
    subtitle: matrix.SimDrive.description,
    icon: Gauge,
    sessions: matrix.SimDrive.sessions,
    extensions: matrix.SimDrive.extensions,
    screensNote: 'Screen 3 (Logitech G923 + TRONE RS1)',
    spotlight: 'rgba(0, 240, 255, 0.14)',
  },
  {
    key: 'GTA6_Launch',
    title: 'GTA 6 Special',
    playersLabel: 'Launch Week Exclusive',
    subtitle: matrix.GTA6_Launch.description,
    icon: Flame,
    sessions: matrix.GTA6_Launch.sessions,
    extensions: matrix.GTA6_Launch.extensions,
    screensNote: '30m & 60m sessions only',
    spotlight: 'rgba(255, 46, 136, 0.16)',
  },
];

const DURATIONS = [
  { value: '15', label: '15 Mins' },
  { value: '30', label: '30 Mins' },
  { value: '60', label: '1 Hour (60m)' },
];

export default function PricingMatrix({ onSelectMode }) {
  const [duration, setDuration] = useState('60');
  const navigate = useNavigate();

  const handleChoose = (modeKey, mins) => {
    const validDuration =
      modeKey === 'GTA6_Launch' && mins === '15' ? '30' : mins;
    const screenParam = modeKey === 'SimDrive' ? '&screen=Screen3' : '';

    if (onSelectMode) {
      onSelectMode(modeKey, Number(validDuration));
    } else {
      navigate(`/book?mode=${modeKey}&duration=${validDuration}${screenParam}`);
    }
  };

  return (
    <section
      id="pricing"
      className="relative border-t border-white/10 bg-obsidian py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Duration Switcher */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neon">
              Session &amp; Extension Rates
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Lounge Pricing
            </h2>
            <p className="mt-2.5 max-w-xl text-sm text-white/60">
              Single, Dual, Triple, and Big are based on how many players are playing together. Pick a duration below to compare rates.
            </p>
          </div>

          {/* Duration Selector */}
          <div className="inline-grid grid-cols-3 gap-1 self-start rounded-xl border border-white/15 bg-white/[0.03] p-1 lg:self-auto">
            {DURATIONS.map((d) => {
              const active = duration === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-white text-obsidian'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6-Card Pricing Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES_LIST.map((item) => {
            const Icon = item.icon;
            const isGta15 = item.key === 'GTA6_Launch' && duration === '15';
            const displayDuration = isGta15 ? '30' : duration;
            const sessionPrice = item.sessions[displayDuration];
            const extensionPrice = item.extensions[displayDuration];

            return (
              <SpotlightCard
                key={item.key}
                spotlightColor={item.spotlight}
                className="rounded-2xl border border-white/10 bg-[#0d0f17] p-6"
              >
                <div className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-neon">
                        {item.playersLabel}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80">
                        <Icon size={17} />
                      </div>
                    </div>

                    <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">{item.subtitle}</p>

                    {/* Price Box */}
                    <div className="mt-5 rounded-xl border border-white/10 bg-obsidian p-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="font-display text-3xl font-bold text-white">
                            ₹<CountUp to={sessionPrice} duration={0.5} />
                          </span>
                          <span className="ml-1.5 text-xs text-white/50">
                            / {displayDuration} mins
                          </span>
                        </div>
                        <span className="text-xs font-medium text-cyber">
                          Extend: ₹{extensionPrice}
                        </span>
                      </div>
                      {isGta15 && (
                        <p className="mt-1.5 text-[11px] text-vice">
                          *GTA 6 starts at 30 mins (₹150) or 60 mins (₹250)
                        </p>
                      )}
                    </div>

                    {/* All Durations Quick Breakdown */}
                    <div className="mt-4 flex items-center justify-between text-xs text-white/55">
                      {Object.entries(item.sessions).map(([mins, amt]) => (
                        <span key={mins}>
                          {mins}m: <strong className="text-white/85">₹{amt}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChoose(item.key, displayDuration)}
                    className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-semibold text-obsidian transition-colors hover:bg-white/90"
                  >
                    <span>Book {item.title}</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
