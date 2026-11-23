import React from 'react';
import { buildDodoCheckoutUrl } from '../../core/dodoService.js';

export default function PricingView({ user }) {
  return (
    <section>
      <h2>Tarifs Studio Pro</h2>
      <p>Gratuit : 0 $/mois (2 clips, 720p, 1 export/jour, watermark)</p>
      <p>Creator : 10 $/mois (illimité, 1080p, sans watermark, mode profond)</p>
      <a href={buildDodoCheckoutUrl(user, window.location.href)} target="_blank" rel="noreferrer">S'abonner à Creator (10 $/mois)</a>
    </section>
  );
}
