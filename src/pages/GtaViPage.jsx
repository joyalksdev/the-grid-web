import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import GtaHero from '@/components/GtaVI/GtaHero';
import { Badge } from '@/components/ui/badge';
import AnimatedContent from '@/components/AnimatedContent';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';
import { bookingService } from '@/services/bookingService';

const defaultGtaPricing = gridData.pricingMatrix.GTA6_Launch;
const GTA6_SCREENS = gridData.screens.filter(
  (s) => s.code === 'Screen1' || s.code === 'Screen2'
);

export default function GtaViPage() {
  const navigate = useNavigate();
  const [gtaPricing, setGtaPricing] = useState(defaultGtaPricing);

  useEffect(() => {
    let active = true;
    bookingService
      .getPublicConfig()
      .then((data) => {
        if (!active) return;
        if (data?.pricing?.matrix?.GTA6_Launch) {
          setGtaPricing({
            ...defaultGtaPricing,
            sessions: {
              ...defaultGtaPricing.sessions,
              ...(data.pricing.matrix.GTA6_Launch.sessions || {}),
            },
            extensions: {
              ...defaultGtaPricing.extensions,
              ...(data.pricing.matrix.GTA6_Launch.extensions || {}),
            },
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const gtaPackages = [
    {
      id: 'gta-30',
      name: '30-Minute Session',
      duration: 30,
      price: gtaPricing.sessions['30'],
      extension: gtaPricing.extensions['30'],
      tag: 'Quick Session',
      desc: 'Jump into Vice City and Leonida for a 30-minute session on Screen 1 or Screen 2.',
      perks: [
        'Available on Screen 1 (55" 4K TV) & Screen 2 (43" 4K TV)',
        `Extend by 30 mins for ₹${gtaPricing.extensions['30']} (if screen is free)`,
        'Instant booking confirmation on WhatsApp',
      ],
      spotlight: 'rgba(255, 46, 136, 0.14)',
    },
    {
      id: 'gta-60',
      name: '1-Hour Full Session',
      duration: 60,
      price: gtaPricing.sessions['60'],
      extension: gtaPricing.extensions['60'],
      tag: 'Most Popular',
      desc: 'Experience a full 60 minutes of story missions and Vice City exploration on PS5.',
      perks: [
        'Available on Screen 1 (55" 4K TV) & Screen 2 (43" 4K TV)',
        `Extend by 1 hour for ₹${gtaPricing.extensions['60']} (if screen is free)`,
        'Instant booking confirmation on WhatsApp',
      ],
      spotlight: 'rgba(0, 255, 102, 0.14)',
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-white">
      {/* 1. GTA VI Parallax Hero */}
      <GtaHero onBookClick={() => navigate('/book')} />

      {/* 2. GTA 6 Session Rates & Screens */}
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
                Available Now on PS5
              </Badge>
              <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                GTA 6 Session Rates
              </h2>
            </div>

            <p className="max-w-md text-sm text-white/60">
              Choose a 30-minute or 1-hour session online on Screen 1 or Screen 2. (Note: 15-minute sessions are not offered for GTA 6.)
            </p>
          </div>

          {/* 2-Column GTA 6 Sessions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {gtaPackages.map((pkg) => (
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
                    onClick={() => navigate('/book')}
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

          {/* 3. Choose Your Screen for GTA 6 (Screen 1 & Screen 2) */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {GTA6_SCREENS.map((scr) => (
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
                  onClick={() => navigate('/book')}
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
