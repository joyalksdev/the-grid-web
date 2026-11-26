import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Hero from '@/components/home/Hero';
import GtaSpotlightSection from '@/components/home/GtaSpotlightSection';
import LoungeZonesSection from '@/components/home/LoungeZonesSection';
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
      <Helmet>
        <title>The Grid - Gaming Lounge in Kannur | PS5, GTA 6 &amp; SimDrive in Peravoor</title>
        <meta
          name="description"
          content="Book your PS5 and SimDrive session at The Grid Gaming Lounge in Thondiyil, Peravoor, Kannur. Fully AC lounge, 55&quot; &amp; 43&quot; 4K TVs, Logitech G923 Racing Simulator, and exclusive GTA 6 Launch Specials. Open 10 AM to 10 PM."
        />
        <link rel="canonical" href="https://thegridgaming.fun/" />
      </Helmet>

      {/* 1. Main Grid Lounge Hero */}
      <Hero />

      {/* 2. GTA VI Available Now Spotlight */}
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

      {/* 3. Our 3 Gaming Screens & Hardware */}
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

      {/* 4. Installed Game Library */}
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

      {/* 5. Lounge Session & Extension Pricing (Live from Pricing Service) */}
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

      {/* 6. Location, Timings & FAQs */}
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
