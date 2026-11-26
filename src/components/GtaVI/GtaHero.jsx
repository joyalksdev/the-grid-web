import React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Tv, Clock, Gamepad2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { y: 16, opacity: 0, filter: 'blur(6px)' },
  show: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const perks = [
  { icon: Clock, label: '30 Mins (₹150) or 1 Hour (₹250)' },
  { icon: Tv, label: '55" & 43" TCL 4K TVs' },
  { icon: Ticket, label: 'Instant Booking Confirmation' },
];

export default function HeroSingle({ onBookClick }) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const charX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const charY = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const palmX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const logoX = useTransform(sx, [-0.5, 0.5], [6, -6]);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleCTA = () =>
    onBookClick ? onBookClick() : navigate('/book');
  const hide = (e) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <section
      id="gta-vi"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate w-full overflow-hidden bg-obsidian pt-28 pb-12 text-white"
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          {/* LEFT: copy */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left"
          >
            <motion.div variants={item}>
              <Badge
                variant="outline"
                className="gap-2 rounded-full border-vice/40 bg-vice/10 px-3.5 py-1 text-xs font-semibold text-pink-200"
              >
                Now Available on PS5 · Peravoor, Kannur
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Play Grand Theft Auto VI at The Grid
            </motion.h1>

            <motion.p
              variants={item}
              className="mx-auto mt-4 max-w-lg text-sm text-white/60 sm:text-base lg:mx-0"
            >
              Grand Theft Auto VI is ready to play on our 55" and 43" 4K TCL screens (Screen 1 &amp; Screen 2). Book a 30-minute session for ₹150 or a full 1-hour session for ₹250.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handleCTA}
                className="group h-11 cursor-pointer rounded-xl bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                <Ticket size={16} className="mr-2" />
                Book GTA 6 Now
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/games')}
                className="h-11 cursor-pointer rounded-xl border-white/15 bg-transparent px-5 text-sm font-medium text-white hover:bg-white/[0.06]"
              >
                <Gamepad2 size={16} className="mr-2 text-cyber" />
                View All Screens &amp; Games
              </Button>
            </motion.div>

            <motion.ul
              variants={item}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50 lg:justify-start"
            >
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5">
                  <Icon size={14} className="text-white/70" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* RIGHT: depth stack */}
          <div className="relative h-[340px] sm:h-[460px] lg:h-[540px]">
            <motion.img
              src="/img/palms-1.png"
              alt=""
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 0.7 }}
              transition={{ duration: 0.8 }}
              style={{ x: palmX }}
              className="pointer-events-none absolute bottom-0 left-0 hidden h-[80%] w-auto object-contain md:block"
              onError={hide}
            />
            <motion.img
              src="/img/palms-2.png"
              alt=""
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 0.7 }}
              transition={{ duration: 0.8 }}
              style={{ x: palmX }}
              className="pointer-events-none absolute bottom-0 right-0 hidden h-[80%] w-auto object-contain md:block"
              onError={hide}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{ x: logoX }}
              aria-hidden
              className="absolute inset-0 flex items-start justify-center pt-2"
            >
              <img
                src="/img/gta-6-logo.png"
                alt="GTA VI logo"
                className="max-h-[200px] w-auto opacity-90 sm:max-h-[260px]"
                onError={hide}
              />
            </motion.div>

            <motion.div
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15,
              }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-full items-end justify-center"
            >
              <motion.img
                src="/img/jasonandlucia.png"
                alt="Jason and Lucia"
                draggable={false}
                style={{ x: charX, y: charY }}
                className="max-h-[300px] w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] sm:max-h-[440px] lg:max-h-[520px]"
                onError={hide}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
