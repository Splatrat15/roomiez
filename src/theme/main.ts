import { useWindowDimensions } from 'react-native';

/**
 * Roomiez style rules
 *
 * Baseline: iPhone 16e (390 x 844). Layout stays fluid on every phone.
 * On a computer, the UI is a centered phone column (max 440pt wide).
 *
 * Safe zone: respect device insets on top and sides. The bottom tab bar
 * owns the home-indicator inset. Do not add extra decorative padding.
 *
 * Reset: no borders, no list markers, no default padding/margin, no dots.
 * Prefer flat color planes over cards, rules, or chrome.
 *
 * Palette keys stay the same in light and dark. Values swap for contrast.
 * Ivory = page background, Blue Iris = primary text/chrome, Blue Grotto = accent.
 */
export type ThemeColors = {
  ivory: string;
  blueGrotto: string;
  roseQuartz: string;
  blueIris: string;
  likeGreen: string;
  likeGreenDeep: string;
  rejectRed: string;
  rejectRedDeep: string;
  surface: string;
  gradientEnd: string;
};

export const lightColors: ThemeColors = {
  ivory: '#E4E3D0',
  blueGrotto: '#2673C0',
  roseQuartz: '#E17A70',
  blueIris: '#504F80',
  likeGreen: '#B7E0B0',
  likeGreenDeep: '#3F8F4C',
  rejectRed: '#F0A8A0',
  rejectRedDeep: '#C4453A',
  surface: '#D8D4C8',
  gradientEnd: 'rgba(80, 79, 128, 0.94)',
};

export const darkColors: ThemeColors = {
  ivory: '#14141C',
  blueGrotto: '#5B9FE0',
  roseQuartz: '#E17A70',
  blueIris: '#E4E3D0',
  likeGreen: '#B7E0B0',
  likeGreenDeep: '#6BCF7A',
  rejectRed: '#F0A8A0',
  rejectRedDeep: '#FF8A80',
  surface: '#2A2A36',
  gradientEnd: 'rgba(20, 20, 28, 0.96)',
};

/** Default light export for static spots (web HTML shell). Prefer useTheme() in UI. */
export const colors = lightColors;

export const layout = {
  baselineWidth: 390,
  baselineHeight: 844,
  frameMaxWidth: 440,
} as const;

/** Flat reset. Spread into StyleSheets instead of inventing new padding/borders. */
export const reset = {
  margin: 0,
  padding: 0,
  borderWidth: 0,
  borderRadius: 0,
} as const;

export function fluidSize(size: number, windowWidth: number) {
  const width = Math.min(Math.max(windowWidth, 320), layout.frameMaxWidth);
  return Math.round((size * width) / layout.baselineWidth);
}

export function useFluidSize(size: number) {
  const { width } = useWindowDimensions();
  return fluidSize(size, width);
}
