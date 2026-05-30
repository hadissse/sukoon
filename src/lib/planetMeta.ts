const PLANET_SVG_OVERRIDES: Partial<Record<string, string>> = {
  northNode: 'southnode',
  southNode: 'northnode',
};

export function planetSvgKey(key: string): string {
  return PLANET_SVG_OVERRIDES[key] ?? key.toLowerCase();
}
