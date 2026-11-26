import React from 'react';
import { Helmet } from 'react-helmet-async';
import PricingMatrix from './booking/PricingMatrix';

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing &amp; Session Rates - The Grid</title>
        <meta
          name="description"
          content="Check PS5 and SimDrive session rates at The Grid Gaming Lounge, Peravoor. Single (1P) from ₹50, Dual (2P), Triple (3P), Big (4P), Logitech G923 SimDrive from ₹90, and GTA 6 Launch Special."
        />
        <link rel="canonical" href="https://thegridgaming.fun/pricing" />
      </Helmet>
      <PricingMatrix isFullPage />
    </>
  );
}
