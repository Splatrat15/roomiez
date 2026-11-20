import { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, reset, useFluidSize } from '@/theme/main';

type ScreenProps = {
  title: string;
  children?: ReactNode;
};

export function Screen({ title, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const brandSize = useFluidSize(18);
  const titleSize = useFluidSize(36);

  // Native uses insets. Web safe area is handled in +html.tsx CSS.
  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: top,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      <Text style={[styles.brand, { fontSize: brandSize }]}>roomiez</Text>
      <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ivory,
  },
  brand: {
    ...reset,
    color: colors.blueGrotto,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'lowercase',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  title: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
    letterSpacing: 2,
    backgroundColor: 'transparent',
  },
});
