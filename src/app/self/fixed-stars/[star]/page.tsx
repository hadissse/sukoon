// Scr182 — Fixed-star detail (ad-Dabaran)

import { FixedStarDetail } from './FixedStarDetail';

export default async function FixedStarPage({ params }: { params: Promise<{ star: string }> }) {
  const { star } = await params;
  return <FixedStarDetail slug={star} />;
}
