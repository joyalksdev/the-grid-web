import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ArrowRight, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/SpotlightCard';
import GlareHover from '@/components/GlareHover';
import ShinyText from '@/components/ShinyText';
import gridData from '@/data/gridData.json';

const gtaPricing = gridData.pricingMatrix.GTA6_Launch;

const GTA_SPECIALS = [
  {
    title: '30-Minute Session',
    duration: 30,
    price: gtaPricing.sessions['30'],
    extensionPrice: gtaPricing.extensions['30'],
    desc: 'Jump straight into Vice City & Leonida for an action-packed 30-minute session.',
  },
  {
    title: '1-Hour Full Session',
    duration: 60,
    price: gtaPricing.sessions['60'],
    extensionPrice: gtaPricing.extensions['60'],
    desc: 'Full 60-minute story & open-world session on any of our 3 PS5 screens.',
  },
];

export default function GtaSpotlightSection() {
  const navigate = useNavigate();

  return (
    <section className="relative border-t border-white/10 bg-obsidian py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section Header Row */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-vice/40 bg-vice/10 px-3 py-1 text-xs font-medium text-white"
            >
              <Flame size={13} className="text-vice" />
              <ShinyText text="First 7 Days Launch Exclusive" speed={4} />
            </Badge>
            <h2 className="font-display text-3xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              GTA 6 Launch Special
            </h2>
          </div>

          <p className="max-w-md text-sm text-white/60">
            Be among the first in Kannur to play Grand Theft Auto VI. Reserve a 30-minute or 1-hour session online on Screen 1, Screen 2, or Screen 3.
          </p>
        </div>

        {/* Split Matrix */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-12">
          {/* Left 7 Columns: Visual Showcase */}
          <div className="flex flex-col justify-between bg-obsidian p-6 sm:p-9 lg:col-span-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-vice">
                Launch Week Event
              </span>
              <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
                Experience Vice City on our 4K TCL Screens
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                During the first 7 days of launch, book your 30-minute or 1-hour GTA 6 slot online and extend your playtime at discounted extension rates if the screen is open.
              </p>
            </div>

            <GlareHover
              glareColor="#ff2e88"
              glareOpacity={0.14}
              className="mt-8 rounded-xl border border-white/10 bg-[#0d0b14]"
            >
              <div className="relative flex flex-col justify-between overflow-hidden p-6 sm:flex-row sm:items-center">
                <div className="relative z-10 max-w-xs">
                  <img
                    src="/img/gta-6-logo.png"
                    alt="GTA VI"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="mt-3 text-xs font-medium text-white/70">
                    30 Mins: <span className="font-semibold text-white">₹150</span> · 1 Hour:{' '}
                    <span className="font-semibold text-neon">₹250</span>
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <Button
                      onClick={() => navigate('/book?mode=GTA6_Launch&duration=60')}
                      className="h-10 cursor-pointer rounded-lg bg-white px-5 text-xs font-semibold text-obsidian hover:bg-white/90"
                    >
                      <Ticket size={14} className="mr-1.5" />
                      Book GTA 6 Slot
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/gta-vi')}
                      className="h-10 cursor-pointer rounded-lg border-white/15 bg-transparent px-4 text-xs font-medium text-white hover:bg-white/[0.06]"
                    >
                      Launch Page
                      <ArrowRight size={13} className="ml-1.5" />
                    </Button>
                  </div>
                </div>

                <img
                  src="/img/jasonandlucia.png"
                  alt="Jason and Lucia"
                  className="pointer-events-none right-2 bottom-0 mt-4 h-44 w-auto object-contain object-bottom drop-shadow-[0_16px_30px_rgba(0,0,0,0.85)] sm:absolute sm:mt-0 sm:h-52"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </GlareHover>
          </div>

          {/* Right 5 Columns: 30m & 60m GTA 6 Options */}
          <div className="grid grid-cols-1 gap-px bg-white/10 lg:col-span-5">
            {GTA_SPECIALS.map((pkg) => (
              <SpotlightCard
                key={pkg.duration}
                spotlightColor="rgba(255, 46, 136, 0.12)"
                className="p-6 sm:p-8"
              >
                <div className="flex h-full flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-vice">
                        <Clock size={13} />
                        {pkg.duration} Minutes
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/75">
                        Extension: ₹{pkg.extensionPrice}
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between gap-4">
                      <h4 className="font-display text-2xl font-semibold tracking-tight text-white">
                        {pkg.title}
                      </h4>
                      <span className="font-display text-3xl font-bold text-white">
                        ₹{pkg.price}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
                      {pkg.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-white/50">
                      Available on Screen 1, 2 &amp; 3
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/book?mode=GTA6_Launch&duration=${pkg.duration}`)
                      }
                      className="group inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-neon transition-colors hover:text-white"
                    >
                      Book Now
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
