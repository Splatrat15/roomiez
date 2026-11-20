import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
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
  YEAR_OPTIONS,
} from '@/data/quiz';
import { defaultAbout, defaultEducation } from '@/data/user';
import { useUser } from '@/data/UserProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

type QuizDraft = {
  education: typeof defaultEducation;
  hobbies: string[];
  about: typeof defaultAbout;
  roommateLikes: string[];
  roommateDislikes: string[];
  roommateLikesPrivate: boolean;
  roommateDislikesPrivate: boolean;
};

function addCustomTags(list: string[], raw: string) {
  const parts = raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const next = [...list];
  for (const part of parts) {
    if (!next.some((item) => item.toLowerCase() === part.toLowerCase())) {
      next.push(part);
    }
  }
  return next;
}

type Step =
  | { kind: 'gate' }
  | { kind: 'partIntro'; part: 1 | 2 }
  | { kind: 'education' }
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
    { kind: 'education' },
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

  if (section === 'education') {
    return steps.findIndex((step) => step.kind === 'education');
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

  if (section === 'education') {
    return steps.findIndex((step) => step.kind === 'education');
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
    education: {
      ...defaultEducation,
      ...user.education,
    },
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
    roommateLikesPrivate: user.roommateLikesPrivate,
    roommateDislikesPrivate: user.roommateDislikesPrivate,
  }));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customLikes, setCustomLikes] = useState('');
  const [customDislikes, setCustomDislikes] = useState('');

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
    if (step.kind === 'education') {
      return (
        draft.education.school.trim().length > 0 &&
        draft.education.district.trim().length > 0 &&
        draft.education.building.trim().length > 0 &&
        draft.education.year.trim().length > 0
      );
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
                : 'Pick qualities you want and ones you want to avoid. You can toggle each list private or visible, and add your own tags.'}
            </Text>
          </View>
        ) : null}

        {step?.kind === 'education' ? (
          <View style={styles.block}>
            <Text style={[styles.kicker, { color: colors.blueGrotto }]}>Part 1 · Education</Text>
            <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
              Where do you go to school?
            </Text>
            <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
              School, district, and building — so roommates know where you are on campus.
            </Text>
            <TextInput
              value={draft.education.school}
              onChangeText={(text) =>
                setDraft((current) => ({
                  ...current,
                  education: { ...current.education, school: text },
                }))
              }
              placeholder="School (e.g. ASU Tempe)"
              placeholderTextColor={`${colors.blueIris}88`}
              style={[styles.input, { color: colors.blueIris, backgroundColor: colors.surface }]}
            />
            <TextInput
              value={draft.education.district}
              onChangeText={(text) =>
                setDraft((current) => ({
                  ...current,
                  education: { ...current.education, district: text },
                }))
              }
              placeholder="District (e.g. Barrett)"
              placeholderTextColor={`${colors.blueIris}88`}
              style={[styles.input, { color: colors.blueIris, backgroundColor: colors.surface }]}
            />
            <TextInput
              value={draft.education.building}
              onChangeText={(text) =>
                setDraft((current) => ({
                  ...current,
                  education: { ...current.education, building: text },
                }))
              }
              placeholder="Building (e.g. Barrett)"
              placeholderTextColor={`${colors.blueIris}88`}
              style={[styles.input, { color: colors.blueIris, backgroundColor: colors.surface }]}
            />
            <Text style={[styles.customLabel, { color: colors.blueGrotto }]}>Year</Text>
            <View style={styles.chips}>
              {YEAR_OPTIONS.map((year) => {
                const selected = draft.education.year === year;
                return (
                  <Pressable
                    key={year}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        education: { ...current.education, year },
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
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
          <PreferenceTagsStep
            titleSize={titleSize}
            bodySize={bodySize}
            colors={colors}
            onAccent={onAccent}
            title="What do you want in a roommate?"
            isPrivate={draft.roommateLikesPrivate}
            onPrivateChange={(value) =>
              setDraft((current) => ({ ...current, roommateLikesPrivate: value }))
            }
            options={ROOMMATE_LIKE_OPTIONS}
            selected={draft.roommateLikes}
            onToggle={(item) =>
              setDraft((current) => ({
                ...current,
                roommateLikes: toggleItem(current.roommateLikes, item),
              }))
            }
            customValue={customLikes}
            onCustomChange={setCustomLikes}
            onAddCustom={() => {
              if (!customLikes.trim()) {
                return;
              }
              setDraft((current) => ({
                ...current,
                roommateLikes: addCustomTags(current.roommateLikes, customLikes),
              }));
              setCustomLikes('');
            }}
            selectedColor={colors.blueGrotto}
          />
        ) : null}

        {step?.kind === 'dislikes' ? (
          <PreferenceTagsStep
            titleSize={titleSize}
            bodySize={bodySize}
            colors={colors}
            onAccent={onAccent}
            title="What would you dislike in a roommate?"
            isPrivate={draft.roommateDislikesPrivate}
            onPrivateChange={(value) =>
              setDraft((current) => ({ ...current, roommateDislikesPrivate: value }))
            }
            options={ROOMMATE_DISLIKE_OPTIONS}
            selected={draft.roommateDislikes}
            onToggle={(item) =>
              setDraft((current) => ({
                ...current,
                roommateDislikes: toggleItem(current.roommateDislikes, item),
              }))
            }
            customValue={customDislikes}
            onCustomChange={setCustomDislikes}
            onAddCustom={() => {
              if (!customDislikes.trim()) {
                return;
              }
              setDraft((current) => ({
                ...current,
                roommateDislikes: addCustomTags(current.roommateDislikes, customDislikes),
              }));
              setCustomDislikes('');
            }}
            selectedColor={colors.roseQuartz}
          />
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

function PreferenceTagsStep({
  titleSize,
  bodySize,
  colors,
  onAccent,
  title,
  isPrivate,
  onPrivateChange,
  options,
  selected,
  onToggle,
  customValue,
  onCustomChange,
  onAddCustom,
  selectedColor,
}: {
  titleSize: number;
  bodySize: number;
  colors: {
    blueGrotto: string;
    blueIris: string;
    surface: string;
    ivory: string;
    roseQuartz: string;
  };
  onAccent: string;
  title: string;
  isPrivate: boolean;
  onPrivateChange: (value: boolean) => void;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
  onAddCustom: () => void;
  selectedColor: string;
}) {
  const chips = Array.from(new Set([...options, ...selected]));
  const accent = isPrivate ? colors.roseQuartz : colors.blueGrotto;

  return (
    <View style={styles.block}>
      <Text style={[styles.kicker, { color: accent }]}>
        Part 2 · {isPrivate ? 'Private' : 'Visible'}
      </Text>
      <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>{title}</Text>
      <Text style={[styles.body, { fontSize: bodySize, color: colors.blueIris }]}>
        {isPrivate
          ? 'Only you see this list. It can still quietly steer recommendations.'
          : 'This list shows on your profile for other roommates to see.'}
      </Text>

      <View style={[styles.privacyRow, { backgroundColor: colors.surface }]}>
        <View style={styles.privacyCopy}>
          <Text style={[styles.privacyTitle, { color: colors.blueIris }]}>
            {isPrivate ? 'Private' : 'Visible on profile'}
          </Text>
          <Text style={[styles.privacyHint, { color: colors.blueGrotto }]}>
            Toggle whether other people can see these tags
          </Text>
        </View>
        <Switch
          value={isPrivate}
          onValueChange={onPrivateChange}
          trackColor={{ false: colors.blueGrotto, true: colors.roseQuartz }}
          thumbColor={colors.ivory}
        />
      </View>

      <View style={styles.chips}>
        {chips.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <Pressable
              key={item}
              onPress={() => onToggle(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? selectedColor : colors.surface,
                },
              ]}
            >
              <Text
                style={[styles.chipText, { color: isSelected ? onAccent : colors.blueIris }]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.customLabel, { color: colors.blueGrotto }]}>
        Add your own (comma separated)
      </Text>
      <View style={styles.customRow}>
        <TextInput
          value={customValue}
          onChangeText={onCustomChange}
          placeholder="e.g. cooks often, plant parent"
          placeholderTextColor={`${colors.blueIris}88`}
          style={[
            styles.customInput,
            {
              color: colors.blueIris,
              backgroundColor: colors.surface,
              fontSize: bodySize,
            },
          ]}
          onSubmitEditing={onAddCustom}
          returnKeyType="done"
        />
        <Pressable
          onPress={onAddCustom}
          style={[styles.plusButton, { backgroundColor: accent }]}
          accessibilityLabel="Add tags"
        >
          <Ionicons name="add" size={24} color={onAccent} />
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
  privacyRow: {
    ...reset,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyCopy: {
    ...reset,
    flex: 1,
    gap: 2,
  },
  privacyTitle: {
    ...reset,
    fontWeight: '700',
    fontSize: 15,
  },
  privacyHint: {
    ...reset,
    fontSize: 12,
    fontWeight: '500',
  },
  customLabel: {
    ...reset,
    marginTop: 4,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  customRow: {
    ...reset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    ...reset,
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  plusButton: {
    ...reset,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
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
