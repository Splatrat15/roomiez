import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { reset, useFluidSize } from '@/theme/main';

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const titleSize = useFluidSize(28);
  const bodySize = useFluidSize(15);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const top = Platform.OS === 'web' ? 12 : insets.top;
  const left = Platform.OS === 'web' ? 0 : insets.left;
  const right = Platform.OS === 'web' ? 0 : insets.right;

  const submit = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing info', 'Fill in name, email, and password to continue.');
      return;
    }

    Alert.alert('Account created', 'Filler success — no real account was created.', [
      { text: 'Nice', onPress: () => router.back() },
    ]);
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
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
        <Ionicons name="chevron-back" size={28} color={colors.blueGrotto} />
        <Text style={[styles.backLabel, { color: colors.blueGrotto }]}>Back</Text>
      </Pressable>

      <Text style={[styles.title, { fontSize: titleSize, color: colors.blueIris }]}>
        Create account
      </Text>
      <Text style={[styles.hint, { fontSize: bodySize, color: colors.blueGrotto }]}>
        Filler signup for now. Do not use a real password.
      </Text>

      <View style={styles.form}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={`${colors.blueIris}88`}
          style={[
            styles.input,
            {
              fontSize: bodySize,
              color: colors.blueIris,
              backgroundColor: colors.surface,
            },
          ]}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={`${colors.blueIris}88`}
          style={[
            styles.input,
            {
              fontSize: bodySize,
              color: colors.blueIris,
              backgroundColor: colors.surface,
            },
          ]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={`${colors.blueIris}88`}
          style={[
            styles.input,
            {
              fontSize: bodySize,
              color: colors.blueIris,
              backgroundColor: colors.surface,
            },
          ]}
        />

        <Pressable style={[styles.submit, { backgroundColor: colors.blueGrotto }]} onPress={submit}>
          <Text style={[styles.submitLabel, { color: colors.ivory }]}>Create account</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  hint: {
    ...reset,
    paddingHorizontal: 20,
    paddingTop: 8,
    lineHeight: 22,
  },
  form: {
    ...reset,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  input: {
    ...reset,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  submit: {
    ...reset,
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitLabel: {
    ...reset,
    fontWeight: '700',
    fontSize: 16,
  },
});
