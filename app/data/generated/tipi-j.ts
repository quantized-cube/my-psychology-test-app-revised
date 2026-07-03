export type QuestionRow = {
  id: number;
  group: string;
  text: string;
  reverse: boolean;
};

export const questionRows: QuestionRow[] = [
  {
    "id": 1,
    "group": "外向性",
    "text": "活発で、外向的だと思う",
    "reverse": false
  },
  {
    "id": 2,
    "group": "協調性",
    "text": "他人に不満をもち、もめごとを起こしやすいと思う",
    "reverse": true
  },
  {
    "id": 3,
    "group": "勤勉性",
    "text": "しっかりしていて、自分に厳しいと思う",
    "reverse": false
  },
  {
    "id": 4,
    "group": "神経症傾向",
    "text": "心配性で、うろたえやすいと思う",
    "reverse": false
  },
  {
    "id": 5,
    "group": "開放性",
    "text": "新しいことが好きで、変わった考えをもつと思う",
    "reverse": false
  },
  {
    "id": 6,
    "group": "外向性",
    "text": "ひかえめで、おとなしいと思う",
    "reverse": true
  },
  {
    "id": 7,
    "group": "協調性",
    "text": "人に気をつかう、やさしい人間だと思う",
    "reverse": false
  },
  {
    "id": 8,
    "group": "勤勉性",
    "text": "だらしなく、うっかりしていると思う",
    "reverse": true
  },
  {
    "id": 9,
    "group": "神経症傾向",
    "text": "冷静で、気分が安定していると思う",
    "reverse": true
  },
  {
    "id": 10,
    "group": "開放性",
    "text": "発想力に欠けた、平凡な人間だと思う",
    "reverse": true
  }
];

export const questions = questionRows.map((row) => row.text);

export const reverseItems = questionRows.flatMap((row, index) => (
  row.reverse ? [index] : []
));

export const groupLabels = [
  "外向性",
  "協調性",
  "勤勉性",
  "神経症傾向",
  "開放性"
];

export const questionGroups = [
  [
    "活発で、外向的だと思う",
    "ひかえめで、おとなしいと思う"
  ],
  [
    "他人に不満をもち、もめごとを起こしやすいと思う",
    "人に気をつかう、やさしい人間だと思う"
  ],
  [
    "しっかりしていて、自分に厳しいと思う",
    "だらしなく、うっかりしていると思う"
  ],
  [
    "心配性で、うろたえやすいと思う",
    "冷静で、気分が安定していると思う"
  ],
  [
    "新しいことが好きで、変わった考えをもつと思う",
    "発想力に欠けた、平凡な人間だと思う"
  ]
];
