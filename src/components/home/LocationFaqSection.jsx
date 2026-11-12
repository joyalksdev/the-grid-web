import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Ticket,
  Plus,
  Minus,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpotlightCard from '@/components/SpotlightCard';
import gridData from '@/data/gridData.json';

const FAQS = [
  {
    q: 'Can I switch screens after booking?',
    a: 'No — because each screen has its own TV size and installed games, bookings are fixed to the screen you choose (Screen 1, Screen 2, or Screen 3). Always check the installed games list on your screen before confirming.',
  },
  {
    q: 'What do Single, Dual, Triple, and Big mean?',
    a: 'They represent how many players are playing together: Single (1 Player), Dual (2 Players), Triple (3 Players), and Big (4 Players).',
  },
  {
    q: 'Can we play regular controller games on Screen 3?',
    a: 'Yes! Screen 3 features our Logitech G923 + TRONE RS1 SimDrive racing cockpit, AND it can also be booked for standard controller gaming (GTA V, Spider-Man 2, FC 26, Ghost of Tsushima, WWE 2K24, and more).',
  },
  {
    q: 'Can I extend my playtime if the screen is free?',
    a: 'Yes, if the next slot on your screen is open, you can extend your session at discounted extension rates (for example, extending 1 hour on Single is ₹130 instead of ₹160).',
  },
];

export default function LocationFaqSection() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);
  const { loungeInfo } = gridData;

  return (
    <section className="relative border-t border-white/10 bg-obsidian py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neon">
              Visit The Lounge
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Location, Timings &amp; FAQs
            </h2>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/location')}
            className="h-10 cursor-pointer self-start rounded-lg border-white/15 bg-transparent px-4 text-xs font-medium text-white hover:bg-white/[0.06] md:self-auto"
          >
            View Shop Details
            <ArrowUpRight size={14} className="ml-1.5" />
          </Button>
        </div>

        {/* 12-Col Split: Left 5 Cols Venue Card, Right 7 Cols FAQ Accordion */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-12">
          {/* Left 5 Cols: Venue Specs */}
          <SpotlightCard
            spotlightColor="rgba(0, 255, 102, 0.1)"
            className="p-7 sm:p-9 lg:col-span-5"
          >
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-semibold text-white/60">
                    {loungeInfo.address.area}, {loungeInfo.address.district}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neon">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                    Open Every Day
                  </span>
                </div>

                <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight text-white">
                  {loungeInfo.name} {loungeInfo.subtitle}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                  {loungeInfo.address.fullAddress}
                </p>

                <div className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0c0e14]">
                  <div className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="flex items-center gap-2 text-white/55">
                      <Clock size={14} className="text-neon" /> Mon – Sun
                    </span>
                    <span className="font-semibold text-white">
                      {loungeInfo.timings.open} – {loungeInfo.timings.close}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="flex items-center gap-2 text-white/55">
                      <Phone size={14} className="text-cyber" /> Call
                    </span>
                    <a
                      href={`tel:${loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                      className="font-semibold text-white hover:text-neon"
                    >
                      {loungeInfo.contact.primaryPhone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="flex items-center gap-2 text-white/55">
                      <MessageCircle size={14} className="text-neon" /> WhatsApp
                    </span>
                    <a
                      href={loungeInfo.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neon hover:underline"
                    >
                      {loungeInfo.contact.whatsappNumber}
                    </a>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="flex items-center gap-2 text-white/55">
                      <MapPin size={14} className="text-vice" /> Lounge Gear
                    </span>
                    <span className="text-white/85">
                      AC · 7 Controllers · Sofas &amp; Bean Bags
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/book')}
                className="h-11 w-full cursor-pointer rounded-xl bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
              >
                <Ticket size={15} className="mr-2" />
                Book Your Screen
              </Button>
            </div>
          </SpotlightCard>

          {/* Right 7 Cols: FAQ List */}
          <div className="divide-y divide-white/10 bg-obsidian lg:col-span-7">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="p-6 sm:p-7">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                  >
                    <span className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                      {item.q}
                    </span>
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="mt-3 text-xs leading-relaxed text-white/60 sm:text-sm">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
