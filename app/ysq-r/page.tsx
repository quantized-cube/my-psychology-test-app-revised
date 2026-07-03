'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { Bar } from 'react-chartjs-2'; // react-chartjs-2をインポート
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  'ED',
  'AB',
  'MA',
  'SI',
  'DS',
  'FA',
  'DI',
  'VH',
  'EM',
  'SB',
  'SS',
  'FLC',
  'EC',
  'US',
  'ET',
  'IS',
  'AS',
  'NP',
  'PUS',
  'PUO',
];

const dictLabels: { [key: string]: string } = {
  'ED': '愛情剥奪',
  'AB': '見捨てられ',
  'MA': '不信・虐待',
  'SI': '孤立',
  'DS': '欠陥・恥',
  'FA': '失敗',
  'DI': '無能・依存',
  'VH': 'すべてが怖い',
  'EM': '巻き込まれ',
  'SB': '服従',
  'SS': '自己犠牲',
  'FLC': '自己規制の失敗',
  'EC': '感情抑制',
  'US': '完璧主義',
  'ET': '俺様',
  'IS': 'コントロール不可能',
  'AS': 'ほめられたい',
  'NP': 'ネガティブ注意',
  'PUS': '罰するべき（自分）',
  'PUO': '罰するべき（他人）',
};

// 1-5: ED
const questions_1_ED = [
  "私は十分な愛と注目を浴びていない。",
  "ほとんどの場合、アドバイスや精神的なサポートをしてくれる頼れる人がいなかった。",
  "私の人生の大半は、私に近づき、多くの時間を一緒に過ごしたいと思う人がいなかった。",
  "私の人生の大半は、自分が誰かにとって特別な存在だとは感じてこなかった。",
  "どうしたらいいかわからないときに、的確なアドバイスや方向性を示してくれるような力強い人は、これまでほとんどいなかった。",
];

// 6-13: AB
const questions_2_AB = [
  "親しみを感じている人たちが私のもとを去ったり、私を見捨てたりするのではないかと心配になる。",
  "重要な人間関係が長続きするとは感じない。終わることを期待している。",
  "私は、献身的に私のそばにいることができないパートナーに依存していると感じる。",
  "私は、たとえ短時間であっても、誰かに一人にされると動揺してしまう。",
  "他の人たちと親しくなることはできない、なぜなら彼らがいつもそこにいると確信できないからだ。",
  "私の親しい人たちは、ある瞬間は私に優しく接してくれるが、次の瞬間には怒ったり、動揺したり、自己中心的になったり、ケンカをしたりと、とても予測がつかない。",
  "私は他人を必要とするあまり、他人を失うことを心配する。",
  "ありのままの自分でいることも、本当の気持ちを表現することもできない。さもないと、人々が私から離れてしまう。",
];

// 14-18: MA
const questions_3_MA = [
  "他人の前では油断できないし、そうしないとわざと傷つけられるような気がする。",
  "誰かが私を裏切るのは時間の問題だ。",
  "私は人を信じることがとても苦手だ。",
  "私は他人に“テスト”を課し、彼らが私に真実を語っているか、善意であるかを確認する。",
  "私はこう信じている： 「コントロールするか、されるかだ。」",
];

// 19-23: SI
const questions_4_SI = [
  "私は他の人とは根本的に違う。",
  "私は所属していない。私は一匹狼だ。",
  "私はいつもグループの外側にいると感じている。",
  "誰も私のことを本当には理解してくれない。",
  "私は時々、自分が宇宙人であるかのように感じることがある。",
];

// 24-29: DS
const questions_5_DS = [
  "本当の私を知ったら、私が望む人は誰も私のそばにいたいと思わないだろう。",
  "私は本質的に欠点があり、欠陥がある。",
  "私は愛すべき人間ではないと感じる。",
  "他人に自分をさらけ出すのは、とても基本的なところであまりにも受け入れられない。",
  "人に好かれると、自分が人を騙していると感じる。",
  "私を愛してくれる人がいるなんて理解できない。",
];

// 30-35: FA
const questions_6_FA = [
  "私が仕事（あるいは学校）でやっていることはほとんど、他の人がやっていることに比べれば、優れたものではない。",
  "仕事（あるいは学校）や業績の分野では、他のほとんどの人は私より能力がある。",
  "私は失敗作だ。",
  "私は仕事（あるいは学校）において、ほとんどの人ほど才能がない。",
  "私の業績は他の人たちに及ばないので、彼らと一緒にいて恥ずかしいと思うことがよくある。",
  "私はよく他の人と自分の業績を比べて、彼らの方がずっと成功していると感じる。",
];

// 36-43: DI
const questions_7_DI = [
  "日常生活で自分ひとりでやっていけるとは思えない。",
  "自分が自分の面倒を見るよりも、他人の方が自分の面倒を見ることができると信じている。",
  "指導してくれる人がいないと、仕事以外の新しいタスクに取り組むのは難しい。",
  "仕事（あるいは学校）以外でも、何をやっても失敗する。",
  "日常的な場面で自分の判断を信じると、間違った判断をしてしまう。",
  "現実的な問題についてアドバイスをくれる頼れる人が必要だと感じている。",
  "日常的な責任を果たすことに関しては、大人というより子供のように感じる。",
  "私は日常生活の責任に圧倒されている。",
];

// 44-49: VH
const questions_8_VH = [
  "災害（自然災害、犯罪災害、金融災害、医療災害）はいつ襲ってきてもおかしくないと感じている。",
  "私は攻撃されることを心配している。",
  "私は病気や怪我をしないように細心の注意を払っている。",
  "医師から深刻な病気とは診断されていないにもかかわらず、深刻な病気を発症しているのではないかと心配になる。",
  "犯罪や公害など、世界で起こっている悪いことをとても心配している。",
  "世界は危険な場所だと感じている。",
];

// 50-56: EM
const questions_9_EM = [
  "（両）親と私は、お互いの生活や問題に過干渉になりがちだ。",
  "（両）親と私にとって、裏切られたと感じたり、罪悪感を感じたりすることなく、親密な内容をお互いに隠しておくことは、とても難しい。",
  "（両）親と私はほとんど毎日話をしなければならず、そうしないとどちらかが罪悪感を感じたり、傷ついたり、失望したり、孤独を感じたりする。",
  "私はよく、自分には両親やパートナーとは別のアイデンティティがないと感じる。",
  "親しい人と距離を保つのはとても難しい。自分というものを切り離して考えることが苦手だ。",
  "（両）親やパートナーに対して、プライバシーがないと感じることがよくある。",
  "私が親元を離れて一人暮らしをすることについて、（両）親はとても傷ついているか、傷つくだろうと感じる。",
];

// 57- 61: SB
const questions_10_SB = [
  "自分のやりたいようにやっても、トラブルを招くだけだと思う。",
  "人間関係において、私は相手に優位に立たせている。",
  "私はいつも他人に選択を委ねてきたから、自分自身が何を望んでいるのか本当にわからない。",
  "他人に拒絶されないように、他人を喜ばせることをとても気にしている。",
  "私は対立を避けるためなら、普通の人よりもずっと手間を惜しまない。",
];

// 62-67: SS
const questions_11_SS = [
  "私は見返りを得るよりも、人に与えることの方が多い。",
  "私は普段、親しい人の面倒を見ることになる。",
  "どんなに忙しくても、人のために時間を割くことができる。",
  "私はいつも、みんなの悩みを聞く側だった。",
  "他の人たちは、私が他人のために尽くしすぎて、自分のために十分なことをしていないと見ている。",
  "いくら与えても足りないと感じる。",
];

// 68-71: FLC
const questions_12_FLC = [
  "自分の行動をコントロールできなくなることを心配している。",
  "怒りが抑えられなくなったら誰かに身体的または精神的に深刻な危害を加えるのではないかと心配になる。",
  "自分の感情や衝動をコントロールしなければ、何か悪いことが起こりそうな気がする。",
  "表現できない怒りや憤りが私の中に溜まっている。",
];

// 72-76:EC
const questions_13_EC = [
  "自意識過剰で、他人に肯定的な感情を示せない（愛情、気遣いを示すなど）。",
  "自分の気持ちを他人に伝えるのは恥ずかしいことだと思う。",
  "温かく自発的に行動するのは難しい。",
  "私は自分をコントロールしすぎて、感情的でないと思われてしまう。",
  "みんなは私のことを感情的に堅苦しいと見ている。",
];

// 77-83: US
const questions_14_US = [
  "私は自分のすることのほとんどで一番でなければならない。二番目は受け入れられない。",
  "私はほぼすべてのものを完璧な状態に保つよう努めている。",
  "やり遂げなければならないことが多すぎて、本当にリラックスする時間はほとんどない。",
  "私はすべての責任を果たさなければならない。",
  "私は自分の基準を満たすために、喜びや幸福を犠牲にすることが多い。",
  "自分のミスを簡単に見逃したり、言い訳をするわけにはいかない。",
  "自分のパフォーマンスに関しては、常にナンバーワンでなければならない。",
];

// 84-89: ET
const questions_15_ET = [
  "他の人に何かを求めるときに、「ノー」という答えを受け入れるのがとても苦手だ。",
  "私は束縛されたり、自分のやりたいことを妨げられたりするのが大嫌いだ。",
  "他の人がやっている普通のルールや慣習に従う必要はないと感じている。",
  "自分のことを優先するあまり、友人や家族に割く時間がないことがよくある。",
  "私はよく、物事の進め方についてとても支配的だと言われる。",
  "他人が私に指図するのは許せない。",
];

// 90-94: IS
const questions_16_IS = [
  "ルーチンワークや退屈な仕事をこなすために自分を律することができないようだ。",
  "私はしばしば、衝動を貫き、感情を表現してトラブルに巻き込まれたり、他の人を傷つけたりすることがある。",
  "私はすぐに飽きてしまう。",
  "仕事が難しくなると、私はたいてい我慢してやり遂げることができない。",
  "自分のためになるとわかっていても、楽しくないことを無理にすることはできない。",
  "私はこれまで、自分の決意を貫き通したことがほとんどない。",
  "私は衝動的に物事を行い、後で後悔することがよくある。",
];

// 97-101: AS
const questions_17_AS = [
  "知り合いのほとんど全員に好かれることは、私にとって重要だ。",
  "より好かれるように、一緒にいる人によって自分を変える。",
  "私の自尊心は、他人が私をどう見ているかにほとんど基づいている。",
  "たとえ誰かを好きじゃなかったとしても、その人に好かれたいと思う。",
  "他人から多くの注目を集めないと、自分はあまり重要でないと感じる。",
];

// 102-107: NP
const questions_18_NP = [
  "用心に越したことはない。ほとんどの場合、何かがうまくいかないものだ。",
  "決断を誤れば、大惨事につながるのではないかと心配だ。",
  "ミスを犯すと、その結果はとても深刻なものに思えるため、些細な決断にこだわることが多い。",
  "物事がうまくいかなくてもがっかりしないように、うまくいかないと想定した方が気が楽だ。",
  "私は悲観的になりがちだ。",
  "人が何かに熱中しすぎると、私は不愉快になり、何が問題になるかを警告したくなる。",
];

// 108-112: PUS
const questions_19_PUS = [
  "私がミスを犯せば、罰を受けるのは当然だ。",
  "私が間違いを犯しても言い訳はできない。",
  "もし私が仕事をしなければ、その結果に苦しむことになる。",
  "なぜ私がミスを犯したかは関係ない。間違ったことをしたら、その代償を払うべきだ。",
  "私は罰を受けるに値する悪人だ。",
];

// 113-116: PUO
const questions_20_PUO = [
  "自分の責任を果たさない人は、何らかの形で罰を受けるべきだ。",
  "たいていの場合、私は他人の言い訳を受け入れない。彼らはただ、責任を受け入れ、報いを受ける気がないだけだ。",
  "誰かが謝った後であっても、私は恨みを抱く。",
  "私は、人々が自分の言い訳をしたり、自分の問題を他人のせいにしたりすることに腹が立つ。",
];

const a_questions = [
  questions_1_ED,
  questions_2_AB,
  questions_3_MA,
  questions_4_SI,
  questions_5_DS,
  questions_6_FA,
  questions_7_DI,
  questions_8_VH,
  questions_9_EM,
  questions_10_SB,
  questions_11_SS,
  questions_12_FLC,
  questions_13_EC,
  questions_14_US,
  questions_15_ET,
  questions_16_IS,
  questions_17_AS,
  questions_18_NP,
  questions_19_PUS,
  questions_20_PUO,
];
const questions = a_questions.flat();

const lengths = a_questions.map((question) => question.length)
const cumLengths = [0, ...lengths.map((sum => value => sum += value)(0))]

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton = scores.every((score) => score !== 0); // scoresに0が含まれていないかチェック
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };

  const averageScores: number[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const start = cumLengths[i];
    const end = cumLengths[i + 1];
    const length = lengths[i];
    const averageScore = scores.slice(start, end).reduce((acc, score) => acc + score, 0) / length;
    averageScores.push(averageScore);
  }
  const pairLabelsAverageScores = labels.map((label, index) => [label, averageScores[index]]);
  // 一旦オブジェクトに変換
  const objLabelsAverageScores: { [key: string]: number } = Object.fromEntries(pairLabelsAverageScores);
  // キーを含んだ配列に変換
  const array = Object.keys(objLabelsAverageScores).map((k) => ({ key: k, value: objLabelsAverageScores[k] }));
  // スコアの降順
  array.sort((a, b) => b.value - a.value);
  // オブジェクトに戻す
  const sortedObjLabelsAverageScores = Object.assign({}, ...array.map((item) => ({
    [item.key]: item.value,
  })));
  // スコアの降順のラベル
  const sortedLabels = Object.keys(sortedObjLabelsAverageScores);
  // スコアの降順のスコア
  const sortedAverageScores = Object.values(sortedObjLabelsAverageScores);

  const resultMessages: string[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const resultMessage = `${labels[i]}のスコア ${averageScores[i].toFixed(2)}`;
    resultMessages.push(resultMessage);
  }

  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
  };

  const handleToggleSort = () => {
    // スコアのソート順を切り替える
    setSortDescending(!sortDescending);
  };

  // 棒グラフのデータ
  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 5,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 7,
        ticks: {
          stepSize: 1,
        },
        grid: {
          lineWidth: (ctx: any) => [4].includes(ctx.tick.value) ? 4 : 2,
        },
      }
    },
    plugins: {
      legend: {
        // position: 'right' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'あなたのスキーマの得点',
      },
    },
  };
  const barChartData = {
    labels: sortDescending ? sortedLabels : labels,
    datasets: [
      {
        label: 'スコア',
        data: sortDescending ? sortedAverageScores : averageScores,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: (context: any) => {
          const score: any = sortDescending
            ? sortedAverageScores[context.dataIndex]
            : averageScores[context.dataIndex];
          // スコアが4以上の場合に色を変える
          return score >= 4 ? 'rgba(200, 55, 80, 0.8)' : 'rgba(255, 99, 132, 0.4)';
        },
        borderWidth: 3,
        hoverBackgroundColor: (context: any) => {
          const score: any = sortDescending
            ? sortedAverageScores[context.dataIndex]
            : averageScores[context.dataIndex];
          // スコアが4以上の場合に色を変える
          return score >= 4 ? 'rgba(60, 150, 150, 0.8)' : 'rgba(80, 200, 200, 0.8)';
        },
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>YSQ-R</title>
        <meta name="description" content="Young Schema Questionnaire - Revised (YSQ-R)" />
      </Head>

      <main>
        <h1>YSQ-R</h1>
        <p>
          Young Schema Questionnaire - Revised
        </p>
        <p>
          以下に挙げるのは、誰かが自分自身を説明するために使いそうな文です。それぞれの文章を読んで、どの程度自分を表しているか判断してください。判断に迷う場合は、あなたが真実だと<strong>思う</strong>ことではなく、あなたが感情的に<strong>感じる</strong>ことを基にしてください。あなたを表す<strong>最も高い評価を1～6</strong>の中から選んでください。
        </p>
        <p>
          1 = まったく当てはまらない
        </p>
        <p>
          2 = ほとんど当てはまらない
        </p>
        <p>
          3 = どちらかと言えば当てはまる
        </p>
        <p>
          4 = まぁまぁ当てはまる
        </p>
        <p>
          5 = ほとんど当てはまる
        </p>
        <p>
          6 = 完璧に当てはまる
        </p>

        {questions.map((question, index) => (
          <div key={index}>
            {cumLengths.includes(index) && <hr style={{ margin: '30px' }} />}
            {cumLengths.includes(index) && <h2>{labels[cumLengths.indexOf(index)]}</h2>}
            <h3>{question}</h3>
            {[1, 2, 3, 4, 5, 6].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(index, score)}
                className={scores[index] === score ? 'selected' : ''}
                disabled={showResults} // 結果表示中はボタンを無効化
              >
                {score}
              </button>
            ))}
          </div>
        ))}
        {shouldShowResultsButton && <hr style={{ margin: '30px' }} />}
        {shouldShowResultsButton && !showResults && (
          <div style={{ marginTop: '30px' }}>
            <button onClick={handleShowResults}>結果を表示</button>
          </div>
        )}
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <h2>結果</h2>
            <button onClick={handleToggleSort}>{sortDescending ? '質問順に並べ替え' : '降順に並べ替え'}</button>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={barChartData}
                // width={600}
                height={500}
                options={options}
              />
            </div>
            {labels.map((label, index) => (
              <div key={label}>
                <p>{label} {dictLabels[label]}スキーマ：{averageScores[index].toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          出典：以下のサイト
        </p>
        <p>
          <Link href="https://psychology-training.com.au/schema-therapy-training/resource-material-links/" target="_blank">
            https://psychology-training.com.au/schema-therapy-training/resource-material-links/
          </Link>
        </p>
      </main>
    </div>
  );
}