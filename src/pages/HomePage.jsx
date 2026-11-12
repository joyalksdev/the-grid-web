import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import GtaSpotlightSection from '@/components/home/GtaSpotlightSection';
import LoungeZonesSection from '@/components/home/LoungeZonesSection';
import BookingFlowSection from '@/components/home/BookingFlowSection';
import GamesPage from './GamesPage';
import PricingMatrix from '@/pages/booking/PricingMatrix';
import LocationFaqSection from '@/components/home/LocationFaqSection';
import AnimatedContent from '@/components/AnimatedContent';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSelectMode = (mode, duration) => {
    navigate(`/book?mode=${mode}&duration=${duration}`);
  };

  return (
    <div className="bg-obsidian text-white">
      {/* 00 // Main Grid Lounge Hero */}
      <Hero />

      {/* 01 // GTA VI Launch Event Spotlight */}
      <AnimatedContent
        distance={32}
        direction="vertical"
        duration={0.85}
        ease="power3.out"
        blur={8}
        threshold={0.1}
      >
        <GtaSpotlightSection />
      </AnimatedContent>

      {/* 02 // Hardware & Zones Architecture */}
      <AnimatedContent
        distance={32}
        direction="vertical"
        duration={0.85}
        ease="power3.out"
        blur={8}
        threshold={0.1}
      >
        <LoungeZonesSection />
      </AnimatedContent>

      {/* 03 // Zero-Queue Reservation Protocol */}
      <AnimatedContent
        distance={32}
        direction="vertical"
        duration={0.85}
        ease="power3.out"
        blur={8}
        threshold={0.1}
      >
        <BookingFlowSection />
      </AnimatedContent>

      {/* 04 // Playable Game Library */}
      <AnimatedContent
        distance={32}
        direction="vertical"
        duration={0.85}
        ease="power3.out"
        blur={8}
        threshold={0.1}
      >
        <GamesPage embedded />
      </AnimatedContent>

      {/* 05 // Transparent Session Tariff Matrix */}
      <AnimatedContent
        distance={32}
        direction="vertical"
        duration={0.85}
        ease="power3.out"
        blur={8}
        threshold={0.1}
      >
        <PricingMatrix onSelectMode={handleSelectMode} />
      </AnimatedContent>

      {/* 06 // Venue Coordinates & FAQ Intel */}
      <AnimatedContent
        distance={32}
        direction="vertical"
        duration={0.85}
        ease="power3.out"
        blur={8}
        threshold={0.1}
      >
        <LocationFaqSection />
      </AnimatedContent>
    </div>
  );
}
