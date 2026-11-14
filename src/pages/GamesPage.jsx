import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Gamepad2, ArrowRight, Sparkles, Users } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';

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

export default function GamesPage({ embedded = false }) {
  const [selectedScreen, setSelectedScreen] = useState('all');
  const [games, setGames] = useState(gridData.gamesCatalog);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const navigate = useNavigate();

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
          setIsLiveFromDb(true);
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

  return (
    <section
      id="games"
      className={`relative border-t border-white/10 bg-obsidian text-white ${
        embedded ? 'py-20' : 'pt-32 pb-24 min-h-screen'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyber">
                Installed Game Library
              </span>
              {isLiveFromDb && (
                <span className="inline-flex items-center gap-1 rounded-full border border-neon/30 bg-neon/10 px-2 py-0.5 text-[10px] font-semibold text-neon">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                  Live Sync
                </span>
              )}
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Games by Screen
            </h2>
            <p className="mt-2.5 max-w-xl text-sm text-white/60">
              Filter by screen to see which titles are installed on Screen 1, Screen 2, and Screen 3 before you book.
            </p>
          </div>

          {/* Screen Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {SCREEN_FILTERS.map((f) => {
              const active = selectedScreen === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedScreen(f.id)}
                  className={`cursor-pointer rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-white bg-white text-obsidian'
                      : 'border-white/15 bg-white/[0.03] text-white/75 hover:bg-white/[0.08] hover:text-white'
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
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f17] p-4 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-neon/5"
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
                      
                      {game.isFeatured && (
                        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-obsidian/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                          <Sparkles size={10} className="text-amber-400" /> Featured
                        </span>
                      )}

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
                        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-white/40">
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
                    Book Screen
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
