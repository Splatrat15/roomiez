import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

const FILLER = `Roomiez Terms & Conditions (filler)

Last updated: November 20, 2026

This is placeholder terms copy for the Roomiez school project. It is not a real contract.

1. Using Roomiez
Roomiez is a roommate discovery demo. You agree to use the app respectfully and only for finding housing companions.

2. Accounts
Create-account flows in this build are filler. Do not submit real passwords you use elsewhere.

3. Content
You are responsible for the photos and text you upload. Do not post anything illegal, harassing, or misleading.

4. Matches and messages
Swipes, matches, and chats in this demo may be simulated. No guarantee of housing outcomes.

5. Limitation
The project team is not liable for roommate arrangements made outside the app.

6. Changes
These filler terms may change as the product grows.

By continuing, you agree this page is sample legal text for UI purposes only.`;

export default function TermsScreen() {
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
          Terms & conditions
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
