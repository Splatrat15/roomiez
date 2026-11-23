import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { useFluidSize } from '@/theme/main';

const logoLight = require('../../assets/images/roomiezBlue.png');
const logoDark = require('../../assets/images/roomiezWhite.png');

/** Intrinsic aspect ratios (width / height) from the source PNGs. */
const LIGHT_ASPECT = 1672 / 941;
const DARK_ASPECT = 866 / 288;

type BrandLogoProps = {
  /** Box height in baseline points; scales with screen width. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function BrandLogo({ height = 28, style }: BrandLogoProps) {
  const { isDark } = useTheme();
  const logoHeight = useFluidSize(height);
  const aspectRatio = isDark ? DARK_ASPECT : LIGHT_ASPECT;
  const logoWidth = Math.round(logoHeight * aspectRatio);

  return (
    <View style={[{ width: logoWidth, height: logoHeight }, styles.box, style]}>
      <Image
        source={isDark ? logoDark : logoLight}
        style={{ width: logoWidth, height: logoHeight }}
        resizeMode="contain"
        accessibilityLabel="Roomiez"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});
