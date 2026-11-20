import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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

export default function NewGroupScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { createGroupChat } = useMessages();
  const titleSize = useFluidSize(22);
  const bodySize = useFluidSize(15);

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState('');

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 16);
  const onAccent = isDark ? '#14141C' : colors.ivory;

  const selected = useMemo(
    () => profiles.filter((person) => selectedIds.includes(person.id)),
    [selectedIds],
  );

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    return profiles.filter((person) => {
      if (selectedIds.includes(person.id)) {
        return false;
      }
      return person.name.toLowerCase().includes(trimmed);
    });
  }, [query, selectedIds]);

  const addMember = (id: number) => {
    setSelectedIds((current) => (current.includes(id) ? current : [...current, id]));
    setQuery('');
  };

  const removeMember = (id: number) => {
    setSelectedIds((current) => current.filter((memberId) => memberId !== id));
  };

  const create = () => {
    if (!selectedIds.length) {
      return;
    }

    const conversation = createGroupChat(selectedIds, groupName);
    router.replace({
      pathname: '/message/[id]',
      params: { id: conversation.id },
    });
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
        <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
          New group
        </Text>
        <Pressable
          onPress={create}
          disabled={!selectedIds.length}
          style={[styles.createBtn, !selectedIds.length && styles.createDisabled]}
          hitSlop={8}
        >
          <Text
            style={[
              styles.createLabel,
              { color: selectedIds.length ? colors.blueGrotto : `${colors.blueIris}66` },
            ]}
          >
            Create
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: colors.blueGrotto }]}>Group name (optional)</Text>
        <TextInput
          value={groupName}
          onChangeText={setGroupName}
          placeholder="e.g. Barrett suite hunt"
          placeholderTextColor={`${colors.blueIris}88`}
          style={[
            styles.input,
            { fontSize: bodySize, color: colors.blueIris, backgroundColor: colors.surface },
          ]}
        />

        <Text style={[styles.label, { color: colors.blueGrotto }]}>Add people</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Type a name…"
          placeholderTextColor={`${colors.blueIris}88`}
          autoCorrect={false}
          autoCapitalize="words"
          style={[
            styles.input,
            { fontSize: bodySize, color: colors.blueIris, backgroundColor: colors.surface },
          ]}
        />

        {selected.length ? (
          <View style={styles.chips}>
            {selected.map((person) => (
              <Pressable
                key={person.id}
                onPress={() => removeMember(person.id)}
                style={[styles.chip, { backgroundColor: colors.blueGrotto }]}
              >
                <Text style={[styles.chipText, { color: onAccent }]}>
                  {person.name.split(' ')[0]}
                </Text>
                <Ionicons name="close" size={14} color={onAccent} />
              </Pressable>
            ))}
          </View>
        ) : null}

        {query.trim() ? (
          <View style={styles.matches}>
            {matches.length ? (
              matches.map((person) => (
                <Pressable
                  key={person.id}
                  style={styles.matchRow}
                  onPress={() => addMember(person.id)}
                >
                  <Image
                    source={person.image}
                    style={[styles.matchAvatar, { backgroundColor: colors.blueIris }]}
                  />
                  <Text style={[styles.matchName, { fontSize: bodySize, color: colors.blueIris }]}>
                    {person.name}
                  </Text>
                  <Ionicons name="add-circle-outline" size={22} color={colors.blueGrotto} />
                </Pressable>
              ))
            ) : (
              <Text style={[styles.empty, { color: colors.blueIris }]}>No matches</Text>
            )}
          </View>
        ) : (
          <Text style={[styles.hint, { color: `${colors.blueIris}99` }]}>
            Start typing to find people from Roomiez.
          </Text>
        )}
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
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  title: {
    ...reset,
    flex: 1,
    fontWeight: '700',
  },
  createBtn: {
    ...reset,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  createDisabled: {
    opacity: 0.7,
  },
  createLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    ...reset,
    paddingHorizontal: 16,
    gap: 10,
  },
  label: {
    ...reset,
    fontWeight: '600',
    fontSize: 13,
    marginTop: 6,
  },
  input: {
    ...reset,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chips: {
    ...reset,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    ...reset,
    fontWeight: '700',
    fontSize: 13,
  },
  matches: {
    ...reset,
    gap: 4,
    marginTop: 4,
  },
  matchRow: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  matchAvatar: {
    ...reset,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  matchName: {
    ...reset,
    flex: 1,
    fontWeight: '600',
  },
  empty: {
    ...reset,
    paddingVertical: 12,
    opacity: 0.7,
  },
  hint: {
    ...reset,
    marginTop: 8,
    fontSize: 14,
  },
});
