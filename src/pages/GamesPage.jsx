import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tv,
  Gamepad2,
  ArrowRight,
  Users,
  Gauge,
  Clock,
  RefreshCw,
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';
import { socket } from '@/services/socket';
import { isBookingEnabled } from '@/utils/bookingConfig';

const SCREEN_FILTERS = [
  { id: 'all', label: 'All Games' },
  { id: 'Screen1', label: 'Screen 1 (55" TV)' },
  { id: 'Screen2', label: 'Screen 2 (43" TV)' },
  { id: 'Screen3', label: 'Screen 3 (SimDrive & PS5)' },
];

const SCREEN_LABELS = {
  Screen1: 'Screen 1 (55" TV)',
  Screen2: 'Screen 2 (43" TV)',
  Screen3: 'Screen 3 (43" TV + SimDrive)',
};

function formatTime12h(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatModeBadge(modeKey, playersCount) {
  if (modeKey === 'SimDrive') return 'SimDrive Rig';
  if (modeKey === 'GTA 6' || modeKey === 'GTA6_Launch') return 'GTA 6';
  const count = Number(playersCount || 1);
  return `${count} ${count === 1 ? 'Player' : 'Players'}`;
}

export default function GamesPage({ embedded = false }) {
  const [selectedScreen, setSelectedScreen] = useState('all');
  const [games, setGames] = useState(gridData.gamesCatalog);
  const [screenStatuses, setScreenStatuses] = useState(() =>
    gridData.screens.map((s, idx) => ({
      screenId: idx + 1,
      code: s.code,
      name: s.name,
      tv: s.tv,
      console: s.console,
      isSim: Boolean(s.simRig?.available),
      status: 'available',
      activeSession: null,
    }))
  );
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const navigate = useNavigate();

  const loadScreenStatus = useCallback(async () => {
    setRefreshingStatus(true);
    try {
      const data = await bookingService.getPublicScreensStatus();
      if (Array.isArray(data?.screens) && data.screens.length > 0) {
        setScreenStatuses(
          gridData.screens.map((staticScr, idx) => {
            const live = data.screens.find(
              (r) =>
                r.code === staticScr.code ||
                Number(r.screenId) === idx + 1 ||
                r.name?.toLowerCase() === staticScr.name.toLowerCase()
            );

            return {
              screenId: idx + 1,
              code: staticScr.code,
              name: staticScr.name,
              tv: staticScr.tv,
              console: staticScr.console,
              isSim: Boolean(staticScr.simRig?.available),
              status: live?.status === 'occupied' ? 'occupied' : 'available',
              activeSession: live?.activeSession || null,
            };
          })
        );
      }
    } catch {
      // Fallback to default available state if backend is offline
    } finally {
      setRefreshingStatus(false);
    }
  }, []);

  useEffect(() => {
    loadScreenStatus();
    const interval = setInterval(loadScreenStatus, 30000);
    return () => clearInterval(interval);
  }, [loadScreenStatus]);

  useEffect(() => {
    const handleScreenUpdate = () => {
      loadScreenStatus();
    };
    socket.on('screen_updated', handleScreenUpdate);
    return () => {
      socket.off('screen_updated', handleScreenUpdate);
    };
  }, [loadScreenStatus]);

  useEffect(() => {
    let active = true;
    bookingService
      .getPublicConfig()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data?.games) && data.games.length > 0) {
          const mapped = data.games.map((g) => {
            const availableOn = (g.availableScreens || []).map((s) => {
              if (s.code) return s.code;
              if (s.screenId) return `Screen${s.screenId}`;
              return 'Screen1';
            });

            return {
              id: g._id || g.slug,
              slug: g.slug,
              title: g.title,
              genre: g.genre,
              description: g.description || '',
              thumbnail: g.thumbnail?.url || '',
              cover: g.cover?.url || g.coverUrl || '',
              availableOn: availableOn.length > 0 ? availableOn : ['Screen1'],
              recommendedModes:
                Array.isArray(g.supportedModes) && g.supportedModes.length > 0
                  ? g.supportedModes
                  : [g.recommendedMode || 'Single'],
              minPlayers: g.minPlayers || 1,
              maxPlayers: g.maxPlayers || 4,
              isFeatured: Boolean(g.isFeatured),
            };
          });

          setGames(mapped);
        }
      })
      .catch(() => {
        // Silently keep static catalog fallback
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredGames =
    selectedScreen === 'all'
      ? games
      : games.filter((g) => g.availableOn?.includes(selectedScreen));

  const freeCount = screenStatuses.filter(
    (s) => s.status === 'available'
  ).length;

  return (
    <section
      id="games"
      className={`relative border-t border-white/10 bg-obsidian text-white ${
        embedded ? 'py-20' : 'pt-28 sm:pt-32 pb-24 min-h-screen'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====================================================================
            LIVE LOUNGE SCREEN STATUS (TOP OF GAMES & SCREENS PAGE)
           ==================================================================== */}
        {!embedded && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-[#0d1017] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/10 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neon">
                    Live Screen Status
                  </span>
                  <span className="rounded-md border border-white/10 bg-obsidian px-2 py-0.5 font-mono text-[10px] font-semibold text-white/75">
                    {freeCount}/{screenStatuses.length} Available
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/55 hidden sm:block">
                  Real-time lounge screen occupancy synced with The Grid counter. Tap a screen to filter its installed games.
                </p>
              </div>

              <button
                type="button"
                onClick={loadScreenStatus}
                disabled={refreshingStatus}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-obsidian px-2.5 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={12}
                  className={refreshingStatus ? 'animate-spin text-neon' : ''}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* MOBILE: Simple, clean compact rows */}
            <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-white/10 bg-obsidian sm:hidden">
              {screenStatuses.map((scr) => {
                const isOccupied = scr.status === 'occupied';
                const isSelected = selectedScreen === scr.code;
                const freeAt = formatTime12h(scr.activeSession?.endTime);
                const remMins = scr.activeSession?.remainingMins;

                return (
                  <button
                    key={scr.code}
                    type="button"
                    onClick={() =>
                      setSelectedScreen(isSelected ? 'all' : scr.code)
                    }
                    className={`flex w-full cursor-pointer items-center justify-between px-3.5 py-3 text-left transition-colors ${
                      isSelected ? 'bg-white/[0.05]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0d1017] text-white/80">
                        {scr.isSim ? <Gauge size={15} /> : <Tv size={15} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white">
                          {scr.name}{' '}
                          <span className="font-normal text-white/50">
                            · {scr.tv.split(' ')[0]}
                          </span>
                        </p>
                        <p className="truncate text-[11px] text-white/50">
                          {isOccupied
                            ? freeAt
                              ? `Free around ${freeAt}${remMins ? ` (~${remMins}m)` : ''}`
                              : 'Currently in session'
                            : 'Ready to play now'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isOccupied
                          ? 'border-amber-500/35 bg-amber-500/10 text-amber-300'
                          : 'border-neon/35 bg-neon/10 text-neon'
                      }`}
                    >
                      {isOccupied ? 'In Session' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* DESKTOP / TABLET: 3 SaaS Cards */}
            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4">
              {screenStatuses.map((scr) => {
                const isOccupied = scr.status === 'occupied';
                const isSelected = selectedScreen === scr.code;
                const freeAt = formatTime12h(scr.activeSession?.endTime);
                const remMins = scr.activeSession?.remainingMins;

                return (
                  <div
                    key={scr.code}
                    onClick={() =>
                      setSelectedScreen(isSelected ? 'all' : scr.code)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      setSelectedScreen(isSelected ? 'all' : scr.code)
                    }
                    className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-neon bg-obsidian'
                        : 'border-white/10 bg-obsidian hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0d1017] text-white/80">
                            {scr.isSim ? <Gauge size={15} /> : <Tv size={15} />}
                          </div>
                          <div>
                            <h3 className="font-display text-sm font-bold text-white">
                              {scr.name}
                            </h3>
                            <p className="text-[11px] text-white/50">
                              {scr.tv}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isOccupied
                              ? 'border-amber-500/35 bg-amber-500/10 text-amber-300'
                              : 'border-neon/35 bg-neon/10 text-neon'
                          }`}
                        >
                          {isOccupied ? 'In Session' : 'Available'}
                        </span>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                        {isOccupied ? (
                          <>
                            <span className="inline-flex items-center gap-1 text-[11px] text-white/65">
                              <Clock size={12} className="text-amber-400" />
                              {freeAt ? `Free at ${freeAt}` : 'In Progress'}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-amber-300">
                              {remMins
                                ? `~${remMins}m left`
                                : formatModeBadge(
                                    scr.activeSession?.mode,
                                    scr.activeSession?.playersCount
                                  )}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] text-white/60">
                              Open for walk-in &amp; booking
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/book?screen=${scr.code}`);
                              }}
                              className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-bold text-neon hover:underline"
                            >
                              <span>Book Now</span>
                              <ArrowRight size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyber">
              Installed Game Library
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Games by Screen
            </h2>
            <p className="mt-2.5 max-w-xl text-xs sm:text-sm text-white/60">
              Filter by screen to see which titles are installed on Screen 1, Screen 2, and Screen 3 before you book.
            </p>
          </div>

          {/* Screen Filter Buttons (Responsive 2x2 on small screens, inline on sm+) */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {SCREEN_FILTERS.map((f) => {
              const active = selectedScreen === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedScreen(f.id)}
                  className={`cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-white bg-white text-obsidian'
                      : 'border-white/15 bg-[#0d1017] text-white/75 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredGames.map((game) => {
            const primaryScreen =
              selectedScreen !== 'all' && game.availableOn?.includes(selectedScreen)
                ? selectedScreen
                : game.availableOn?.[0] || 'Screen1';
            const defaultMode = game.recommendedModes?.[0] || 'Single';
            const artwork = game.thumbnail || game.cover;

            return (
              <SpotlightCard
                key={game.id}
                spotlightColor="rgba(0, 240, 255, 0.12)"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f17] p-4 transition-all duration-300 hover:border-white/20"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Artwork Banner if available */}
                  {artwork ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-white/[0.03]">
                      <img
                        src={artwork}
                        alt={game.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent opacity-80" />

                      <span className="absolute bottom-2 left-2 rounded-md border border-white/15 bg-obsidian/85 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
                        {game.genre}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                        {game.genre}
                      </span>
                      <Gamepad2 size={16} className="text-white/40" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight text-white line-clamp-1">
                        {game.title}
                      </h3>
                      {game.minPlayers && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-white/45">
                          <Users size={11} />
                          {game.minPlayers === game.maxPlayers
                            ? `${game.minPlayers}P`
                            : `${game.minPlayers}-${game.maxPlayers}P`}
                        </span>
                      )}
                    </div>

                    {game.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-white/50">
                        {game.description}
                      </p>
                    )}

                    {/* Available Screens Chips */}
                    <div className="mt-3">
                      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        Installed on
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {game.availableOn?.map((scrCode) => (
                          <span
                            key={scrCode}
                            className="inline-flex items-center gap-1 rounded-md border border-neon/30 bg-neon/10 px-2 py-0.5 text-[11px] font-semibold text-neon"
                          >
                            <Tv size={11} />
                            {SCREEN_LABELS[scrCode] || scrCode}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5">
                  <span className="text-[11px] text-white/50 line-clamp-1">
                    {game.recommendedModes?.join(', ')}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/book?screen=${primaryScreen}&mode=${defaultMode}&game=${encodeURIComponent(
                          game.title
                        )}`
                      )
                    }
                    className="group/btn inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-white transition-colors hover:text-neon shrink-0"
                  >
                    {isBookingEnabled() ? 'Book Screen' : 'View Rates'}
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover/btn:translate-x-0.5"
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
