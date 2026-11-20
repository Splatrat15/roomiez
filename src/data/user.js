/**
 * Logged-in user profile (Profile tab).
 * Photo: assets/images/robert.jpg
 *
 * about = Part 1 questionnaire answers (visible)
 * hobbies = Part 1 (visible)
 * roommateLikes = Part 2 wants (visible, feeds matching)
 * roommateDislikes = Part 2 avoids (hidden from other roommates)
 */
export const defaultAbout = {
  cleanliness: 3,
  roommateCloseness: 'Acquaintances',
  guests: 'Occasionally, but please let me know beforehand',
  affection: 'I am comfortable with brief or low-level affection only',
  quietStudy: 'I need a quiet space',
  schedule: 'Morning – I am an early bird',
  pastMidnight: 'No, I enjoy my rest',
  animals: 'I do not have restrictions related to living in a space with animals',
  sleepNeeds: 'No, I don’t have any specific needs or preferences related to my sleep environment',
  medicalConditions: '',
  allergies: {
    has: false,
    details: '',
  },
  expressYourself: '',
  oneWordDescribeMe: '',
};

export const currentUser = {
  id: 'me',
  username: 'robert.thiel',
  name: 'Robert Thiel',
  age: 18,
  gender: 'Man',
  description:
    'Just graduated and heading into freshman year. Looking for a chill roommate — early classes, clean kitchen, weekend coffee runs. Fair on rent and groceries.',
  image: require('../../assets/images/robert.jpg'),
  stats: {
    matches: 12,
    likes: 48,
    chats: 3,
  },
  hobbies: ['Coffee runs', 'Gym', 'Studying'],
  about: { ...defaultAbout },
  roommateLikes: ['Clean & tidy', 'Good communicator', 'Handles chores fairly'],
  roommateDislikes: ['Messy common areas', 'Surprise guests', 'Ignores quiet hours'],
  quizCompleted: false,
};

export function createEmptyQuizDraft() {
  return {
    hobbies: /** @type {string[]} */ ([]),
    about: {
      ...defaultAbout,
      allergies: { has: false, details: '' },
    },
    roommateLikes: /** @type {string[]} */ ([]),
    roommateDislikes: /** @type {string[]} */ ([]),
  };
}
