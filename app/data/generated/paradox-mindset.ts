export type QuestionRow = {
  id: number;
  group: string;
  text: string;
  reverse: boolean;
};

export const questionRows: QuestionRow[] = [
  {
    "id": 1,
    "group": "tension",
    "text": "時として、同時に現れたら矛盾しているように見える2つの考えを、心に抱くことがある",
    "reverse": false
  },
  {
    "id": 2,
    "group": "tension",
    "text": "相反する要求の両方を同時に対処しなければならないことがよくある",
    "reverse": false
  },
  {
    "id": 3,
    "group": "tension",
    "text": "相互に矛盾する目標を持つことがよくある",
    "reverse": false
  },
  {
    "id": 4,
    "group": "tension",
    "text": "矛盾する要求の両方に応えなければいけない場面にたびたび遭遇する",
    "reverse": false
  },
  {
    "id": 5,
    "group": "tension",
    "text": "私の仕事は緊張と矛盾に満ちている",
    "reverse": false
  },
  {
    "id": 6,
    "group": "tension",
    "text": "対立する選択肢のどちらかに決めなければならないことがよくある",
    "reverse": false
  },
  {
    "id": 7,
    "group": "tension",
    "text": "私の考える問題の解決策は、たいてい矛盾しているように見える",
    "reverse": false
  },
  {
    "id": 8,
    "group": "paradox",
    "text": "相いれない複数の視点を持った方が、物事をよく理解できると思う",
    "reverse": false
  },
  {
    "id": 9,
    "group": "paradox",
    "text": "相いれない要求に同時に応えることは苦にならない",
    "reverse": false
  },
  {
    "id": 10,
    "group": "paradox",
    "text": "矛盾を受け入れることは、私が成功するのに必要なことだ",
    "reverse": false
  },
  {
    "id": 11,
    "group": "paradox",
    "text": "矛盾したアイデアに遭遇することは、自身の活力になる",
    "reverse": false
  },
  {
    "id": 12,
    "group": "paradox",
    "text": "相互に矛盾する複数の目標をなんとかやり遂げようとしている時に楽しさを感じる",
    "reverse": false
  },
  {
    "id": 13,
    "group": "paradox",
    "text": "相いれない要求の両方を同時に受け入れることは、私自身よく経験している",
    "reverse": false
  },
  {
    "id": 14,
    "group": "paradox",
    "text": "相互に矛盾するような仕事に取り組むことに抵抗がない",
    "reverse": false
  },
  {
    "id": 15,
    "group": "paradox",
    "text": "相反する2つのことが両立できると感じると気分が高まる",
    "reverse": false
  },
  {
    "id": 16,
    "group": "paradox",
    "text": "矛盾する問題をなんとか対処できた時に活力を感じる",
    "reverse": false
  }
];

export const questions = questionRows.map((row) => row.text);

export const reverseItems = questionRows.flatMap((row, index) => (
  row.reverse ? [index] : []
));

export const groupLabels = [
  "tension",
  "paradox"
];

export const questionGroups = [
  [
    "時として、同時に現れたら矛盾しているように見える2つの考えを、心に抱くことがある",
    "相反する要求の両方を同時に対処しなければならないことがよくある",
    "相互に矛盾する目標を持つことがよくある",
    "矛盾する要求の両方に応えなければいけない場面にたびたび遭遇する",
    "私の仕事は緊張と矛盾に満ちている",
    "対立する選択肢のどちらかに決めなければならないことがよくある",
    "私の考える問題の解決策は、たいてい矛盾しているように見える"
  ],
  [
    "相いれない複数の視点を持った方が、物事をよく理解できると思う",
    "相いれない要求に同時に応えることは苦にならない",
    "矛盾を受け入れることは、私が成功するのに必要なことだ",
    "矛盾したアイデアに遭遇することは、自身の活力になる",
    "相互に矛盾する複数の目標をなんとかやり遂げようとしている時に楽しさを感じる",
    "相いれない要求の両方を同時に受け入れることは、私自身よく経験している",
    "相互に矛盾するような仕事に取り組むことに抵抗がない",
    "相反する2つのことが両立できると感じると気分が高まる",
    "矛盾する問題をなんとか対処できた時に活力を感じる"
  ]
];
