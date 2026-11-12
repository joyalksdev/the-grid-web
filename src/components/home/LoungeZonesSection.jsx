import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Gauge, Gamepad2, ArrowRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BorderGlow from '@/components/BorderGlow';
import gridData from '@/data/gridData.json';

const SCREEN_COLORS = {
  Screen1: ['#00ff66', '#00f0ff', '#ffffff'],
  Screen2: ['#00f0ff', '#38bdf8', '#00ff66'],
  Screen3: ['#ff2e88', '#ff8a3d', '#c084fc'],
};

export default function LoungeZonesSection() {
  const navigate = useNavigate();

  return (
    <section className="relative border-t border-white/10 bg-obsidian py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <Badge
              variant="outline"
              className="mb-3 rounded-full border-white/15 bg-white/[0.03] px-3 py-1 text-xs font-medium text-neon"
            >
              Our 3 Gaming Screens
            </Badge>
            <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Pick the Screen With Your Games
            </h2>
          </div>

          <p className="max-w-md text-sm text-white/60">
            Customers cannot switch screens after booking, so check each screen&apos;s TV size and installed games below before you book.
          </p>
        </div>

        {/* 3-Column Screen Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gridData.screens.map((screen) => {
            const isSim = Boolean(screen.simRig?.available);
            return (
              <BorderGlow
                key={screen.code}
                edgeSensitivity={28}
                glowColor="150 80 70"
                backgroundColor="#0c0e14"
                borderRadius={24}
                glowRadius={32}
                glowIntensity={0.9}
                coneSpread={25}
                animated={false}
                colors={SCREEN_COLORS[screen.code] || SCREEN_COLORS.Screen1}
              >
                <div className="flex h-full flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-xs font-medium text-neon">
                          {screen.tv} · {screen.console}
                        </span>
                        <h3 className="font-display mt-0.5 text-2xl font-semibold tracking-tight text-white">
                          {screen.name}
                        </h3>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/85">
                        {isSim ? <Gauge size={19} /> : <Tv size={19} />}
                      </div>
                    </div>

                    {/* Hardware Info */}
                    <div className="mt-4 rounded-xl border border-white/10 bg-obsidian p-3.5">
                      <p className="text-xs leading-relaxed text-white/75">
                        {screen.highlight}
                      </p>
                      {isSim && (
                        <div className="mt-2.5 border-t border-white/10 pt-2.5 text-xs">
                          <p className="font-semibold text-cyber">
                            SimDrive Setup: {screen.simRig.wheel}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/60">
                            {screen.simRig.cockpit}
                          </p>
                          <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-neon">
                            <Info size={13} className="mt-0.5 shrink-0" />
                            <span>{screen.simRig.note}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Installed Games Badges */}
                    <div className="mt-5">
                      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-white/60">
                        <Gamepad2 size={14} className="text-neon" />
                        <span>Installed Games on {screen.name}:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {screen.games.map((game) => (
                          <span
                            key={game}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/85"
                          >
                            {game}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/book?screen=${screen.code}&mode=Single`)}
                      className="group inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-obsidian transition-colors hover:bg-white/90"
                    >
                      Book {screen.name}
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>

                    {isSim && (
                      <button
                        type="button"
                        onClick={() => navigate('/book?screen=Screen3&mode=SimDrive')}
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-cyber/30 bg-cyber/10 px-3.5 py-2.5 text-xs font-semibold text-cyber transition-colors hover:bg-cyber/20"
                      >
                        Book SimDrive
                      </button>
                    )}
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </div>
    </section>
  );
}
