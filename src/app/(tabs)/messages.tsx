import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { formatPreview, useMessages, type Conversation } from '@/data/MessagesProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

type ThreadRowProps = {
  conversation: Conversation;
  title: string;
  preview: string;
  avatars: ImageSourcePropType[];
  isGroup: boolean;
  nameSize: number;
  previewSize: number;
  onOpen: () => void;
  onDelete: () => void;
};

function ThreadRow({
  conversation,
  title,
  preview,
  avatars,
  isGroup,
  nameSize,
  previewSize,
  onOpen,
  onDelete,
}: ThreadRowProps) {
  const { colors } = useTheme();
  const swipeRef = useRef<SwipeableMethods>(null);
  const blocked = Boolean(conversation.blocked);
  const muted = blocked ? 0.45 : 1;
  const nameColor = blocked ? `${colors.blueIris}99` : colors.blueIris;
  const previewColor = blocked ? `${colors.blueGrotto}88` : colors.blueGrotto;

  const confirmDelete = () => {
    swipeRef.current?.close();
    Alert.alert('Delete conversation?', `Remove “${title}” from Messages on this device?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  const renderRightActions = () => (
    <Pressable style={styles.deleteAction} onPress={confirmDelete}>
      <Ionicons name="trash" size={22} color="#fff" />
      <Text style={styles.deleteLabel}>Delete</Text>
    </Pressable>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <Pressable
        style={[
          styles.row,
          blocked && styles.rowBlocked,
          { backgroundColor: colors.ivory },
        ]}
        onPress={onOpen}
      >
        <View style={{ opacity: muted }}>
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
        </View>
        <View style={[styles.copy, { opacity: muted }]}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { fontSize: nameSize, color: nameColor }]} numberOfLines={1}>
              {title}
            </Text>
            {blocked ? <Ionicons name="ban" size={16} color="#C23B4B" /> : null}
          </View>
          <Text
            style={[styles.preview, { fontSize: previewSize, color: previewColor }]}
            numberOfLines={1}
          >
            {blocked ? 'Blocked' : preview}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { conversations, deleteConversation } = useMessages();
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
            <ThreadRow
              key={conversation.id}
              conversation={conversation}
              title={title}
              preview={preview}
              avatars={avatars}
              isGroup={isGroup}
              nameSize={nameSize}
              previewSize={previewSize}
              onOpen={() =>
                router.push({
                  pathname: '/message/[id]',
                  params: { id: conversation.id },
                })
              }
              onDelete={() => deleteConversation(conversation.id)}
            />
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
  rowBlocked: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  deleteAction: {
    ...reset,
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C23B4B',
    gap: 4,
  },
  deleteLabel: {
    ...reset,
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
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
  nameRow: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    ...reset,
    flexShrink: 1,
    fontWeight: '700',
  },
  preview: {
    ...reset,
    opacity: 0.85,
  },
});
