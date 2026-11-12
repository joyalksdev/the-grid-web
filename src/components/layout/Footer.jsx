import React from 'react';
import { Link } from 'react-router-dom';
import GradientText from '../GradientText';
import gridData from '@/data/gridData.json';

const Footer = () => {
  const { loungeInfo } = gridData;

  return (
    <footer className="border-t border-white/10 bg-obsidian text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
          {/* Col 1: Brand & Address */}
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/grid-logo.png"
                alt="The Grid"
                className="h-6 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-logo text-sm font-extrabold tracking-[0.14em]">
                <GradientText
                  colors={['#ffffff', '#00ff66', '#ffffff']}
                  animationSpeed={10}
                  variant="linear"
                >
                  THE GRID
                </GradientText>
              </span>
            </div>
            <p className="mt-2.5 max-w-xs text-xs leading-relaxed text-white/60">
              {loungeInfo.address.fullAddress}
            </p>
            <p className="mt-1 text-xs text-white/50">
              Open Daily: {loungeInfo.timings.open} – {loungeInfo.timings.close}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Quick Links
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/75">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <Link to="/gta-vi" className="hover:text-vice">
                GTA 6 Special
              </Link>
              <Link to="/games" className="hover:text-white">
                Screens &amp; Games
              </Link>
              <Link to="/book" className="hover:text-neon">
                Book Your Screen
              </Link>
              <Link to="/location" className="hover:text-white">
                Shop &amp; Location
              </Link>
            </div>
          </div>

          {/* Col 3: Contact */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Contact Us
              </p>
              <div className="mt-2.5 space-y-1 text-xs text-white/75">
                <p>
                  Call:{' '}
                  <a
                    href={`tel:${loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                    className="font-semibold text-white hover:text-neon"
                  >
                    {loungeInfo.contact.primaryPhone}
                  </a>
                </p>
                <p>
                  WhatsApp:{' '}
                  <a
                    href={loungeInfo.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-neon hover:underline"
                  >
                    {loungeInfo.contact.whatsappNumber}
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/40">
              © {new Date().getFullYear()} The Grid Gaming Lounge, Peravoor, Kannur.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
