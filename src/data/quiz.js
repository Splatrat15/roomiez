/** Part 1 = about you. Part 2 = roommate likes/dislikes (matching signal). */

/** Profile pencil targets → quiz landing spots. */
export const QUIZ_SECTIONS = {
  about: 'about',
  education: 'education',
  hobbies: 'hobbies',
  lifestyle: 'lifestyle',
  likes: 'likes',
  dislikes: 'dislikes',
};

export const YEAR_OPTIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

export const HOBBY_OPTIONS = [
  'Cooking',
  'Gaming',
  'Gym',
  'Reading',
  'Music',
  'Movies',
  'Hiking',
  'Art',
  'Sports',
  'Photography',
  'Studying',
  'Coffee runs',
];

export const ROOMMATE_LIKE_OPTIONS = [
  'Clean & tidy',
  'Quiet at night',
  'Good communicator',
  'Respects privacy',
  'Shares groceries',
  'Early riser',
  'Night owl energy',
  'Social but chill',
  'Study-focused',
  'Pet friendly',
  'Handles chores fairly',
  'Low drama',
];

export const ROOMMATE_DISLIKE_OPTIONS = [
  'Messy common areas',
  'Loud after midnight',
  'Surprise guests',
  'Ignores chores',
  'Uses my stuff',
  'Smoking indoors',
  'Constant parties',
  'No communication',
  'Leaves dishes out',
  'Overly clingy',
  'Ignores quiet hours',
  'Unreliable with rent',
];

export const ABOUT_QUESTIONS = [
  {
    id: 'cleanliness',
    type: 'scale',
    prompt: 'How clean do you keep your space?',
    min: 1,
    max: 5,
    minLabel: 'Relaxed',
    maxLabel: 'Spotless',
  },
  {
    id: 'roommateCloseness',
    type: 'single',
    prompt: 'What are you looking for in a roommate?',
    options: ['Close friends', 'Acquaintances', 'Distance'],
  },
  {
    id: 'guests',
    type: 'single',
    prompt: 'Are you okay with your roommate having guests or friends over?',
    options: [
      'Yes',
      'Occasionally, but please let me know beforehand',
      'No',
    ],
  },
  {
    id: 'affection',
    type: 'single',
    prompt:
      'What is your comfort level with your roommate showing affection toward their partner in shared spaces?',
    options: [
      'I am comfortable with affection in shared spaces',
      'I am comfortable with brief or low-level affection only',
      'I prefer no affection in shared spaces',
    ],
  },
  {
    id: 'quietStudy',
    type: 'single',
    prompt: 'Do you prefer a study location that is quiet and without distractions?',
    options: [
      'I need a quiet space',
      'Some background noise is fine',
      'I can study almost anywhere',
    ],
  },
  {
    id: 'schedule',
    type: 'single',
    prompt: 'When do you usually start your day?',
    options: ['Morning – I am an early bird', 'Afternoon starter', 'Night owl'],
  },
  {
    id: 'pastMidnight',
    type: 'single',
    prompt: 'Do you prefer to stay up beyond midnight?',
    options: ['No, I enjoy my rest', 'Sometimes', 'Yes, nights are my time'],
  },
  {
    id: 'animals',
    type: 'single',
    prompt:
      'Do you have any restrictions or preferences that would affect having animals in your living environment?',
    options: [
      'I do not have restrictions related to living in a space with animals',
      'Okay with animals if they are well cared for',
      'Prefer no animals in the home',
      'Cannot live with animals',
    ],
  },
  {
    id: 'sleepNeeds',
    type: 'single',
    prompt:
      'Do you have any preferences or needs related to your sleeping arrangements that your roommate should be aware of?',
    options: [
      'No, I don’t have any specific needs or preferences related to my sleep environment',
      'I need a quiet room to sleep',
      'I am a light sleeper',
      'I prefer blackout / dark sleeping spaces',
    ],
  },
  {
    id: 'medicalConditions',
    type: 'text',
    prompt: 'Medical conditions your roommate should know about (optional)',
    placeholder: 'OCD, asthma, none, …',
  },
  {
    id: 'allergies',
    type: 'allergies',
    prompt: 'Do you have any allergies?',
  },
  {
    id: 'expressYourself',
    type: 'text',
    prompt: 'Express yourself — anything else?',
    placeholder: 'Tell future roommates who you are…',
  },
  {
    id: 'oneWordDescribeMe',
    type: 'text',
    prompt: 'One word to describe me',
    placeholder: 'Just for fun — one word…',
  },
];
