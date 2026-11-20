import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { conversations, formatPreview } from '@/data/messages';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const titleSize = useFluidSize(28);
  const nameSize = useFluidSize(16);
  const previewSize = useFluidSize(13);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  const threads = conversations
    .map((conversation) => {
      const profile = profiles.find((person) => person.id === conversation.profileId);
      if (!profile) {
        return null;
      }

      return {
        conversation,
        profile,
        preview: formatPreview(conversation, firstName(profile.name)),
      };
    })
    .filter(Boolean);

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
      <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>Messages</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {threads.map((thread) => {
          if (!thread) {
            return null;
          }

          const { conversation, profile, preview } = thread;

          return (
            <Pressable
              key={conversation.id}
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: '/message/[id]',
                  params: { id: conversation.id },
                })
              }
            >
              <Image
                source={profile.image}
                style={[styles.avatar, { backgroundColor: colors.blueIris }]}
              />
              <View style={styles.copy}>
                <Text
                  style={[styles.name, { fontSize: nameSize, color: colors.blueIris }]}
                  numberOfLines={1}
                >
                  {profile.name}
                </Text>
                <Text
                  style={[styles.preview, { fontSize: previewSize, color: colors.blueGrotto }]}
                  numberOfLines={1}
                >
                  {preview}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
  },
  title: {
    ...reset,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  list: {
    ...reset,
    flex: 1,
  },
  listContent: {
    ...reset,
    flexGrow: 1,
  },
  row: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    ...reset,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  copy: {
    ...reset,
    flex: 1,
    gap: 4,
  },
  name: {
    ...reset,
    fontWeight: '700',
  },
  preview: {
    ...reset,
    opacity: 0.85,
  },
});
