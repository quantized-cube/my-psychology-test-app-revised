export type QuestionRow = {
  id: number;
  group: string;
  text: string;
  reverse: boolean;
};

export const questionRows: QuestionRow[] = [
  {
    "id": 1,
    "group": "",
    "text": "不確かな状況は好きではない。",
    "reverse": false
  },
  {
    "id": 2,
    "group": "",
    "text": "答えがいくつもあるような質問は嫌いだ。",
    "reverse": false
  },
  {
    "id": 3,
    "group": "",
    "text": "規則正しい生活が自分の性格に合っていると感じる。",
    "reverse": false
  },
  {
    "id": 4,
    "group": "",
    "text": "なぜ出来事が起きたのか理由がわからないと落ち着かない。",
    "reverse": false
  },
  {
    "id": 5,
    "group": "",
    "text": "集団の中で一人だけ違う意見を言う人を見るとイライラする。",
    "reverse": false
  },
  {
    "id": 6,
    "group": "",
    "text": "何が起こるかわからない状況に飛び込むのは好きではない。",
    "reverse": false
  },
  {
    "id": 7,
    "group": "",
    "text": "決断をすると安心する。",
    "reverse": false
  },
  {
    "id": 8,
    "group": "",
    "text": "問題に直面したとき、すぐに解決したくてたまらなくなる。",
    "reverse": false
  },
  {
    "id": 9,
    "group": "",
    "text": "問題にすぐ解決策が見つからないと、いらいらする。",
    "reverse": false
  },
  {
    "id": 10,
    "group": "",
    "text": "予測不能な行動をする人とは一緒にいたくない。",
    "reverse": false
  },
  {
    "id": 11,
    "group": "",
    "text": "解釈がいくつもできるような発言は好きではない。",
    "reverse": false
  },
  {
    "id": 12,
    "group": "",
    "text": "一貫したルーティンを作ると、生活がより楽しくなると感じる。",
    "reverse": false
  },
  {
    "id": 13,
    "group": "",
    "text": "明確で構造化された生活様式が好きだ。",
    "reverse": false
  },
  {
    "id": 14,
    "group": "",
    "text": "自分の意見を持つ前に多くの人の意見を聞くことはあまりない。",
    "reverse": false
  },
  {
    "id": 15,
    "group": "",
    "text": "予測不能な状況は嫌いだ。",
    "reverse": false
  }
];

export const questions = questionRows.map((row) => row.text);

export const reverseItems = questionRows.flatMap((row, index) => (
  row.reverse ? [index] : []
));

export const groupLabels = [];

export const questionGroups = [];
