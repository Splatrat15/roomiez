/**
 * Message helpers. Threads are created when you swipe right (see MessagesProvider).
 * sender: 'me' | 'them'
 */

export function getLastMessage(conversation) {
  return conversation?.messages?.[conversation.messages.length - 1];
}

export function formatPreview(conversation, label) {
  const last = getLastMessage(conversation);
  if (!last) {
    return 'No messages yet';
  }

  const who = last.sender === 'me' ? 'You' : label;
  return `${who}: ${last.text}`;
}

export function groupTitleFromNames(names) {
  if (!names.length) {
    return 'Group chat';
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }
  return `${names[0]}, ${names[1]} +${names.length - 2}`;
}
