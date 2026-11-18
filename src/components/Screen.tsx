import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, reset, useFluidSize } from '@/theme/main';

type ScreenProps = {
  title: string;
  children?: ReactNode;
};

export function Screen({ title, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const titleSize = useFluidSize(34);

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
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
  title: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '700',
    letterSpacing: 1,
    backgroundColor: 'transparent',
  },
});
