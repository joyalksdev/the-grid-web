import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Gamepad2, ArrowRight } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';

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
  const navigate = useNavigate();

  const filteredGames =
    selectedScreen === 'all'
      ? gridData.gamesCatalog
      : gridData.gamesCatalog.filter((g) =>
          g.availableOn.includes(selectedScreen)
        );

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
            <span className="text-xs font-semibold uppercase tracking-wider text-cyber">
              Installed Game Library
            </span>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredGames.map((game) => {
            const primaryScreen =
              selectedScreen !== 'all' && game.availableOn.includes(selectedScreen)
                ? selectedScreen
                : game.availableOn[0];
            const defaultMode = game.recommendedModes?.[0] || 'Single';

            return (
              <SpotlightCard
                key={game.id}
                spotlightColor="rgba(0, 240, 255, 0.1)"
                className="rounded-2xl border border-white/10 bg-[#0d0f17] p-5"
              >
                <div className="flex h-full flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                        {game.genre}
                      </span>
                      <Gamepad2 size={15} className="text-white/40" />
                    </div>

                    <h3 className="font-display mt-3.5 text-lg font-semibold tracking-tight text-white">
                      {game.title}
                    </h3>

                    {/* Available Screens Chips */}
                    <div className="mt-3">
                      <p className="mb-1.5 text-[11px] font-medium text-white/50">
                        Installed on:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {game.availableOn.map((scrCode) => (
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

                  <div className="flex items-center justify-between border-t border-white/10 pt-3.5">
                    <span className="text-[11px] text-white/50">
                      Modes: {game.recommendedModes.join(', ')}
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
                      className="group inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-white transition-colors hover:text-neon"
                    >
                      Book Screen
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
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
