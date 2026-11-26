import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Gamepad2,
  Clock,
  AlertTriangle,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Ban,
  CheckCircle2,
  Tv,
  CreditCard,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import gridData from '@/data/gridData.json';

const SECTIONS = [
  { id: 'terms', label: 'Terms of Service', count: '10 Rules' },
  { id: 'guidelines', label: 'Lounge Etiquette', count: 'House Standards' },
  { id: 'gta6', label: 'GTA 6 Session Rules', count: '18+ Only' },
];

const TERMS_LIST = [
  {
    id: '01',
    title: 'Keep the Premises Clean',
    category: 'Lounge Care',
    description:
      'Please keep the gaming area clean and dispose of snack wrappers, bottles, and waste in the designated bins.',
  },
  {
    id: '02',
    title: 'No Feet on Walls or Furniture',
    category: 'Lounge Care',
    description:
      'Placing your feet or shoes on the walls, sofas, bean bags, or gaming stations is strictly prohibited.',
  },
  {
    id: '03',
    title: 'Protect Gaming Equipment',
    category: 'Hardware',
    description:
      'Handle all PS5 consoles, DualSense controllers, 4K TVs, and the Logitech G923 racing simulator with care. Customers may be held responsible for repair or replacement costs for damage caused by misuse or negligence.',
  },
  {
    id: '04',
    title: 'No Controller Sharing',
    category: 'Booking Policy',
    highlight: true,
    description:
      'Controller sharing or passing controllers between multiple people is not permitted during a single-player session. Your booking tier (Single, Dual, Triple, or Big) must match the exact number of active players.',
  },
  {
    id: '05',
    title: 'Fixed Screen & Booking Time',
    category: 'Booking Policy',
    description:
      'Your session begins and ends at the booked time on your selected screen (Screen 1, Screen 2, or Screen 3). Screen switching is not available once booked, and extensions depend on next-slot availability.',
  },
  {
    id: '06',
    title: 'No Rough Handling',
    category: 'Hardware',
    description:
      'Throwing controllers, slamming the racing wheel or pedals, hitting equipment, or engaging in any behaviour that may damage lounge property is strictly prohibited.',
  },
  {
    id: '07',
    title: 'Follow Staff Instructions',
    category: 'Conduct',
    description:
      'Customers must follow staff instructions at all times and maintain respectful behaviour towards fellow gamers and staff.',
  },
  {
    id: '08',
    title: 'Personal Belongings',
    category: 'Liability',
    description:
      'Customers are responsible for their own phones, wallets, helmets, and personal belongings. The Grid Gaming Lounge is not liable for items left unattended.',
  },
  {
    id: '09',
    title: 'Payment & Confirmation Policy',
    category: 'Payments',
    description:
      'Bookings and extensions are confirmed according to our published session tariff matrix. Online slot holds expire after 15 minutes if payment confirmation is not completed.',
  },
  {
    id: '10',
    title: 'Right to Refuse Service',
    category: 'Conduct',
    description:
      'The Grid Gaming Lounge reserves the right to refuse or discontinue service without refund for serious misconduct, equipment abuse, or repeated violations of these terms.',
  },
];

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const { loungeInfo } = gridData;
  const [activeTab, setActiveTab] = useState('terms');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && SECTIONS.some((s) => s.id === hash)) {
        setActiveTab(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="min-h-screen bg-obsidian pt-28 sm:pt-32 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====================================================================
            TOP HEADER (Minimal SaaS Pattern matching LocationPage & GamesPage)
           ==================================================================== */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neon">
                {loungeInfo.name} {loungeInfo.subtitle}
              </p>

              <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Terms &amp; Lounge Rules
              </h1>

              <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-white/60 sm:text-sm">
                Clear, straightforward guidelines to keep our PS5 consoles, 4K screens, and lounge seating in top condition for every player at Town Square, Peravoor.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/book')}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-neon px-4 text-xs font-extrabold text-obsidian transition-colors hover:bg-neon/90"
              >
                <span>Book a Slot</span>
                <ArrowRight size={14} />
              </button>

              <a
                href={loungeInfo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 text-xs font-semibold text-white transition-colors hover:bg-white/[0.08]"
              >
                <MessageCircle size={14} className="text-neon" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Key Highlights Strip */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1017] px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neon/25 bg-neon/10 text-neon">
                <Gamepad2 size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">No Controller Sharing</p>
                <p className="truncate text-[11px] text-white/50">
                  1 controller per Single player booking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1017] px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyber/25 bg-cyber/10 text-cyber">
                <Tv size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">Fixed Screen Booking</p>
                <p className="truncate text-[11px] text-white/50">
                  Check installed games before choosing Screen 1–3
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1017] px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-vice/30 bg-vice/10 text-vice">
                <UserCheck size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">GTA 6 is Strictly 18+</p>
                <p className="truncate text-[11px] text-white/50">
                  Family-friendly lounge conduct required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            MAIN 12-COLUMN SAAS DOCUMENTATION LAYOUT
           ==================================================================== */}
        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT 3 COLS: Minimal Sticky Sidebar + Venue Card */}
          <aside className="space-y-4 lg:col-span-3 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-2">
              <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                On This Page
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-white text-obsidian'
                          : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <span>{sec.label}</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] ${
                          isActive
                            ? 'bg-obsidian/10 text-obsidian font-bold'
                            : 'bg-white/[0.04] text-white/45'
                        }`}
                      >
                        {sec.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Real Shop Support Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[11px] font-semibold text-white/60">
                  Lounge Support
                </span>
                <span className="text-[11px] font-medium text-white/60">
                  10 AM – 10 PM
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-semibold text-white">
                  {loungeInfo.name} {loungeInfo.subtitle}
                </p>
                <p className="text-[11px] leading-relaxed text-white/55">
                  {loungeInfo.address.fullAddress}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/10 pt-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Call</span>
                  <a
                    href={`tel:${loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                    className="font-semibold text-white hover:text-neon"
                  >
                    {loungeInfo.contact.primaryPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50">WhatsApp</span>
                  <a
                    href={loungeInfo.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-neon hover:underline"
                  >
                    {loungeInfo.contact.whatsappNumber}
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT 9 COLS: Clean SaaS Content Sections */}
          <div className="space-y-12 lg:col-span-9">
            {/* 1. TERMS OF SERVICE (10 RULES) */}
            <div id="terms" className="scroll-mt-28">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neon">
                    Section 01
                  </span>
                  <h2 className="font-display mt-0.5 text-xl font-bold text-white sm:text-2xl">
                    Terms of Service
                  </h2>
                </div>
                <span className="rounded-lg border border-white/10 bg-[#0d1017] px-2.5 py-1 font-mono text-xs text-white/60">
                  10 Articles
                </span>
              </div>

              <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]">
                {TERMS_LIST.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 p-5 transition-colors sm:flex-row sm:items-start sm:gap-5 sm:p-6 ${
                      item.highlight
                        ? 'bg-neon/[0.03]'
                        : 'hover:bg-white/[0.015]'
                    }`}
                  >
                    <div className="flex items-center justify-between sm:block">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold ${
                          item.highlight
                            ? 'border-neon/40 bg-neon/15 text-neon'
                            : 'border-white/10 bg-obsidian text-white/70'
                        }`}
                      >
                        {item.id}
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/55 sm:hidden">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-base font-semibold text-white">
                          {item.title}
                        </h3>
                        <span className="hidden rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/55 sm:inline-block">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/65 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. LOUNGE GUIDELINES & ETIQUETTE */}
            <div id="guidelines" className="scroll-mt-28">
              <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber">
                  Section 02
                </span>
                <h2 className="font-display mt-0.5 text-xl font-bold text-white sm:text-2xl">
                  Lounge Etiquette &amp; Care
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <span className="text-xs font-semibold text-white/60">
                      Furniture &amp; Walls
                    </span>
                    <Ban size={16} className="text-cyber" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-white">
                    Keep Feet Off Walls &amp; Stations
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                    We maintain a clean, air-conditioned lounge with 2 plush sofas and 4 gaming bean bags. Please do not rest shoes or feet against painted walls, TV stands, or the racing cockpit.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                    <span className="text-xs font-semibold text-white/60">
                      Cleanliness
                    </span>
                    <CheckCircle2 size={16} className="text-neon" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-white">
                    Dispose of Wrappers &amp; Bottles
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                    Use the waste bins provided inside the lounge for any drink bottles, snack wrappers, or tissues so the next player gets a spotless station.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. GAME RULES (GTA 6 SPECIAL) */}
            <div id="gta6" className="scroll-mt-28">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-vice">
                    Section 03
                  </span>
                  <h2 className="font-display mt-0.5 text-xl font-bold text-white sm:text-2xl">
                    GTA 6 Launch &amp; Session Rules
                  </h2>
                </div>
                <span className="rounded-full border border-vice/40 bg-vice/15 px-3 py-1 text-[11px] font-bold text-pink-200">
                  Screen 1 &amp; Screen 2 · 30m / 60m Slots
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017]">
                <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-y-0 md:divide-x">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-vice/30 bg-vice/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-vice">
                        Age Policy
                      </span>
                      <UserCheck size={16} className="text-vice" />
                    </div>
                    <h3 className="font-display mt-3.5 text-base font-semibold text-white">
                      Strictly 18+ Only
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/65">
                      Grand Theft Auto VI is an adult-rated title. Minors are not permitted to play or spectate GTA 6 sessions under any circumstances. ID verification may be requested before starting.
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-cyber/30 bg-cyber/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyber">
                        Content Rule
                      </span>
                      <ShieldCheck size={16} className="text-cyber" />
                    </div>
                    <h3 className="font-display mt-3.5 text-base font-semibold text-white">
                      Public Lounge Conduct
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/65">
                      Because our lounge hosts families and younger gamers on adjacent screens, players are strictly prohibited from visiting in-game strip clubs or engaging with nudity or explicit sexual content.
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-neon/30 bg-neon/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon">
                        Single Player
                      </span>
                      <Gamepad2 size={16} className="text-neon" />
                    </div>
                    <h3 className="font-display mt-3.5 text-base font-semibold text-white">
                      1 Player Per Booking
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/65">
                      Controller sharing or taking turns between multiple people on a single GTA 6 slot is not allowed. Each player must book their own dedicated session.
                    </p>
                  </div>
                </div>

                {/* Clear Zero-Tolerance Notice */}
                <div className="flex flex-col justify-between gap-4 border-t border-amber-500/25 bg-amber-500/[0.06] px-6 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-400"
                    />
                    <div>
                      <p className="text-xs font-bold text-amber-200">
                        Zero-Tolerance Policy &amp; Non-Refundable Termination
                      </p>
                      <p className="mt-0.5 text-xs text-amber-200/75">
                        Violating the 18+ requirement, explicit content ban, or controller-sharing rule will result in immediate session termination without refund.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/book"
                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-2 text-xs font-bold text-amber-200 transition-colors hover:bg-amber-400/20 sm:self-auto"
                  >
                    <span>Book GTA 6</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
