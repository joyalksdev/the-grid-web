import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Clock, Sofa, ArrowRight, CheckCircle2 } from 'lucide-react';
import GtaHero from '@/components/GtaVI/GtaHero';
import { Badge } from '@/components/ui/badge';
import AnimatedContent from '@/components/AnimatedContent';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';

const gtaPricing = gridData.pricingMatrix.GTA6_Launch;

const GTA_PACKAGES = [
  {
    id: 'gta-30',
    name: '30-Minute Launch Session',
    duration: 30,
    price: gtaPricing.sessions['30'],
    extension: gtaPricing.extensions['30'],
    tag: 'Quick Session',
    desc: 'Jump into Vice City and Leonida for a 30-minute session on your chosen PS5 screen.',
    perks: [
      'Available on Screen 1, Screen 2, or Screen 3',
      'Extend by 30 mins for ₹130 (if screen is free)',
      'Instant booking confirmation',
    ],
    spotlight: 'rgba(255, 46, 136, 0.14)',
  },
  {
    id: 'gta-60',
    name: '1-Hour Full Launch Session',
    duration: 60,
    price: gtaPricing.sessions['60'],
    extension: gtaPricing.extensions['60'],
    tag: 'Most Popular',
    desc: 'Experience a full 60 minutes of story missions and Vice City exploration.',
    perks: [
      'Available on Screen 1 (55" TV), Screen 2, or Screen 3',
      'Extend by 1 hour for ₹230 (if screen is free)',
      'Instant booking confirmation',
    ],
    spotlight: 'rgba(0, 255, 102, 0.14)',
  },
];

export default function GtaViPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian text-white">
      {/* 1. GTA VI Parallax Hero */}
      <GtaHero
        onBookClick={() =>
          navigate(
            '/book?mode=GTA6_Launch&duration=60&game=Grand%20Theft%20Auto%20VI'
          )
        }
      />

      {/* 2. GTA 6 Launch Special Pricing & Screens */}
      <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <AnimatedContent
          distance={32}
          direction="vertical"
          duration={0.85}
          ease="power3.out"
          blur={8}
          threshold={0.1}
        >
          {/* Section Header */}
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div>
              <Badge
                variant="outline"
                className="mb-3 rounded-full border-vice/40 bg-vice/10 px-3 py-1 text-xs font-medium text-vice"
              >
                First 7 Days Exclusive
              </Badge>
              <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                GTA 6 Launch Special Rates
              </h2>
            </div>

            <p className="max-w-md text-sm text-white/60">
              During the first 7 days of launch, book a 30-minute or 1-hour session online. (Note: 15-minute sessions are not offered for GTA 6.)
            </p>
          </div>

          {/* 2-Column GTA 6 Launch Sessions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {GTA_PACKAGES.map((pkg) => (
              <SpotlightCard
                key={pkg.id}
                spotlightColor={pkg.spotlight}
                className="rounded-2xl border border-white/10 bg-[#0d1017] p-7 sm:p-8"
              >
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-vice">
                        {pkg.tag}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75">
                        <Clock size={14} className="text-neon" />
                        {pkg.duration} Mins
                      </span>
                    </div>

                    <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight text-white">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
                      {pkg.desc}
                    </p>

                    <div className="mt-6 flex items-baseline justify-between border-y border-white/10 py-4">
                      <div>
                        <span className="font-display text-4xl font-bold text-white">
                          ₹{pkg.price}
                        </span>
                        <span className="ml-1.5 text-xs text-white/50">
                          / {pkg.duration} mins
                        </span>
                      </div>
                      <span className="text-xs font-medium text-cyber">
                        Extension: ₹{pkg.extension}
                      </span>
                    </div>

                    <ul className="mt-5 space-y-2.5 text-xs text-white/75">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2.5">
                          <CheckCircle2 size={14} className="shrink-0 text-neon" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/book?mode=GTA6_Launch&duration=${pkg.duration}&game=Grand%20Theft%20Auto%20VI`
                      )
                    }
                    className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-5 py-3 text-xs font-semibold text-obsidian transition-colors hover:bg-white/90"
                  >
                    <span>Book {pkg.name}</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* 3. Choose Your Screen for GTA 6 */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {gridData.screens.map((scr) => (
              <div
                key={scr.code}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1017] p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neon">
                      {scr.tv}
                    </span>
                    <Tv size={16} className="text-white/60" />
                  </div>
                  <h4 className="font-display mt-2 text-lg font-semibold text-white">
                    {scr.name} · {scr.console}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                    {scr.highlight}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/book?screen=${scr.code}&mode=GTA6_Launch&duration=60&game=Grand%20Theft%20Auto%20VI`
                    )
                  }
                  className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-white hover:text-neon"
                >
                  Book GTA 6 on {scr.name}
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
