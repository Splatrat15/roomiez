import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

const FILLER = `Roomiez Privacy Policy (filler)

Last updated: November 20, 2026

This is placeholder text for the Roomiez school project. It is not a real legal document.

1. What we collect
We may collect profile details you choose to share, such as your name, age, photos, school info, and roommate preferences. Message content you send in the app may also be stored so conversations can appear on your device.

2. How we use information
Information is used to show roommate matches, power messaging, and improve the product experience. We do not sell personal data in this filler policy.

3. Sharing
We do not share your profile with third parties for advertising in this draft. In a real product, sharing rules would be spelled out here.

4. Your choices
You can edit or delete profile content from Settings once those tools ship. You may also log out from Settings.

5. Contact
Questions about this filler policy can go to your project team for now.

By using Roomiez, you acknowledge this is sample privacy copy for design and demos.`;

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const titleSize = useFluidSize(28);
  const bodySize = useFluidSize(15);

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const bottom = Platform.OS === 'web' ? 20 : Math.max(insets.bottom, 20);

  return (
    <View style={[styles.screen, { paddingTop: top, backgroundColor: colors.ivory }]}>
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottom }}>
        <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
          Privacy policy
        </Text>
        <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>{FILLER}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
  },
  back: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  backLabel: {
    ...reset,
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    ...reset,
    fontWeight: '700',
    marginBottom: 12,
  },
  body: {
    ...reset,
    lineHeight: 22,
  },
});
