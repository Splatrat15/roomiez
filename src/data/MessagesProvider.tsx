import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { profiles } from '@/data/data';
import {
  formatPreview,
  getLastMessage,
  groupTitleFromNames,
} from '@/data/messages';

export type ChatMessage = {
  id: string;
  sender: 'me' | 'them';
  text: string;
};

export type Conversation = {
  id: string;
  profileId?: number;
  isGroup?: boolean;
  title?: string;
  memberIds?: number[];
  messages: ChatMessage[];
  notes?: string;
  blocked?: boolean;
  reported?: boolean;
};

type MessagesContextValue = {
  conversations: Conversation[];
  likedProfileIds: number[];
  matchedProfiles: typeof profiles;
  isLiked: (profileId: number) => boolean;
  likeProfile: (profileId: number) => void;
  unlikeProfile: (profileId: number) => void;
  getConversation: (id: string | undefined) => Conversation | undefined;
  createGroupChat: (memberIds: number[], title?: string) => Conversation;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  setConversationNotes: (conversationId: string, notes: string) => void;
  blockConversation: (conversationId: string) => void;
  unblockConversation: (conversationId: string) => void;
  reportConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

function updateConversation(
  current: Conversation[],
  conversationId: string,
  updater: (conversation: Conversation) => Conversation,
) {
  return current.map((conversation) =>
    String(conversation.id) === String(conversationId) ? updater(conversation) : conversation,
  );
}

function starterConversation(profileId: number): Conversation | null {
  const profile = profiles.find((person) => person.id === profileId);
  if (!profile) {
    return null;
  }

  const first = profile.name.split(' ')[0] ?? profile.name;
  return {
    id: String(profileId),
    profileId,
    notes: '',
    blocked: false,
    reported: false,
    messages: [
      {
        id: `${profileId}-match`,
        sender: 'them',
        text: `You matched with ${first}! Say hi and talk roommates.`,
      },
    ],
  };
}

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [likedProfileIds, setLikedProfileIds] = useState<number[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const matchedProfiles = useMemo(
    () => profiles.filter((person) => likedProfileIds.includes(person.id)),
    [likedProfileIds],
  );

  const value = useMemo<MessagesContextValue>(
    () => ({
      conversations,
      likedProfileIds,
      matchedProfiles,
      isLiked: (profileId) => likedProfileIds.includes(profileId),
      likeProfile: (profileId) => {
        setLikedProfileIds((current) =>
          current.includes(profileId) ? current : [...current, profileId],
        );
        setConversations((current) => {
          if (current.some((conversation) => conversation.profileId === profileId && !conversation.isGroup)) {
            return current;
          }
          const created = starterConversation(profileId);
          return created ? [created, ...current] : current;
        });
      },
      unlikeProfile: (profileId) => {
        setLikedProfileIds((current) => current.filter((id) => id !== profileId));
        setConversations((current) =>
          current.filter((conversation) => {
            if (conversation.isGroup) {
              return true;
            }
            return conversation.profileId !== profileId;
          }),
        );
      },
      getConversation: (id) =>
        conversations.find((conversation) => String(conversation.id) === String(id)),
      createGroupChat: (memberIds, title) => {
        const allowed = memberIds.filter((id) => likedProfileIds.includes(id));
        const members = allowed
          .map((id) => profiles.find((person) => person.id === id))
          .filter(Boolean);
        const names = members.map((person) => person!.name.split(' ')[0] ?? person!.name);
        const conversation: Conversation = {
          id: `group-${Date.now()}`,
          isGroup: true,
          title: title?.trim() || groupTitleFromNames(names),
          memberIds: [...allowed],
          notes: '',
          blocked: false,
          reported: false,
          messages: [
            {
              id: `group-start-${Date.now()}`,
              sender: 'them',
              text: `Group created with ${names.join(', ') || 'no one yet'}.`,
            },
          ],
        };

        setConversations((current) => [conversation, ...current]);
        return conversation;
      },
      appendMessage: (conversationId, message) => {
        setConversations((current) => {
          const index = current.findIndex(
            (conversation) => String(conversation.id) === String(conversationId),
          );
          if (index < 0) {
            return current;
          }

          if (current[index].blocked) {
            return current;
          }

          const updated: Conversation = {
            ...current[index],
            messages: [...current[index].messages, message],
          };

          return [updated, ...current.filter((_, i) => i !== index)];
        });
      },
      setConversationNotes: (conversationId, notes) => {
        setConversations((current) =>
          updateConversation(current, conversationId, (conversation) => ({
            ...conversation,
            notes,
          })),
        );
      },
      blockConversation: (conversationId) => {
        setConversations((current) =>
          updateConversation(current, conversationId, (conversation) => ({
            ...conversation,
            blocked: true,
          })),
        );
      },
      unblockConversation: (conversationId) => {
        setConversations((current) =>
          updateConversation(current, conversationId, (conversation) => ({
            ...conversation,
            blocked: false,
          })),
        );
      },
      reportConversation: (conversationId) => {
        setConversations((current) =>
          updateConversation(current, conversationId, (conversation) => ({
            ...conversation,
            reported: true,
          })),
        );
      },
      deleteConversation: (conversationId) => {
        setConversations((current) => {
          const target = current.find(
            (conversation) => String(conversation.id) === String(conversationId),
          );
          if (target && !target.isGroup && target.profileId != null) {
            setLikedProfileIds((ids) => ids.filter((id) => id !== target.profileId));
          }
          return current.filter(
            (conversation) => String(conversation.id) !== String(conversationId),
          );
        });
      },
    }),
    [conversations, likedProfileIds, matchedProfiles],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider');
  }
  return context;
}

export { formatPreview, getLastMessage, groupTitleFromNames };
