export const colors = {
  cream: '#FFFFFF',
  creamSoft: '#F8F8F8',
  sand: '#F0F0F0',
  ink: '#171B3A',
  inkSoft: '#2A2F66',
  inkMuted: '#5C5C7A',
  coral: '#E9785E',
  coralSoft: '#F3B8A6',
  amber: '#D4A04C',
  midnight: '#0F1228',
  midnight2: '#1B1F47',
  ruleSoft: '#E5E1D8',
  streamThinking: '#5C6E78',
  streamFeeling: '#D4A04C',
  streamWilling: '#E9785E',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export const radii = {
  chip: 14,
  card: 18,
  modal: 22,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radii;
