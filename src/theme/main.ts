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
 * Palette (most used -> least):
 *   Ivory #E4E3D0  — backgrounds
 *   Blue Grotto #2673C0 — primary actions / active tab
 *   Rose Quartz #E17A70 — swipe / heart accent
 *   Blue Iris #504F80 — text and secondary chrome
 */
export const colors = {
  ivory: '#E4E3D0',
  blueGrotto: '#2673C0',
  roseQuartz: '#E17A70',
  blueIris: '#504F80',
} as const;

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
