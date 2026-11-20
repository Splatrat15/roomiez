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
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

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
  const { colors, isDark } = useTheme();
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
  const mineText = isDark ? '#14141C' : colors.ivory;

  if (!conversation || !profile) {
    return (
      <View style={[styles.screen, { paddingTop: top, backgroundColor: colors.ivory }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
        </Pressable>
        <View style={styles.missing}>
          <Text style={[styles.missingText, { color: colors.blueIris }]}>Thread not found</Text>
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
          backgroundColor: colors.ivory,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        </Pressable>
        <Image
          source={profile.image}
          style={[styles.headerAvatar, { backgroundColor: colors.blueIris }]}
        />
        <Text
          style={[styles.headerName, { fontSize: nameSize, color: colors.blueIris }]}
          numberOfLines={1}
        >
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
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: mine ? colors.blueGrotto : colors.surface,
                    borderBottomRightRadius: mine ? 6 : 20,
                    borderBottomLeftRadius: mine ? 20 : 6,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    { fontSize: bodySize, color: mine ? mineText : colors.blueIris },
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
          style={[
            styles.input,
            {
              fontSize: bodySize,
              backgroundColor: colors.surface,
              color: colors.blueIris,
            },
          ]}
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
    fontWeight: '600',
    fontSize: 16,
  },
  headerAvatar: {
    ...reset,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerName: {
    ...reset,
    flex: 1,
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
  bubbleText: {
    ...reset,
    lineHeight: 22,
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
    fontWeight: '600',
  },
});
