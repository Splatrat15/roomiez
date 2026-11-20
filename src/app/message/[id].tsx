import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
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
import { getConversation } from '@/data/messages';
import { colors, reset, useFluidSize } from '@/theme/main';

type Bubble = {
  id: string;
  sender: 'me' | 'them';
  text: string;
};

function asBubbles(list: { id: string; sender: string; text: string }[] | undefined): Bubble[] {
  return (list ?? []).map((message) => ({
    id: message.id,
    sender: message.sender === 'me' ? 'me' : 'them',
    text: message.text,
  }));
}

function firstName(fullName: string) {
  return fullName.split(' ')[0] ?? fullName;
}

export default function MessageThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<any>(null);
  const nameSize = useFluidSize(17);
  const bodySize = useFluidSize(16);

  const conversation = getConversation(id);
  const profile = profiles.find((person) => person.id === conversation?.profileId);

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Bubble[]>(() => asBubbles(conversation?.messages));

  useEffect(() => {
    setMessages(asBubbles(conversation?.messages));
  }, [conversation]);

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 10 : Math.max(insets.bottom, 10);

  if (!conversation || !profile) {
    return (
      <View style={[styles.screen, { paddingTop: top }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Thread not found</Text>
        </View>
      </View>
    );
  }

  const send = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `${conversation.id}-${Date.now()}`,
        sender: 'me',
        text,
      },
    ]);
    setDraft('');
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    });
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          paddingTop: top,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        </Pressable>
        <Image source={profile.image} style={styles.headerAvatar} />
        <Text style={[styles.headerName, { fontSize: nameSize }]} numberOfLines={1}>
          {firstName(profile.name)}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.thread}
        contentContainerStyle={styles.threadContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd?.({ animated: false })}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => {
          const mine = message.sender === 'me';
          return (
            <View
              key={message.id}
              style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}
            >
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text
                  style={[
                    styles.bubbleText,
                    { fontSize: bodySize },
                    mine ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: bottom }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="iMessage"
          placeholderTextColor={`${colors.blueIris}99`}
          style={[styles.input, { fontSize: bodySize }]}
          multiline
          onSubmitEditing={send}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={send}
          style={[styles.send, !draft.trim() && styles.sendDisabled]}
          disabled={!draft.trim()}
          hitSlop={8}
        >
          <Ionicons name="arrow-up-circle" size={34} color={colors.blueGrotto} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...reset,
    flex: 1,
    backgroundColor: colors.ivory,
  },
  header: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 10,
    gap: 8,
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
    color: colors.blueGrotto,
    fontWeight: '600',
    fontSize: 16,
  },
  headerAvatar: {
    ...reset,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueIris,
  },
  headerName: {
    ...reset,
    flex: 1,
    color: colors.blueIris,
    fontWeight: '700',
  },
  thread: {
    ...reset,
    flex: 1,
  },
  threadContent: {
    ...reset,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  bubbleRow: {
    ...reset,
    width: '100%',
    flexDirection: 'row',
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowTheirs: {
    justifyContent: 'flex-start',
  },
  bubble: {
    ...reset,
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleMine: {
    backgroundColor: colors.blueGrotto,
    borderBottomRightRadius: 6,
  },
  bubbleTheirs: {
    backgroundColor: '#D8D4C8',
    borderBottomLeftRadius: 6,
  },
  bubbleText: {
    ...reset,
    lineHeight: 22,
  },
  bubbleTextMine: {
    color: colors.ivory,
  },
  bubbleTextTheirs: {
    color: colors.blueIris,
  },
  composer: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  input: {
    ...reset,
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#D8D4C8',
    color: colors.blueIris,
  },
  send: {
    ...reset,
    marginBottom: 2,
  },
  sendDisabled: {
    opacity: 0.35,
  },
  missing: {
    ...reset,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    ...reset,
    color: colors.blueIris,
    fontWeight: '600',
  },
});
