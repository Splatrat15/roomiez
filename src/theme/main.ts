import { useWindowDimensions } from 'react-native';

/**
 * Roomiez style rules.
 * Baseline is iPhone 16e (390 x 844 pt). Type scales with width and stops
 * growing past 440 pt so larger phones stay fluid and a computer window
 * stays a centered phone column.
 * Safe zone: device insets on the top and sides. The tab bar owns the bottom inset.
 * Reset: no borders, no list markers, no padding beyond that safe zone.
 * Colors, most used first: Ivory, Blue Grotto, Rose Quartz, Blue Iris.
 * Ivory was supplied as #E4ED0, which is not a 6-digit hex. #F4EFE4 is the warm ivory used here.
 */
export const colors = {
  ivory: '#F4EFE4',
  blueGrotto: '#2673C0',
  roseQuartz: '#E17A70',
  blueIris: '#504F80',
} as const;

export const layout = {
  baselineWidth: 390,
  baselineHeight: 844,
  frameMaxWidth: 440,
} as const;

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
