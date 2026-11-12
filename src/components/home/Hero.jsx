import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Gamepad2, Gauge, Tv, Sofa, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CurvedLoop from '@/components/CurvedLoop';
import GradientText from '@/components/GradientText';
import AnimatedContent from '@/components/AnimatedContent';
import BorderGlow from '@/components/BorderGlow';
import gridData from '@/data/gridData.json';

const LOUNGE_SPECS = [
  {
    icon: Tv,
    value: '3 Screens',
    label: '55" & 43" TCL 4K TVs',
    sub: '2 PS5 Disc + 1 PS5 Slim setup',
  },
  {
    icon: Gauge,
    value: 'SimDrive',
    label: 'Logitech G923 + TRONE RS1',
    sub: 'Racing wheel, pedals & cockpit chair',
  },
  {
    icon: Gamepad2,
    value: '7 Pads',
    label: 'DualSense Controllers',
    sub: 'Play solo or up to 4 players together',
  },
  {
    icon: Sofa,
    value: 'AC Lounge',
    label: '2 Sofas + 4 Bean Bags',
    sub: `${gridData.loungeInfo.address.area}, ${gridData.loungeInfo.address.district}`,
  },
];

const cardsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const cardItem = {
  hidden: { y: 24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function GridHero() {
  const navigate = useNavigate();

  return (
    <section className="relative isolate flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-obsidian pb-16 pt-28 text-white">
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
      />

      {/* CurvedLoop in background */}
      <div className="pointer-events-auto absolute inset-x-0 top-28 z-[1] overflow-hidden opacity-20 transition-opacity duration-500 hover:opacity-40">
        <CurvedLoop
          marqueeText="THE GRID GAMING LOUNGE ✦ PERAVOOR KANNUR ✦ PS5 4K SCREENS ✦ LOGITECH G923 SIMDRIVE COCKPIT ✦ OPEN 10AM TO 10PM ✦ "
          shape="arc"
          speed={1.8}
          curveAmount={260}
          direction="left"
          fontSize={76}
          fontWeight={800}
          letterSpacing={2}
          separator=""
          outline={false}
          scrollBoost={1.2}
          edgeFade={0.15}
          interactive
          pauseOnHover={false}
        />
      </div>

      <div className="relative z-10 mx-auto my-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AnimatedContent
          distance={40}
          direction="vertical"
          duration={1}
          ease="power3.out"
          blur={12}
          stagger={0.08}
          threshold={0.1}
        >
          {/* Status row */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="gap-2 rounded-full border-white/15 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/80"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
              </span>
              {gridData.loungeInfo.address.area}, {gridData.loungeInfo.address.district} ·{' '}
              {gridData.loungeInfo.timings.open} – {gridData.loungeInfo.timings.close}
            </Badge>

            <button
              type="button"
              onClick={() => navigate('/gta-vi')}
              className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              GTA 6 Launch Special
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Headline */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
              Play together at{' '}
              <span className="font-logo mt-1 block sm:mt-0 sm:inline">
                <GradientText
                  colors={['#ffffff', '#00ff66', '#ffffff']}
                  animationSpeed={7}
                  variant="linear"
                >
                  The Grid
                </GradientText>
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm text-white/60 sm:text-lg">
              Book your favorite PS5 screen or race in our Logitech G923 SimDrive cockpit at Town Square, Thondiyil, Peravoor. Sessions start at ₹50 for 15 minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/book')}
                className="group h-12 cursor-pointer rounded-xl bg-white px-7 text-sm font-semibold text-black transition-colors hover:bg-white/90 sm:text-base"
              >
                <Ticket size={18} className="mr-2" />
                Book Your Screen
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/gta-vi')}
                className="h-12 cursor-pointer rounded-xl border-white/15 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/[0.06] sm:text-base"
              >
                <img
                  src="/img/gta-6-logo.png"
                  alt="GTA VI"
                  className="mr-2 h-5 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                GTA 6 Launch Special
              </Button>

              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/games')}
                className="h-12 cursor-pointer rounded-xl px-5 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white sm:text-base"
              >
                <Gamepad2 size={17} className="mr-2" />
                Browse Games
              </Button>
            </div>
          </div>

          {/* Spec cards with BorderGlow */}
          <motion.div
            variants={cardsContainer}
            initial="hidden"
            animate="show"
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {LOUNGE_SPECS.map(({ icon: Icon, value, label, sub }) => (
              <motion.div key={label} variants={cardItem} className="h-full">
                <BorderGlow
                  edgeSensitivity={30}
                  glowColor="40 80 80"
                  backgroundColor="#120F17"
                  borderRadius={28}
                  glowRadius={40}
                  glowIntensity={1}
                  coneSpread={25}
                  animated={false}
                  colors={['#c084fc', '#f472b6', '#38bdf8']}
                >
                  <div className="flex h-full flex-col p-6 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80">
                      <Icon size={20} />
                    </div>
                    <p className="font-display mt-6 text-3xl font-semibold tracking-tight">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/90">{label}</p>
                    <p className="mt-1 text-xs text-white/50">{sub}</p>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedContent>
      </div>
    </section>
  );
}
