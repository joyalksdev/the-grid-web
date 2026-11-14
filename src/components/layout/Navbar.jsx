import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Library,
  MapPin,
  LogIn,
  Ticket,
  ArrowRight,
  Menu,
  Clock,
  ChevronRight,
  Flame,
  User,
  LogOut,
  QrCode,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const TARGET_DATE = new Date('2026-11-15T23:59:59').getTime();

export default function Navbar({ user, onLoginClick, onLogout }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: '04',
    hours: '05',
    mins: '14',
    secs: '00',
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, TARGET_DATE - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0'),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const goToBooking = () => {
    setMobileOpen(false);
    navigate('/book');
  };

  const navPillClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
      isActive
        ? 'bg-white/15 text-white shadow-sm'
        : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col select-none">
      {/* 1. TOP CLICKABLE COUNTDOWN BANNER */}
      <div
        onClick={() => navigate('/book?mode=GTA6_Launch&duration=60')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === 'Enter' && navigate('/book?mode=GTA6_Launch&duration=60')
        }
        className="group relative flex h-9 sm:h-10 w-full cursor-pointer items-center justify-center border-b border-white/[0.08] bg-gradient-to-r from-obsidian via-[#191129] to-obsidian px-2.5 sm:px-4 transition-colors hover:via-[#221638]"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between sm:justify-center gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <Badge
              variant="outline"
              className="hidden md:inline-flex border-vice/40 bg-vice/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-vice uppercase"
            >
              <Flame size={11} className="mr-1" /> Launch Special
            </Badge>

            <div className="flex items-center gap-1.5 sm:gap-2 text-white/90">
              <Clock size={13} className="text-neon shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-tight whitespace-nowrap">
                <span className="sm:hidden">GTA 6:</span>
                <span className="hidden sm:inline">GTA 6 Launch Countdown:</span>
              </span>

              <div className="flex items-center gap-0.5 sm:gap-1 font-mono text-[11px] sm:text-xs font-bold text-neon tabular-nums">
                <span className="rounded bg-white/[0.06] px-1 sm:px-1.5 py-0.5 border border-white/10">
                  {timeLeft.days}d
                </span>
                <span className="text-white/40">:</span>
                <span className="rounded bg-white/[0.06] px-1 sm:px-1.5 py-0.5 border border-white/10">
                  {timeLeft.hours}h
                </span>
                <span className="text-white/40">:</span>
                <span className="rounded bg-white/[0.06] px-1 sm:px-1.5 py-0.5 border border-white/10">
                  {timeLeft.mins}m
                </span>
                <span className="text-white/40">:</span>
                <span className="rounded bg-white/[0.06] px-1 sm:px-1.5 py-0.5 border border-white/10">
                  {timeLeft.secs}s
                </span>
              </div>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neon/15 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-neon border border-neon/30 transition-all group-hover:translate-x-0.5 group-hover:bg-neon group-hover:text-obsidian">
            <span>Book GTA 6</span>
            <ArrowRight size={11} />
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="border-b border-white/[0.08] bg-obsidian/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
          {/* LEFT: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group justify-start shrink-0">
            <img
              src="/grid-logo.png"
              className="w-auto h-7 sm:h-8 object-contain transition-transform duration-200 mb-1 group-hover:scale-105"
              alt="The Grid Logo"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-logo text-sm sm:text-base font-extrabold tracking-[0.14em] text-white leading-none">
                THE GRID
              </span>
              <span className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-white/45 uppercase">
                Gaming Lounge
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur-md">
            <NavLink to="/games" className={navPillClass}>
              <Library size={14} className="text-cyber" />
              <span>Screens &amp; Games</span>
            </NavLink>

            <NavLink to="/location" className={navPillClass}>
              <MapPin size={14} className="text-neon" />
              <span>Shop &amp; Location</span>
            </NavLink>

            <NavLink
              to="/gta-vi"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vice/20 via-sunset/15 to-vice/20 border border-vice/40 px-4 py-1.5 text-xs font-bold text-white transition-all hover:border-vice/70"
            >
              <img
                src="/img/gta-6-logo.png"
                alt="GTA VI"
                className="h-3.5 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="bg-gradient-to-r from-white via-pink-200 to-vice bg-clip-text text-transparent">
                GTA 6 Special
              </span>
            </NavLink>
          </div>

          {/* RIGHT: Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.08] cursor-pointer">
                    <Avatar className="h-6 w-6 border border-neon/40">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-neon/15 text-[10px] font-bold text-neon">
                        {user.name?.slice(0, 2).toUpperCase() || 'GG'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.phone.slice(-4)}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 border-white/10 bg-obsidian text-white"
                >
                  <DropdownMenuLabel className="text-xs text-white/60">
                    <span className="block font-semibold text-white">
                      {user.name || 'Grid Player'}
                    </span>
                    <span className="text-[11px] text-white/50">
                      {user.phone}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer text-xs focus:bg-white/10 focus:text-white"
                  >
                    <User size={14} className="mr-2 text-neon" />
                    Profile &amp; My Passes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/book')}
                    className="cursor-pointer text-xs focus:bg-white/10 focus:text-white"
                  >
                    <QrCode size={14} className="mr-2 text-cyber" />
                    Book a Screen
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
                className="h-9 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-white/85 hover:bg-white/[0.08] hover:text-white cursor-pointer"
              >
                <LogIn size={14} className="mr-1.5 text-white/60" />
                Sign In
              </Button>
            )}

            <Button
              size="sm"
              onClick={goToBooking}
              className="h-9 rounded-lg bg-white px-4 text-xs font-semibold text-obsidian transition-colors hover:bg-white/90 cursor-pointer"
            >
              <Ticket size={14} className="mr-1.5" />
              Book Your Screen
            </Button>
          </div>

          {/* MOBILE RIGHT CONTROLS */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              size="sm"
              onClick={goToBooking}
              className="h-8 rounded-lg bg-white px-3 text-[11px] font-semibold text-obsidian active:scale-95"
            >
              <Ticket size={13} className="mr-1" />
              Book Now
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/10 active:scale-95"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex h-full w-[88vw] max-w-[340px] flex-col justify-between border-l border-white/10 bg-obsidian/95 backdrop-blur-2xl text-white p-5"
              >
                <div className="flex flex-col">
                  <SheetHeader className="text-left border-b border-white/[0.08] pb-4">
                    <SheetTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/grid-logo.png"
                          alt="The Grid"
                          className="h-7 w-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="font-logo text-sm font-extrabold tracking-[0.14em] text-white leading-none">
                            THE GRID
                          </p>
                          <p className="mt-1 text-[9px] font-semibold text-white/45 uppercase tracking-[0.2em]">
                            Peravoor, Kannur
                          </p>
                        </div>
                      </div>

                      <Badge className="border-neon/30 bg-neon/10 text-[10px] font-semibold text-neon mr-6">
                        10 AM – 10 PM
                      </Badge>
                    </SheetTitle>
                  </SheetHeader>

                  {/* GTA 6 Launch Card inside Mobile Drawer */}
                  <div
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/gta-vi');
                    }}
                    role="button"
                    tabIndex={0}
                    className="group relative mt-5 cursor-pointer overflow-hidden rounded-2xl border border-vice/40 bg-gradient-to-br from-vice/20 via-[#1a1025] to-obsidian p-4 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge className="bg-vice/20 border-vice/40 text-[10px] font-bold uppercase tracking-wider text-pink-200">
                          First 7 Days Exclusive
                        </Badge>
                        <p className="mt-2 font-display text-base font-extrabold text-white">
                          GTA 6 Launch Special
                        </p>
                        <p className="mt-0.5 text-xs text-white/65">
                          30 Mins: ₹150 · 1 Hour: ₹250
                        </p>
                      </div>
                      <img
                        src="/img/gta-6-logo.png"
                        alt="GTA VI"
                        className="h-10 w-auto object-contain shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] font-mono text-neon">
                      <span>
                        {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.mins}m
                      </span>
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-white group-hover:translate-x-0.5 transition-transform">
                        View Special <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>

                  {/* Mobile Nav Link Cards */}
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/games"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 transition-all hover:border-cyber/40 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber/10 border border-cyber/25 text-cyber">
                          <Library size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            Screens &amp; Games
                          </p>
                          <p className="text-[11px] text-white/50">
                            Screen 1, Screen 2 &amp; Screen 3 games
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-white/30 group-hover:text-white"
                      />
                    </Link>

                    <Link
                      to="/location"
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 transition-all hover:border-neon/40 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 border border-neon/25 text-neon">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            Shop &amp; Location
                          </p>
                          <p className="text-[11px] text-white/50">
                            Town Square, Thondiyil, Peravoor
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-white/30 group-hover:text-white"
                      />
                    </Link>
                  </div>
                </div>

                {/* Pinned CTA Footer */}
                <div className="mt-auto border-t border-white/[0.08] pt-4">
                  <div className="mb-3 flex items-center justify-between text-[11px] text-white/60 px-1">
                    <a
                      href={`tel:${gridData.loungeInfo.contact.primaryPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 hover:text-white"
                    >
                      <Phone size={12} className="text-neon" />
                      {gridData.loungeInfo.contact.primaryPhone}
                    </a>
                    <span>10:00 AM – 10:00 PM</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
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
                      className="h-11 rounded-xl border-white/15 bg-white/[0.03] text-xs font-bold text-white hover:bg-white/10"
                    >
                      <User size={15} className="mr-1.5 text-neon" />
                      {user ? 'My Profile' : 'Sign In'}
                    </Button>

                    <Button
                      onClick={goToBooking}
                      className="h-11 rounded-lg bg-white text-xs font-semibold text-obsidian hover:bg-white/90"
                    >
                      <Ticket size={15} className="mr-1.5" />
                      Book Screen
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
