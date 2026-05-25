// Scr185 / Scr186 / Scr187 — long-form transit essays

import { notFound } from 'next/navigation';
import { ESSAYS } from './transitData';
import { TransitEssayView } from './TransitEssayView';

export default async function TransitEssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = ESSAYS[slug];
  if (!essay) notFound();
  return <TransitEssayView essay={essay} />;
}
