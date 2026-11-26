import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Flame, Gauge, ArrowRight, RefreshCw } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';

const defaultMatrix = gridData.pricingMatrix;

const DURATIONS = [
  { value: '15', label: '15 Mins' },
  { value: '30', label: '30 Mins' },
  { value: '60', label: '1 Hour (60m)' },
];

export function buildModesList(matrix) {
  const m = matrix || defaultMatrix;
  return [
    {
      key: 'Single',
      title: 'Single',
      playersLabel: '1 Player',
      subtitle: m.Single?.description || '1 Player (Solo Controller Session)',
      icon: Gamepad2,
      sessions: m.Single?.sessions || defaultMatrix.Single.sessions,
      extensions: m.Single?.extensions || defaultMatrix.Single.extensions,
      screensNote: 'Screen 1, Screen 2, or Screen 3',
      spotlight: 'rgba(0, 240, 255, 0.12)',
    },
    {
      key: 'Dual',
      title: 'Dual',
      playersLabel: '2 Players',
      subtitle: m.Dual?.description || '2 Players (Co-Op / 1v1 Multiplayer)',
      icon: Users,
      sessions: m.Dual?.sessions || defaultMatrix.Dual.sessions,
      extensions: m.Dual?.extensions || defaultMatrix.Dual.extensions,
      screensNote: 'Screen 1, Screen 2, or Screen 3',
      spotlight: 'rgba(0, 255, 102, 0.12)',
    },
    {
      key: 'Triple',
      title: 'Triple',
      playersLabel: '3 Players',
      subtitle: m.Triple?.description || '3 Players (Trio Multiplayer)',
      icon: Users,
      sessions: m.Triple?.sessions || defaultMatrix.Triple.sessions,
      extensions: m.Triple?.extensions || defaultMatrix.Triple.extensions,
      screensNote: 'Screen 1, Screen 2, or Screen 3',
      spotlight: 'rgba(255, 46, 136, 0.12)',
    },
    {
      key: 'Big',
      title: 'Big',
      playersLabel: '4 Players',
      subtitle: m.Big?.description || '4 Players (Full Squad Multiplayer)',
      icon: Users,
      sessions: m.Big?.sessions || defaultMatrix.Big.sessions,
      extensions: m.Big?.extensions || defaultMatrix.Big.extensions,
      screensNote: 'Screen 1, Screen 2, or Screen 3',
      spotlight: 'rgba(255, 138, 61, 0.12)',
    },
    {
      key: 'SimDrive',
      title: 'SimDrive',
      playersLabel: '1 Player · Racing Rig',
      subtitle:
        m.SimDrive?.description ||
        'Logitech G923 Racing Wheel + TRONE RS1 Aero Cockpit',
      icon: Gauge,
      sessions: m.SimDrive?.sessions || defaultMatrix.SimDrive.sessions,
      extensions: m.SimDrive?.extensions || defaultMatrix.SimDrive.extensions,
      screensNote: 'Screen 3 (Logitech G923 + TRONE RS1)',
      spotlight: 'rgba(0, 240, 255, 0.14)',
    },
    {
      key: 'GTA 6',
      title: 'GTA 6',
      playersLabel: '1 Player · Available Now',
      subtitle: 'Play Grand Theft Auto VI on PS5 (30m & 60m sessions)',
      icon: Flame,
      sessions:
        m['GTA 6']?.sessions ||
        m.GTA6_Launch?.sessions ||
        defaultMatrix['GTA 6'].sessions,
      extensions:
        m['GTA 6']?.extensions ||
        m.GTA6_Launch?.extensions ||
        defaultMatrix['GTA 6'].extensions,
      screensNote: 'Screen 1 & Screen 2 (30m & 60m)',
      spotlight: 'rgba(255, 46, 136, 0.16)',
    },
  ];
}

export const MODES_LIST = buildModesList(defaultMatrix);

export default function PricingMatrix({ onSelectMode, isFullPage = false }) {
  const [duration, setDuration] = useState('60');
  const [liveMatrix, setLiveMatrix] = useState(defaultMatrix);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const navigate = useNavigate();

  // Fetch dynamic pricing from backend pricing service
  useEffect(() => {
    let active = true;
    setLoadingPricing(true);
    bookingService
      .getPublicConfig()
      .then((data) => {
        if (!active) return;
        if (data?.pricing?.matrix) {
          setLiveMatrix((prev) => {
            const merged = { ...prev };
            const remoteMatrix = { ...data.pricing.matrix };
            if (remoteMatrix.GTA6_Launch && !remoteMatrix['GTA 6']) {
              remoteMatrix['GTA 6'] = remoteMatrix.GTA6_Launch;
            }
            for (const key of Object.keys(prev)) {
              if (remoteMatrix[key]) {
                merged[key] = {
                  ...prev[key],
                  sessions: {
                    ...prev[key].sessions,
                    ...(remoteMatrix[key].sessions || {}),
                  },
                  extensions: {
                    ...prev[key].extensions,
                    ...(remoteMatrix[key].extensions || {}),
                  },
                };
              }
            }
            return merged;
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingPricing(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const modes = buildModesList(liveMatrix);

  const handleChoose = (modeKey, mins) => {
    const validDuration =
      (modeKey === 'GTA 6' || modeKey === 'GTA6_Launch') && mins === '15'
        ? '30'
        : mins;
    const screenParam = modeKey === 'SimDrive' ? '&screen=Screen3' : '';

    if (onSelectMode) {
      onSelectMode(modeKey, Number(validDuration));
    } else {
      navigate(
        `/book?mode=${encodeURIComponent(modeKey)}&duration=${validDuration}${screenParam}`
      );
    }
  };

  return (
    <section
      id="pricing"
      className={`relative bg-obsidian text-white ${
        isFullPage
          ? 'min-h-screen pt-28 sm:pt-32 pb-24'
          : 'border-t border-white/10 py-16 sm:py-20'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Duration Switcher */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neon">
                Session &amp; Extension Rates
              </span>
              {loadingPricing && (
                <RefreshCw size={12} className="animate-spin text-neon" />
              )}
            </div>
            <h1 className="font-display mt-1.5 text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Lounge Pricing
            </h1>
            <p className="mt-2.5 max-w-xl text-xs sm:text-sm text-white/60">
              Single, Dual, Triple, and Big are based on how many players are playing together. Pick a duration below to compare session and extension rates.
            </p>
          </div>

          {/* Duration Selector */}
          <div className="inline-grid grid-cols-3 gap-1 self-start rounded-xl border border-white/10 bg-[#0d1017] p-1 lg:self-auto">
            {DURATIONS.map((d) => {
              const active = duration === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
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

        {/* 6-Card Pricing Grid with SpotlightCard */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((item) => {
            const Icon = item.icon;
            const isGta15 =
              (item.key === 'GTA 6' || item.key === 'GTA6_Launch') &&
              duration === '15';
            const displayDuration = isGta15 ? '30' : duration;
            const sessionPrice = item.sessions[displayDuration];
            const extensionPrice = item.extensions[displayDuration];

            return (
              <SpotlightCard
                key={item.key}
                spotlightColor={item.spotlight}
                className="rounded-2xl border border-white/10 bg-[#0d1017] p-6"
              >
                <div className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-white/10 bg-obsidian px-2.5 py-1 text-xs font-semibold text-neon">
                        {item.playersLabel}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-obsidian text-white/80">
                        <Icon size={16} />
                      </div>
                    </div>

                    <h3 className="font-display mt-4 text-2xl font-bold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">{item.subtitle}</p>

                    {/* Price Box */}
                    <div className="mt-5 rounded-xl border border-white/10 bg-obsidian p-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="font-display text-3xl font-extrabold text-white">
                            ₹{sessionPrice}
                          </span>
                          <span className="ml-1.5 text-xs text-white/50">
                            / {displayDuration} mins
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-cyber">
                          Extend: +₹{extensionPrice}
                        </span>
                      </div>
                      {isGta15 && (
                        <p className="mt-1.5 text-[11px] text-vice">
                          *GTA 6 starts at 30 mins (₹{item.sessions['30']}) or 60 mins (₹{item.sessions['60']})
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
                    className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-bold text-obsidian transition-colors hover:bg-white/90"
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

        {/* Full Session & Extension Comparison Table when viewing dedicated /pricing page */}
        {isFullPage && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]">
            <div className="border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Full Session &amp; Extension Rate Card
                </h2>
                <p className="text-xs text-white/55">
                  Discounted extension rates apply when extending your active session if the next slot is open.
                </p>
              </div>
              <span className="text-[11px] font-mono text-neon">
                Open Daily · 10:00 AM – 10:00 PM
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-obsidian text-[11px] uppercase tracking-wider text-white/50">
                    <th className="py-3.5 px-5 font-semibold">Mode / Players</th>
                    <th className="py-3.5 px-4 font-semibold">15 Mins</th>
                    <th className="py-3.5 px-4 font-semibold">30 Mins</th>
                    <th className="py-3.5 px-4 font-semibold">1 Hour (60m)</th>
                    <th className="py-3.5 px-5 font-semibold">Extensions (15m / 30m / 60m)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {modes.map((m) => (
                    <tr key={m.key} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-5">
                        <p className="font-display font-bold text-white text-sm">
                          {m.title}
                        </p>
                        <p className="text-[11px] text-white/50">{m.playersLabel}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {m.sessions['15'] ? `₹${m.sessions['15']}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {m.sessions['30'] ? `₹${m.sessions['30']}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-neon text-sm">
                        {m.sessions['60'] ? `₹${m.sessions['60']}` : '—'}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-cyber">
                        {m.extensions['15'] ? `+₹${m.extensions['15']} / ` : ''}
                        {m.extensions['30'] ? `+₹${m.extensions['30']} / ` : ''}
                        {m.extensions['60'] ? `+₹${m.extensions['60']}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
