import { PlacementDetailClient } from '@/components/PlacementDetailClient';

export default async function PlacementDetailPage({
  params,
}: {
  params: Promise<{ type: string; key: string }>;
}) {
  const { type, key } = await params;
  return <PlacementDetailClient type={type} decodedKey={decodeURIComponent(key)} />;
}
