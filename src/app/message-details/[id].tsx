import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { profiles } from '@/data/data';
import { useMessages } from '@/data/MessagesProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

export default function MessageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const {
    getConversation,
    setConversationNotes,
    blockConversation,
    unblockConversation,
    reportConversation,
  } = useMessages();

  const titleSize = useFluidSize(22);
  const bodySize = useFluidSize(15);

  const conversation = getConversation(id);
  const profile = conversation?.isGroup
    ? null
    : profiles.find((person) => person.id === conversation?.profileId);
  const groupMembers = conversation?.isGroup
    ? (conversation.memberIds ?? [])
        .map((memberId) => profiles.find((person) => person.id === memberId))
        .filter(Boolean)
    : [];

  const [notes, setNotes] = useState(conversation?.notes ?? '');

  useEffect(() => {
    setNotes(conversation?.notes ?? '');
  }, [conversation?.id, conversation?.notes]);

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 16);
  const onAccent = isDark ? '#14141C' : colors.ivory;
  const danger = '#C23B4B';

  if (!conversation || (!conversation.isGroup && !profile)) {
    return (
      <View style={[styles.screen, { paddingTop: top, backgroundColor: colors.ivory }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
        </Pressable>
        <View style={styles.missing}>
          <Text style={[styles.missingText, { color: colors.blueIris }]}>Chat not found</Text>
        </View>
      </View>
    );
  }

  const displayName = conversation.isGroup
    ? conversation.title || 'Group chat'
    : profile!.name;

  const saveNotes = (value: string) => {
    setNotes(value);
    setConversationNotes(conversation.id, value);
  };

  const confirmBlock = () => {
    Alert.alert(
      'Block?',
      conversation.isGroup
        ? `Block this group? You will not be able to message it.`
        : `Block ${firstName(profile!.name)}? You will return to Messages.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            blockConversation(conversation.id);
            router.replace('/(tabs)/messages');
          },
        },
      ],
    );
  };

  const confirmUnblock = () => {
    Alert.alert('Unblock?', `Allow messages with ${displayName} again?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        onPress: () => unblockConversation(conversation.id),
      },
    ]);
  };

  const confirmReport = () => {
    if (conversation.reported) {
      Alert.alert('Already reported', 'Thanks — we already have your report for this chat.');
      return;
    }

    Alert.alert(
      'Report user?',
      conversation.isGroup
        ? 'Report this group for review?'
        : `Report ${firstName(profile!.name)} for review?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            reportConversation(conversation.id);
            Alert.alert('Reported', 'Thanks for letting us know. Our team will review this.');
          },
        },
      ],
    );
  };

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
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        </Pressable>
        <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]} numberOfLines={1}>
          {conversation.isGroup ? 'Group' : 'Contact'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.identity}>
          {conversation.isGroup ? (
            <View style={styles.groupAvatarWrap}>
              {groupMembers[0] ? (
                <Image
                  source={groupMembers[0].image}
                  style={[styles.groupAvatarMain, { backgroundColor: colors.blueIris }]}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    styles.groupFallback,
                    { backgroundColor: colors.blueGrotto },
                  ]}
                >
                  <Ionicons name="people" size={36} color={onAccent} />
                </View>
              )}
              {groupMembers[1] ? (
                <Image
                  source={groupMembers[1].image}
                  style={[
                    styles.groupAvatarSecondary,
                    { backgroundColor: colors.blueIris, borderColor: colors.ivory },
                  ]}
                />
              ) : null}
            </View>
          ) : (
            <Image
              source={profile!.image}
              style={[styles.avatar, { backgroundColor: colors.blueIris }]}
            />
          )}
          <Text style={[styles.name, { color: colors.blueIris }]}>{displayName}</Text>
          {conversation.isGroup ? (
            <Text style={[styles.sub, { color: colors.blueGrotto }]}>
              {groupMembers.map((person) => firstName(person!.name)).join(', ')}
            </Text>
          ) : (
            <Text style={[styles.sub, { color: colors.blueGrotto }]}>
              {[profile!.education?.school, profile!.education?.year].filter(Boolean).join(' · ')}
            </Text>
          )}
          {conversation.blocked ? (
            <View style={[styles.badge, { backgroundColor: `${danger}22` }]}>
              <Ionicons name="ban" size={14} color={danger} />
              <Text style={[styles.badgeText, { color: danger }]}>Blocked</Text>
            </View>
          ) : null}
          {conversation.reported ? (
            <View style={[styles.badge, { backgroundColor: `${colors.blueIris}18` }]}>
              <Ionicons name="flag" size={14} color={colors.blueIris} />
              <Text style={[styles.badgeText, { color: colors.blueIris }]}>Reported</Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.blueGrotto }]}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={saveNotes}
          placeholder="Write private notes about this chat…"
          placeholderTextColor={`${colors.blueIris}88`}
          multiline
          textAlignVertical="top"
          style={[
            styles.notepad,
            {
              fontSize: bodySize,
              color: colors.blueIris,
              backgroundColor: colors.surface,
              borderColor: `${colors.blueIris}22`,
            },
          ]}
        />

        <View style={styles.actions}>
          {conversation.blocked ? (
            <Pressable
              onPress={confirmUnblock}
              style={[styles.actionBtn, { backgroundColor: colors.blueGrotto }]}
            >
              <Ionicons name="lock-open-outline" size={20} color={onAccent} />
              <Text style={[styles.actionLabel, { color: onAccent }]}>Unblock</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={confirmBlock}
              style={[styles.actionBtn, { backgroundColor: danger }]}
            >
              <Ionicons name="ban" size={20} color="#fff" />
              <Text style={[styles.actionLabel, { color: '#fff' }]}>Block</Text>
            </Pressable>
          )}

          <Pressable
            onPress={confirmReport}
            style={[
              styles.actionBtn,
              styles.actionOutline,
              { borderColor: colors.blueIris, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons name="flag-outline" size={20} color={colors.blueIris} />
            <Text style={[styles.actionLabel, { color: colors.blueIris }]}>Report user</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
  },
  header: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 4,
  },
  back: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  backLabel: {
    ...reset,
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    ...reset,
    flex: 1,
    fontWeight: '700',
  },
  content: {
    ...reset,
    paddingHorizontal: 16,
    gap: 12,
  },
  identity: {
    ...reset,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  avatar: {
    ...reset,
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  groupAvatarWrap: {
    ...reset,
    width: 96,
    height: 88,
  },
  groupAvatarMain: {
    ...reset,
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'absolute',
    left: 4,
    top: 4,
  },
  groupAvatarSecondary: {
    ...reset,
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'absolute',
    right: 4,
    bottom: 0,
    borderWidth: 3,
  },
  groupFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...reset,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
  },
  sub: {
    ...reset,
    fontSize: 14,
    textAlign: 'center',
  },
  badge: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    ...reset,
    fontWeight: '700',
    fontSize: 12,
  },
  sectionLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
  },
  notepad: {
    ...reset,
    minHeight: 160,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    lineHeight: 22,
  },
  actions: {
    ...reset,
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionOutline: {
    borderWidth: 1.5,
  },
  actionLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 16,
  },
  missing: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    ...reset,
    fontWeight: '600',
  },
});
