import { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

type ScreenProps = {
  title: string;
  children?: ReactNode;
};

export function Screen({ title, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const brandSize = useFluidSize(18);
  const titleSize = useFluidSize(36);

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
          backgroundColor: colors.ivory,
        },
      ]}
    >
      <Text style={[styles.brand, { fontSize: brandSize, color: colors.blueGrotto }]}>roomiez</Text>
      <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>{title}</Text>
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
  },
  brand: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'lowercase',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  title: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 2,
    backgroundColor: 'transparent',
  },
});
