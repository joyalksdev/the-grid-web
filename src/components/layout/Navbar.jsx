import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Library,
  MapPin,
  LogIn,
  ArrowRight,
  Menu,
  ChevronRight,
  User,
  LogOut,
  QrCode,
  Phone,
  Gamepad2,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import gridData from '@/data/gridData.json';

export default function Navbar({ user, onLoginClick, onLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const goToBooking = () => {
    setMobileOpen(false);
    navigate('/book');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
      isActive
        ? 'bg-white text-obsidian'
        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col select-none">
      {/* 1. TOP BANNER: GTA 6 AVAILABLE NOW */}
      <div
        onClick={() => navigate('/book')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/book')}
        className="group flex h-9 w-full cursor-pointer items-center justify-center border-b border-white/10 bg-[#0d1017] px-3 sm:px-6 transition-colors hover:bg-[#121620]"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between sm:justify-center gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="rounded border border-neon/30 bg-neon/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon">
              GTA VI
            </span>
            <span className="truncate text-[11px] sm:text-xs font-semibold text-white">
              Available Now on PS5 at The Grid
            </span>
            <span className="hidden md:inline text-white/35">·</span>
            <span className="hidden md:inline text-xs text-white/60">
              30 Mins: ₹150 · 1 Hour: ₹250
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-neon group-hover:underline">
            <span>Book Now</span>
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="border-b border-white/10 bg-obsidian/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
          {/* LEFT: Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group justify-start shrink-0"
          >
            <img
              src="/grid-logo.png"
              className="w-auto h-7 mb-1 sm:h-8 object-contain transition-transform duration-200 group-hover:scale-105"
              alt="The Grid Logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-logo text-sm sm:text-base font-extrabold tracking-[0.14em] text-white leading-none">
                THE GRID
              </span>
              <span className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
                Gaming Lounge
              </span>
            </div>
          </Link>

          {/* CENTER: Clean SaaS Navigation Links */}
          <div className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-[#0d1017] p-1">
            <NavLink to="/games" className={navLinkClass}>
              <Library size={14} />
              <span>Screens &amp; Games</span>
            </NavLink>

            <NavLink to="/pricing" className={navLinkClass}>
              <IndianRupee size={14} />
              <span>Pricing</span>
            </NavLink>

            <NavLink to="/location" className={navLinkClass}>
              <MapPin size={14} />
              <span>Shop &amp; Location</span>
            </NavLink>

            <NavLink to="/gta-vi" className={navLinkClass}>
              <Gamepad2 size={14} />
              <span>GTA 6</span>
            </NavLink>
          </div>

          {/* RIGHT: Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1017] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.06] cursor-pointer">
                    <Avatar className="h-6 w-6 border border-white/15">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-white/10 text-[10px] font-bold text-white">
                        {user.name?.slice(0, 2).toUpperCase() || 'GP'}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {user.name ||
                        user.email?.split('@')[0] ||
                        (user.phone ? user.phone.slice(-4) : 'Player')}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-xl border-white/10 bg-[#0d1017] text-white"
                >
                  <DropdownMenuLabel className="text-xs text-white/60">
                    <span className="block font-semibold text-white">
                      {user.name || 'Grid Player'}
                    </span>
                    <span className="text-[11px] text-white/50">
                      {user.email || user.phone}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer text-xs focus:bg-white/10 focus:text-white"
                  >
                    <User size={14} className="mr-2 text-white/70" />
                    Profile &amp; My Passes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/book')}
                    className="cursor-pointer text-xs focus:bg-white/10 focus:text-white"
                  >
                    <QrCode size={14} className="mr-2 text-white/70" />
                    Book a Slot
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-xs text-vice focus:bg-vice/10 focus:text-vice"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="h-9 rounded-xl border border-white/10 bg-[#0d1017] px-3.5 text-xs font-semibold text-white/85 hover:bg-white/[0.06] hover:text-white cursor-pointer"
              >
                <LogIn size={14} className="mr-1.5 text-white/60" />
                Sign In
              </Button>
            )}

            <Button
              size="sm"
              onClick={goToBooking}
              className="h-9 rounded-xl bg-neon px-4 text-xs font-extrabold text-obsidian transition-colors hover:bg-neon/90 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight size={13} className="ml-1.5" />
            </Button>
          </div>

          {/* MOBILE RIGHT CONTROLS */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              size="sm"
              onClick={goToBooking}
              className="h-8 rounded-lg bg-neon px-3 text-[11px] font-extrabold text-obsidian active:scale-95 cursor-pointer"
            >
              Book Now
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-9 w-9 rounded-xl border border-white/10 bg-[#0d1017] text-white hover:bg-white/10 active:scale-95"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex h-full w-[86vw] max-w-[320px] flex-col justify-between border-l border-white/10 bg-obsidian text-white p-5"
              >
                <div className="flex flex-col">
                  <SheetHeader className="text-left border-b border-white/10 pb-4">
                    <SheetTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/grid-logo.png"
                          alt="The Grid"
                          className="h-6 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="font-logo text-sm font-extrabold tracking-[0.14em] text-white leading-none">
                            THE GRID
                          </p>
                          <p className="mt-1 text-[9px] font-semibold text-white/45 uppercase tracking-[0.18em]">
                            Peravoor, Kannur
                          </p>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Clean Mobile Nav List */}
                  <div className="mt-4 flex flex-col gap-1.5">
                    {[
                      {
                        to: '/games',
                        label: 'Screens & Games',
                        sub: 'Screen 1, Screen 2 & Screen 3 catalog',
                        icon: Library,
                      },
                      {
                        to: '/pricing',
                        label: 'Pricing & Rates',
                        sub: 'Session & extension rate card',
                        icon: IndianRupee,
                      },
                      {
                        to: '/gta-vi',
                        label: 'GTA 6 on PS5',
                        sub: 'Available now · Book 30m or 60m',
                        icon: Gamepad2,
                      },
                      {
                        to: '/location',
                        label: 'Shop & Location',
                        sub: 'Town Square, Thondiyil, Peravoor',
                        icon: MapPin,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#0d1017] p-3 transition-colors hover:border-white/25"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-obsidian text-white/80">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white">
                                {item.label}
                              </p>
                              <p className="truncate text-[11px] text-white/50">
                                {item.sub}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={15}
                            className="shrink-0 text-white/30 group-hover:text-white"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Pinned CTA Footer */}
                <div className="mt-auto border-t border-white/10 pt-4">
                  <div className="mb-3 flex items-center justify-between text-[11px] text-white/55 px-1">
                    <a
                      href={`tel:${gridData.loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 hover:text-white"
                    >
                      <Phone size={12} className="text-neon" />
                      {gridData.loungeInfo.contact.primaryPhone}
                    </a>
                    <span>10:00 AM – 10:00 PM</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileOpen(false);
                        if (user) {
                          navigate('/profile');
                        } else {
                          onLoginClick?.();
                        }
                      }}
                      className="h-10 rounded-xl border-white/15 bg-[#0d1017] text-xs font-semibold text-white hover:bg-white/10"
                    >
                      <User size={14} className="mr-1.5 text-white/70" />
                      {user ? 'My Profile' : 'Sign In'}
                    </Button>

                    <Button
                      onClick={goToBooking}
                      className="h-10 rounded-xl bg-neon text-xs font-extrabold text-obsidian hover:bg-neon/90"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
