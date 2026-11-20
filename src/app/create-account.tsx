import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ABOUT_QUESTIONS,
  HOBBY_OPTIONS,
  ROOMMATE_DISLIKE_OPTIONS,
  ROOMMATE_LIKE_OPTIONS,
} from '@/data/quiz';
import { defaultAbout } from '@/data/user';
import { useUser } from '@/data/UserProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

type QuizDraft = {
  hobbies: string[];
  about: typeof defaultAbout;
  roommateLikes: string[];
  roommateDislikes: string[];
};

type Step =
  | { kind: 'gate' }
  | { kind: 'partIntro'; part: 1 | 2 }
  | { kind: 'hobbies' }
  | { kind: 'about'; index: number }
  | { kind: 'likes' }
  | { kind: 'dislikes' }
  | { kind: 'done' };

function buildSteps(): Step[] {
  const aboutSteps: Step[] = ABOUT_QUESTIONS.map((_, index) => ({ kind: 'about', index }));
  return [
    { kind: 'gate' },
    { kind: 'partIntro', part: 1 },
    { kind: 'hobbies' },
    ...aboutSteps,
    { kind: 'partIntro', part: 2 },
    { kind: 'likes' },
    { kind: 'dislikes' },
    { kind: 'done' },
  ];
}

function findSectionStepIndex(steps: Step[], section?: string) {
  if (!section) {
    return 0;
  }

  if (section === 'hobbies') {
    return steps.findIndex((step) => step.kind === 'hobbies');
  }

  if (section === 'lifestyle') {
    return steps.findIndex((step) => step.kind === 'about' && step.index === 0);
  }

  if (section === 'about') {
    const expressIndex = ABOUT_QUESTIONS.findIndex((question) => question.id === 'expressYourself');
    return steps.findIndex((step) => step.kind === 'about' && step.index === expressIndex);
  }

  if (section === 'likes') {
    return steps.findIndex((step) => step.kind === 'likes');
  }

  if (section === 'dislikes') {
    return steps.findIndex((step) => step.kind === 'dislikes');
  }

  return 0;
}

/** Last step for a pencil-edit section. After this, save and return to profile. */
function findSectionEndStepIndex(steps: Step[], section?: string) {
  if (!section) {
    return -1;
  }

  if (section === 'hobbies') {
    return steps.findIndex((step) => step.kind === 'hobbies');
  }

  if (section === 'likes') {
    return steps.findIndex((step) => step.kind === 'likes');
  }

  if (section === 'dislikes') {
    return steps.findIndex((step) => step.kind === 'dislikes');
  }

  if (section === 'about') {
    const oneWordIndex = ABOUT_QUESTIONS.findIndex(
      (question) => question.id === 'oneWordDescribeMe',
    );
    return steps.findIndex((step) => step.kind === 'about' && step.index === oneWordIndex);
  }

  if (section === 'lifestyle') {
    const allergiesIndex = ABOUT_QUESTIONS.findIndex((question) => question.id === 'allergies');
    return steps.findIndex((step) => step.kind === 'about' && step.index === allergiesIndex);
  }

  return -1;
}

function toggleItem(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, saveQuizAnswers } = useUser();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const titleSize = useFluidSize(26);
  const bodySize = useFluidSize(15);
  const steps = useMemo(() => buildSteps(), []);
  const initialStep = Math.max(0, findSectionStepIndex(steps, section));
  const sectionEndStep = useMemo(() => findSectionEndStepIndex(steps, section), [steps, section]);
  const entryStepRef = useRef(initialStep);
  const isSectionEdit = Boolean(section) && sectionEndStep >= 0;

  const [stepIndex, setStepIndex] = useState(initialStep);
  const [draft, setDraft] = useState<QuizDraft>(() => ({
    hobbies: [...user.hobbies],
    about: {
      ...defaultAbout,
      ...user.about,
      allergies: {
        ...defaultAbout.allergies,
        ...user.about.allergies,
      },
    },
    roommateLikes: [...user.roommateLikes],
    roommateDislikes: [...user.roommateDislikes],
  }));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;
  const bottom = Platform.OS === 'web' ? 16 : Math.max(insets.bottom, 16);

  const step = steps[stepIndex];
  const atSectionEnd = isSectionEdit && stepIndex === sectionEndStep;
  const sectionSpan = Math.max(sectionEndStep - entryStepRef.current, 0);
  const progress = isSectionEdit
    ? sectionSpan === 0
      ? 1
      : (stepIndex - entryStepRef.current) / sectionSpan
    : stepIndex / Math.max(steps.length - 1, 1);
  const onAccent = isDark ? '#14141C' : colors.ivory;

  const goNext = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const goBack = () => {
    if (stepIndex <= entryStepRef.current) {
      router.back();
      return;
    }
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const finish = async () => {
    await saveQuizAnswers(draft);
    Alert.alert('Profile saved', 'Your quiz answers now show on your profile.', [
      { text: 'View profile', onPress: () => router.replace('/(tabs)/profile') },
    ]);
  };

  const finishSection = async () => {
    await saveQuizAnswers(draft);
    router.replace('/(tabs)/profile');
  };

  const canContinue = () => {
    if (!step) {
      return false;
    }
    if (step.kind === 'gate') {
      return email.trim().length > 3 && password.trim().length > 3;
    }
    if (step.kind === 'hobbies') {
      return draft.hobbies.length > 0;
    }
    if (step.kind === 'likes') {
      return draft.roommateLikes.length > 0;
    }
    if (step.kind === 'dislikes') {
      return draft.roommateDislikes.length > 0;
    }
    if (step.kind === 'about') {
      const question = ABOUT_QUESTIONS[step.index];
      if (question.type === 'allergies') {
        if (!draft.about.allergies.has) {
          return true;
        }
        return draft.about.allergies.details.trim().length > 0;
      }
      if (question.type === 'text' && question.id === 'medicalConditions') {
        return true;
      }
      if (question.type === 'text' && question.id === 'oneWordDescribeMe') {
        const word = String(draft.about.oneWordDescribeMe ?? '').trim();
        return word.length > 0 && !/\s/.test(word);
      }
      if (question.type === 'text') {
        return String(draft.about[question.id as 'expressYourself'] ?? '').trim().length > 0;
      }
      if (question.type === 'scale') {
        return true;
      }
      return Boolean(draft.about[question.id as keyof typeof draft.about]);
    }
    return true;
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
        <Pressable style={styles.back} onPress={goBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
          <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
        </Pressable>
        <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.blueGrotto },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 88 }]}
        keyboardShouldPersistTaps="handled"
      >
        {step?.kind === 'gate' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.blueGrotto }]}>Create account</Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              Start your Roomiez profile
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              First a quick account, then a 2-part quiz: who you are, then what you want in a
              roommate.
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={`${colors.blueIris}88`}
              style={[styles.input, { color: colors.blueIris, backgroundColor: colors.surface }]}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password (filler)"
              secureTextEntry
              placeholderTextColor={`${colors.blueIris}88`}
              style={[styles.input, { color: colors.blueIris, backgroundColor: colors.surface }]}
            />
          </View>
        ) : null}

        {step?.kind === 'partIntro' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.blueGrotto }]}>
              Part {step.part} of 2
            </Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              {step.part === 1 ? 'About you' : 'Your roommate preferences'}
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              {step.part === 1
                ? 'Hobbies, habits, and lifestyle answers. These show on your profile and help people know you.'
                : 'Pick qualities you want and ones you want to avoid. Likes are visible. Dislikes stay private and help recommendations.'}
            </Text>
          </View>
        ) : null}

        {step?.kind === 'hobbies' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.blueGrotto }]}>Part 1</Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              What are your hobbies?
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              Pick as many as you want. These are visible on your profile.
            </Text>
            <View style={styles.chips}>
              {HOBBY_OPTIONS.map((hobby) => {
                const selected = draft.hobbies.includes(hobby);
                return (
                  <Pressable
                    key={hobby}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        hobbies: toggleItem(current.hobbies, hobby),
                      }))
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? colors.blueGrotto : colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? onAccent : colors.blueIris },
                      ]}
                    >
                      {hobby}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step?.kind === 'about' ? (
          <AboutStep
            index={step.index}
            draft={draft}
            setDraft={setDraft}
            titleSize={titleSize}
            bodySize={bodySize}
            colors={colors}
            onAccent={onAccent}
          />
        ) : null}

        {step?.kind === 'likes' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.blueGrotto }]}>Part 2 · Visible</Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              What do you want in a roommate?
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              These likes show on your profile and steer who gets recommended.
            </Text>
            <View style={styles.chips}>
              {ROOMMATE_LIKE_OPTIONS.map((item) => {
                const selected = draft.roommateLikes.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        roommateLikes: toggleItem(current.roommateLikes, item),
                      }))
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? colors.blueGrotto : colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? onAccent : colors.blueIris },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step?.kind === 'dislikes' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.roseQuartz }]}>Part 2 · Private</Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              What would you dislike in a roommate?
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              Only you see these. They quietly affect matching — other people never see this list.
            </Text>
            <View style={styles.chips}>
              {ROOMMATE_DISLIKE_OPTIONS.map((item) => {
                const selected = draft.roommateDislikes.includes(item);
                return (
                  <Pressable
                    key={item}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        roommateDislikes: toggleItem(current.roommateDislikes, item),
                      }))
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? colors.roseQuartz : colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? onAccent : colors.blueIris },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step?.kind === 'done' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.blueGrotto }]}>All set</Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              Save your profile quiz
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              Part 1 answers and roommate likes will appear under About me. Dislikes stay private.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottom, backgroundColor: colors.ivory }]}>
        <Pressable
          style={[
            styles.next,
            {
              backgroundColor: canContinue() ? colors.blueGrotto : colors.surface,
            },
          ]}
          disabled={!canContinue()}
          onPress={() => {
            if (step?.kind === 'done') {
              void finish();
              return;
            }
            if (atSectionEnd) {
              void finishSection();
              return;
            }
            goNext();
          }}
        >
          <Text
            style={[
              styles.nextLabel,
              { color: canContinue() ? onAccent : colors.blueIris },
            ]}
          >
            {step?.kind === 'done' || atSectionEnd ? 'Save & back to profile' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function AboutStep({
  index,
  draft,
  setDraft,
  titleSize,
  bodySize,
  colors,
  onAccent,
}: {
  index: number;
  draft: QuizDraft;
  setDraft: Dispatch<SetStateAction<QuizDraft>>;
  titleSize: number;
  bodySize: number;
  colors: {
    blueGrotto: string;
    blueIris: string;
    surface: string;
    ivory: string;
  };
  onAccent: string;
}) {
  const question = ABOUT_QUESTIONS[index];

  return (
    <View style={styles.block}>
      <Text style={[styles.kicker, { color: colors.blueGrotto }]}>Part 1 · About you</Text>
      <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
        {question.prompt}
      </Text>

      {question.type === 'scale' ? (
        <View style={styles.scaleRow}>
          {Array.from({ length: 5 }, (_, offset) => {
            const value = offset + 1;
            const selected = draft.about.cleanliness === value;
            return (
              <Pressable
                key={value}
                onPress={() =>
                  setDraft((current) => ({
                    ...current,
                    about: { ...current.about, cleanliness: value },
                  }))
                }
                style={[
                  styles.scaleDot,
                  { backgroundColor: selected ? colors.blueGrotto : colors.surface },
                ]}
              >
                <Text style={{ color: selected ? onAccent : colors.blueIris, fontWeight: '700' }}>
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {question.type === 'single' ? (
        <View style={styles.options}>
          {(question.options ?? []).map((option) => {
            const selected = draft.about[question.id as 'guests'] === option;
            return (
              <Pressable
                key={option}
                onPress={() =>
                  setDraft((current) => ({
                    ...current,
                    about: { ...current.about, [question.id]: option },
                  }))
                }
                style={[
                  styles.option,
                  { backgroundColor: selected ? colors.blueGrotto : colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: selected ? onAccent : colors.blueIris, fontSize: bodySize },
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {question.type === 'text' ? (
        <TextInput
          value={String(draft.about[question.id as 'expressYourself'] ?? '')}
          onChangeText={(text) =>
            setDraft((current) => ({
              ...current,
              about: { ...current.about, [question.id]: text },
            }))
          }
          placeholder={question.placeholder}
          placeholderTextColor={`${colors.blueIris}88`}
          multiline
          style={[
            styles.textArea,
            { color: colors.blueIris, backgroundColor: colors.surface, fontSize: bodySize },
          ]}
        />
      ) : null}

      {question.type === 'allergies' ? (
        <View style={styles.options}>
          {['No', 'Yes'].map((option) => {
            const selected = draft.about.allergies.has === (option === 'Yes');
            return (
              <Pressable
                key={option}
                onPress={() =>
                  setDraft((current) => ({
                    ...current,
                    about: {
                      ...current.about,
                      allergies: {
                        has: option === 'Yes',
                        details: option === 'Yes' ? current.about.allergies.details : '',
                      },
                    },
                  }))
                }
                style={[
                  styles.option,
                  { backgroundColor: selected ? colors.blueGrotto : colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: selected ? onAccent : colors.blueIris, fontSize: bodySize },
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
          {draft.about.allergies.has ? (
            <TextInput
              value={draft.about.allergies.details}
              onChangeText={(text) =>
                setDraft((current) => ({
                  ...current,
                  about: {
                    ...current.about,
                    allergies: { ...current.about.allergies, details: text },
                  },
                }))
              }
              placeholder="What allergies?"
              placeholderTextColor={`${colors.blueIris}88`}
              style={[
                styles.input,
                { color: colors.blueIris, backgroundColor: colors.surface, marginTop: 8 },
              ]}
            />
          ) : null}
        </View>
      ) : null}
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
    paddingHorizontal: 12,
    gap: 10,
  },
  back: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backLabel: {
    ...reset,
    fontWeight: '600',
    fontSize: 16,
  },
  progressTrack: {
    ...reset,
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    ...reset,
    height: '100%',
    borderRadius: 999,
  },
  scroll: {
    ...reset,
    flex: 1,
  },
  content: {
    ...reset,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  block: {
    ...reset,
    gap: 12,
  },
  kicker: {
    ...reset,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  title: {
    ...reset,
    fontWeight: '700',
  },
  body: {
    ...reset,
    lineHeight: 22,
  },
  input: {
    ...reset,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  textArea: {
    ...reset,
    minHeight: 120,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlignVertical: 'top',
  },
  chips: {
    ...reset,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    ...reset,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipText: {
    ...reset,
    fontWeight: '600',
  },
  options: {
    ...reset,
    gap: 10,
    marginTop: 4,
  },
  option: {
    ...reset,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionText: {
    ...reset,
    fontWeight: '600',
    lineHeight: 20,
  },
  scaleRow: {
    ...reset,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  scaleDot: {
    ...reset,
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    ...reset,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  next: {
    ...reset,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 16,
  },
});
