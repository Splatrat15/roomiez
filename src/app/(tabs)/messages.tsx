import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { formatPreview, useMessages } from '@/data/MessagesProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { conversations } = useMessages();
  const titleSize = useFluidSize(28);
  const nameSize = useFluidSize(16);
  const previewSize = useFluidSize(13);

  const top = Platform.OS === 'web' ? 0 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  const threads = conversations
    .map((conversation) => {
      if (conversation.isGroup) {
        const members = (conversation.memberIds ?? [])
          .map((id) => profiles.find((person) => person.id === id))
          .filter(Boolean);
        const previewLabel = members[0] ? firstName(members[0]!.name) : 'Group';
        return {
          conversation,
          title: conversation.title || 'Group chat',
          preview: formatPreview(conversation, previewLabel),
          avatars: members.slice(0, 2).map((person) => person!.image),
          isGroup: true as const,
        };
      }

      const profile = profiles.find((person) => person.id === conversation.profileId);
      if (!profile) {
        return null;
      }

      return {
        conversation,
        title: profile.name,
        preview: formatPreview(conversation, firstName(profile.name)),
        avatars: [profile.image],
        isGroup: false as const,
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
      <View style={styles.titleRow}>
        <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
          Messages
        </Text>
        <Pressable
          onPress={() => router.push('/new-group')}
          hitSlop={10}
          style={styles.addBtn}
          accessibilityLabel="New group chat"
        >
          <Ionicons name="create-outline" size={26} color={colors.blueGrotto} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {threads.map((thread) => {
          if (!thread) {
            return null;
          }

          const { conversation, title, preview, avatars, isGroup } = thread;

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
              {isGroup ? (
                <View style={styles.groupAvatar}>
                  {avatars[0] ? (
                    <Image
                      source={avatars[0]}
                      style={[styles.groupAvatarMain, { backgroundColor: colors.blueIris }]}
                    />
                  ) : (
                    <View
                      style={[
                        styles.groupAvatarMain,
                        styles.groupFallback,
                        { backgroundColor: colors.blueGrotto },
                      ]}
                    >
                      <Ionicons name="people" size={22} color={colors.ivory} />
                    </View>
                  )}
                  {avatars[1] ? (
                    <Image
                      source={avatars[1]}
                      style={[
                        styles.groupAvatarSecondary,
                        { backgroundColor: colors.blueIris, borderColor: colors.ivory },
                      ]}
                    />
                  ) : null}
                </View>
              ) : (
                <Image
                  source={avatars[0]}
                  style={[styles.avatar, { backgroundColor: colors.blueIris }]}
                />
              )}
              <View style={styles.copy}>
                <Text
                  style={[styles.name, { fontSize: nameSize, color: colors.blueIris }]}
                  numberOfLines={1}
                >
                  {title}
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
  titleRow: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    ...reset,
    flex: 1,
    fontWeight: '700',
  },
  addBtn: {
    ...reset,
    padding: 4,
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
  groupAvatar: {
    ...reset,
    width: 56,
    height: 56,
  },
  groupAvatarMain: {
    ...reset,
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  groupAvatarSecondary: {
    ...reset,
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
  },
  groupFallback: {
    alignItems: 'center',
    justifyContent: 'center',
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
