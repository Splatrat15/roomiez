/**
 * Inbox threads. profileId maps to src/data/data.js.
 * 2 women + 1 man: Chloe (6), Maya (7), Ethan (1).
 * sender: 'me' | 'them'
 */
export const conversations = [
  {
    id: '6',
    profileId: 6,
    messages: [
      {
        id: '6-1',
        sender: 'me',
        text: 'Hey Chloe! Saw you like cozy mornings too. Still looking for a roommate?',
      },
      {
        id: '6-2',
        sender: 'them',
        text: 'Yes!! I need someone chill who will not judge my book stacks.',
      },
      {
        id: '6-3',
        sender: 'me',
        text: 'Deal. Want to grab coffee near campus this week?',
      },
      {
        id: '6-4',
        sender: 'them',
        text: 'Thursday after class works. The little cafe by the library?',
      },
      {
        id: '6-5',
        sender: 'me',
        text: 'Perfect. I will bring the spreadsheet of chore ideas lol',
      },
      {
        id: '6-6',
        sender: 'them',
        text: 'Obsessed. See you Thursday!',
      },
    ],
  },
  {
    id: '7',
    profileId: 7,
    messages: [
      {
        id: '7-1',
        sender: 'them',
        text: 'yo you skate too or just vibing with the board pics?',
      },
      {
        id: '7-2',
        sender: 'me',
        text: 'I skate a little. Mostly cruise campus. You free this weekend?',
      },
      {
        id: '7-3',
        sender: 'them',
        text: 'Saturday morning at the underpass spot. Bring water.',
      },
      {
        id: '7-4',
        sender: 'me',
        text: 'Bet. Also are you still looking for a place for next term?',
      },
      {
        id: '7-5',
        sender: 'them',
        text: 'Yeah. Quiet nights are good with me as long as weekends can be social.',
      },
      {
        id: '7-6',
        sender: 'me',
        text: 'Same energy. Talk more after we skate?',
      },
      {
        id: '7-7',
        sender: 'them',
        text: 'for sure 🛹',
      },
    ],
  },
  {
    id: '1',
    profileId: 1,
    messages: [
      {
        id: '1-1',
        sender: 'me',
        text: 'Ethan, your kitchen-labels energy is elite. Still need a roommate?',
      },
      {
        id: '1-2',
        sender: 'them',
        text: 'Always. I am very serious about the coffee rotation schedule.',
      },
      {
        id: '1-3',
        sender: 'me',
        text: 'I can live with that. Budget around campus housing ok?',
      },
      {
        id: '1-4',
        sender: 'them',
        text: 'Yep. I found a 2bed a few blocks off Main if you want the listing.',
      },
      {
        id: '1-5',
        sender: 'me',
        text: 'Send it. I can tour Wednesday afternoon.',
      },
      {
        id: '1-6',
        sender: 'them',
        text: 'Sent. Wear shoes you can walk in, the agent moves fast.',
      },
    ],
  },
];

export function getConversation(id) {
  return conversations.find((conversation) => String(conversation.id) === String(id));
}

export function getLastMessage(conversation) {
  return conversation.messages[conversation.messages.length - 1];
}

export function formatPreview(conversation, firstName) {
  const last = getLastMessage(conversation);
  if (!last) {
    return 'No messages yet';
  }

  const who = last.sender === 'me' ? 'You' : firstName;
  return `${who}: ${last.text}`;
}
