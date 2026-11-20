import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { currentUser as seedUser, defaultAbout } from '@/data/user';

const STORAGE_KEY = 'roomiez.userProfile';

export type UserAbout = typeof defaultAbout;
export type UserProfile = typeof seedUser;

type QuizPayload = {
  hobbies: string[];
  about: UserAbout;
  roommateLikes: string[];
  roommateDislikes: string[];
  roommateLikesPrivate: boolean;
  roommateDislikesPrivate: boolean;
};

type UserContextValue = {
  user: UserProfile;
  ready: boolean;
  saveQuizAnswers: (payload: QuizPayload) => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(seedUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!alive || !raw) {
          return;
        }

        const saved = JSON.parse(raw) as Partial<UserProfile>;
        setUser((current) => ({
          ...current,
          ...saved,
          image: current.image,
          about: {
            ...defaultAbout,
            ...saved.about,
            allergies: {
              ...defaultAbout.allergies,
              ...saved.about?.allergies,
            },
          },
          hobbies: saved.hobbies ?? current.hobbies,
          roommateLikes: saved.roommateLikes ?? current.roommateLikes,
          roommateDislikes: saved.roommateDislikes ?? current.roommateDislikes,
          roommateLikesPrivate: saved.roommateLikesPrivate ?? current.roommateLikesPrivate,
          roommateDislikesPrivate:
            saved.roommateDislikesPrivate ?? current.roommateDislikesPrivate,
        }));
      })
      .finally(() => {
        if (alive) {
          setReady(true);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const saveQuizAnswers = async (payload: QuizPayload) => {
    setUser((current) => {
      const next: UserProfile = {
        ...current,
        hobbies: payload.hobbies,
        about: payload.about,
        roommateLikes: payload.roommateLikes,
        roommateDislikes: payload.roommateDislikes,
        roommateLikesPrivate: payload.roommateLikesPrivate,
        roommateDislikesPrivate: payload.roommateDislikesPrivate,
        description: payload.about.expressYourself.trim() || current.description,
        quizCompleted: true,
      };

      const { image: _image, ...persistable } = next;
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      saveQuizAnswers,
    }),
    [user, ready],
  );

  if (!ready) {
    return null;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return value;
}
