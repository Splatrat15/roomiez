import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { profiles } from '@/data/data';
import {
  formatPreview,
  getLastMessage,
  groupTitleFromNames,
  seedConversations,
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
};

type MessagesContextValue = {
  conversations: Conversation[];
  getConversation: (id: string | undefined) => Conversation | undefined;
  createGroupChat: (memberIds: number[], title?: string) => Conversation;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

function cloneSeed(): Conversation[] {
  return seedConversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender: message.sender === 'me' ? 'me' : 'them',
      text: message.text,
    })),
  }));
}

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => cloneSeed());

  const value = useMemo<MessagesContextValue>(
    () => ({
      conversations,
      getConversation: (id) =>
        conversations.find((conversation) => String(conversation.id) === String(id)),
      createGroupChat: (memberIds, title) => {
        const members = memberIds
          .map((id) => profiles.find((person) => person.id === id))
          .filter(Boolean);
        const names = members.map((person) => person!.name.split(' ')[0] ?? person!.name);
        const conversation: Conversation = {
          id: `group-${Date.now()}`,
          isGroup: true,
          title: title?.trim() || groupTitleFromNames(names),
          memberIds: [...memberIds],
          messages: [
            {
              id: `group-start-${Date.now()}`,
              sender: 'them',
              text: `Group created with ${names.join(', ')}.`,
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

          const updated: Conversation = {
            ...current[index],
            messages: [...current[index].messages, message],
          };

          return [updated, ...current.filter((_, i) => i !== index)];
        });
      },
    }),
    [conversations],
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
