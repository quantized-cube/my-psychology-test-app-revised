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
    "text": "私はしばしば、周囲の自然界との一体感を感じることがあります。",
    "reverse": false
  },
  {
    "id": 2,
    "group": "",
    "text": "私は自然界を、自分が属しているコミュニティとして考えています。",
    "reverse": false
  },
  {
    "id": 3,
    "group": "",
    "text": "私は他の生き物たちの知性を認識し、尊重しています。",
    "reverse": false
  },
  {
    "id": 4,
    "group": "",
    "text": "私はしばしば、自然から切り離されているように感じます。",
    "reverse": true
  },
  {
    "id": 5,
    "group": "",
    "text": "自分の人生について考えるとき、私はより大きな「生の循環プロセス」の一部だと感じます。",
    "reverse": false
  },
  {
    "id": 6,
    "group": "",
    "text": "私はしばしば、動物や植物と親しみを感じます。",
    "reverse": false
  },
  {
    "id": 7,
    "group": "",
    "text": "私は地球が私に属するのと同じように、私も地球に属していると感じます。",
    "reverse": false
  },
  {
    "id": 8,
    "group": "",
    "text": "自分の行動が自然界にどのような影響を与えるかについて、深い理解があります。",
    "reverse": false
  },
  {
    "id": 9,
    "group": "",
    "text": "私はしばしば、生命のネットワークの一部であると感じます。",
    "reverse": false
  },
  {
    "id": 10,
    "group": "",
    "text": "私は、人間もそうでない存在も、すべての地球上の生命が共通の「生命力」を共有していると感じます。",
    "reverse": false
  },
  {
    "id": 11,
    "group": "",
    "text": "木が森の一部であるように、私は広い自然界の中に埋め込まれていると感じます。",
    "reverse": false
  },
  {
    "id": 12,
    "group": "",
    "text": "地球上の自分の位置を考えると、私は自然の中で最上位にいる存在だと思います。",
    "reverse": true
  },
  {
    "id": 13,
    "group": "",
    "text": "私はしばしば、自分が周囲の自然界の中でほんの小さな存在であり、地面の草や木の上の鳥と同じように重要なのだと感じます。",
    "reverse": false
  },
  {
    "id": 14,
    "group": "",
    "text": "私自身の幸福は、自然界の幸福とは関係がないと思います。",
    "reverse": true
  }
];

export const questions = questionRows.map((row) => row.text);

export const reverseItems = questionRows.flatMap((row, index) => (
  row.reverse ? [index] : []
));

export const groupLabels = [];

export const questionGroups = [];
