/**
 * Logged-in user profile (Profile tab).
 * Photo: assets/images/robert.jpg
 *
 * about = Part 1 questionnaire answers (visible)
 * education = school / district / building / year (visible)
 * hobbies = Part 1 (visible)
 * roommateLikes / roommateDislikes = Part 2 matching tags
 * roommateLikesPrivate / roommateDislikesPrivate = per-list visibility
 */
export const defaultEducation = {
  school: 'ASU',
  district: 'Tempe',
  building: 'Barrett',
  year: 'Freshman',
};

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
  name: 'Robert Thiel',
  age: 18,
  gender: 'Man',
  description:
    'Just graduated and heading into freshman year. Looking for a chill roommate — early classes, clean kitchen, weekend coffee runs. Fair on rent and groceries.',
  image: require('../../assets/images/robert.jpg'),
  education: { ...defaultEducation },
  hobbies: ['Coffee runs', 'Gym', 'Studying'],
  about: { ...defaultAbout },
  roommateLikes: ['Clean & tidy', 'Good communicator', 'Handles chores fairly'],
  roommateDislikes: ['Messy common areas', 'Surprise guests', 'Ignores quiet hours'],
  roommateLikesPrivate: false,
  roommateDislikesPrivate: true,
  quizCompleted: false,
};

export function createEmptyQuizDraft() {
  return {
    education: {
      school: '',
      district: '',
      building: '',
      year: '',
    },
    hobbies: /** @type {string[]} */ ([]),
    about: {
      ...defaultAbout,
      allergies: { has: false, details: '' },
    },
    roommateLikes: /** @type {string[]} */ ([]),
    roommateDislikes: /** @type {string[]} */ ([]),
    roommateLikesPrivate: false,
    roommateDislikesPrivate: true,
  };
}
