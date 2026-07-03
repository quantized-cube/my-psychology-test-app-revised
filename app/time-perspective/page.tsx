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
  '過去肯定型',    // 2，7，11，15，20，25，29，41，49
  '過去否定型',    // 4，5，16，22，27，33，34，36，50，54
  '現在快楽型',    // 1，8，12，17，19，23，26，28，31，32，42，44，46，48，52, 55
  '現在宿命論型',  // 3，14，35，37，38，39，47，53
  '未来志向型',    // 6，9，10，13，18，21，24，30，40，43，45，51，56
];

const questions = [
  "友達同士で集まって盛り上がるのは、人生の中で大切な楽しみのひとつだと思う。",
  "懐かしい光景、音、匂いによって、幼い頃のよい思い出がよみがえることがよくある。",
  "私の人生は運命によって定められるところが多い。",
  "人生の中で、ああすべきだったのに、と思うことが多い。",
  "私の決断は、周りの人や出来事によって大いに影響される。",
  "人は毎朝、その日の予定を計画するべきだと思う。",
  "昔のことを考えるのは楽しい。",
  "衝動的に行動することがある。",
  "時間通りに物事が進まなくても、心配はしない。",
  "何かをやり遂げようとするとき、目標を決めてそれに到達するための具体的な方法を検討する。",
  "昔のことを思い出すと、悪い思い出よりも良い思い出の方が全体的に多い。",
  "大好きな音楽を聴いていると、時間を忘れることがよくある。",
  "夜遊びに行くことよりも、明日までにやるべきことや必要なことを終える方が大切だ。",
  "なるようにしかならないので、自分が何をしてもあまり関係ない。",
  "“古きよき時代”の話が好きである。",
  "過去のつらい経験が、繰り返し頭に浮かぶ。",
  "一日一日を精一杯生きようとしている。",
  "約束の時間に遅れるのは嫌いだ。",
  "毎日を人生最後の日だと思って過ごすのが理想である。",
  "楽しかった思い出が、すぐに心に浮かぶ。",
  "友人や上司・教師などに対する義務は遅れずに果たす。",
  "過去に虐待や拒絶をそれなりに経験した。",
  "その場のはずみで物事を決めてしまうことがある。",
  "毎日を計画的というよりは成り行きで過ごす。",
  "嫌な思い出が多いので、過去のことは思い出したくない。",
  "人生に刺激は重要だ。",
  "取り消してしまいたい間違いを過去に犯したことがある。",
  "時間内に終えることよりも、やっていることを楽しむことの方が大切だと思う。",
  "幼い頃が懐かしいと思う。",
  "決断する前に、メリットとデメリットを比べてみる。",
  "危険をおそれないからこそ、人生は退屈でなくなる。",
  "人生のゴールだけを考えるよりも、その道のりを楽しむことが大切だ。",
  "物事が期待通りにうまくいくことはめったにない。",
  "若い頃の嫌なイメージを忘れることは難しい。",
  "目標、結果、成果について考えなければならないならば、自分の行動の過程や流れの中の楽しみが奪われてしまう。",
  "今を楽しんでいるときでも、つい過去のよく似た経験と比べてしまう。",
  "物事は変わるので、将来の計画を立てるのは実際には不可能だ。",
  "人生の進路は、自分ではどうしようもない力によって決められている。",
  "どうしようもないことなので、将来について心配しても仕方がない。",
  "コツコツと取り組んで時間通りに課題を終了する。",
  "家族が昔はああだった、こうだった、と話し出しても耳を貸さない。",
  "人生の刺激を得るために冒険をする。",
  "やるべきことをリストにする。",
  "自分の頭ではなく気持ちに従うことが多い。",
  "やるべきことがあるとき、誘惑に耐えることができる。",
  "興奮して我を忘れることがある",
  "現代の生活は複雑すぎる。昔のシンプルな生活の方がいいと思う。",
  "わかりやすい人よりも思いつきで行動する人の方が友人として好ましい。",
  "何度も繰り返される家族の行事や伝統が好きだ。",
  "過去に起きた嫌な出来事について考えることがある。",
  "前進するためならば、難しくておもしろくない課題に取り組むことができる。",
  "稼いだお金は、明日のために貯金するよりも今日の楽しみに使う。",
  "成功は努力よりも運で決まることが多い。",
  "人生の中でやりそこなった楽しいことについて考えることがある。",
  "親密な関係は情熱的な方がいい。",
  "仕事や課題の遅れを取り戻す時間は、後でいくらでもある。",
];

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

  const averageScores: number[] = [
    (scores[2 - 1] + scores[7 - 1] + (6 - scores[11 - 1]) + scores[15 - 1] + scores[20 - 1] + (6 - scores[25 - 1]) + scores[29 - 1] + (6 - scores[41 - 1]) + scores[49 - 1]) / 9,
    (scores[4 - 1] + scores[5 - 1] + scores[16 - 1] + scores[22 - 1] + (6 - scores[27 - 1]) + scores[33 - 1] + scores[34 - 1] + scores[36 - 1] + scores[50 - 1] + scores[54 - 1]) / 10,
    (scores[1 - 1] + scores[8 - 1] + scores[12 - 1] + scores[17 - 1] + scores[19 - 1] + scores[23 - 1] + scores[26 - 1] + scores[28 - 1] + scores[31 - 1] + scores[32 - 1] + scores[42 - 1] + scores[44 - 1] + scores[46 - 1] + scores[48 - 1] + (6 - scores[52 - 1]) + scores[55 - 1]) / 16,
    (scores[3 - 1] + scores[14 - 1] + scores[35 - 1] + scores[37 - 1] + scores[38 - 1] + scores[39 - 1] + scores[47 - 1] + scores[53 - 1]) / 8,
    (scores[6 - 1] + (6 - scores[9 - 1]) + scores[10 - 1] + scores[13 - 1] + scores[18 - 1] + scores[21 - 1] + (6 - scores[24 - 1]) + scores[30 - 1] + scores[40 - 1] + scores[43 - 1] + scores[45 - 1] + scores[51 - 1] + (6 - scores[56 - 1])) / 13,
  ];

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
  const sortedAverageScores: number[] = Object.values(sortedObjLabelsAverageScores);

  const resultMessages: string[] = [];
  for (let i = 0; i < 5; i++) {
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
        max: 6,
        ticks: {
          stepSize: 1,
        },
        grid: {
          lineWidth: 2,
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
        text: 'あなたの時間志向',
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
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderWidth: 3,
        hoverBackgroundColor: 'rgba(80, 200, 200, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>時間志向チェックテスト</title>
        <meta name="description" content="時間志向チェックテスト" />
      </Head>

      <main>
        <h1>時間志向チェックテスト</h1>
        <p>
          以下の質問に5点満点で点数をつけてください。まったくあてはまらないなら1点で、完全に当てはまるなら5点です。
        </p>

        {questions.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            {[1, 2, 3, 4, 5].map((score) => (
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
            <button onClick={handleToggleSort}>{sortDescending ? 'デフォルト順に並べ替え' : '降順に並べ替え'}</button>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={barChartData}
                height={350}
                options={options}
              />
            </div>
            {(sortDescending ? sortedLabels : labels).map((label, index) => (
              <div key={label}>
                <p>{label}：{(sortDescending ? sortedAverageScores : averageScores)[index].toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          元の記事
        </p>
        <p>
          <Link href="https://ch.nicovideo.jp/paleo/blomaga/ar2134141" target="_blank">
            https://ch.nicovideo.jp/paleo/blomaga/ar2134141
          </Link>
        </p>
        <p>
          <Link href="https://daigovideolab.jp/blog/2134141" target="_blank">
            https://daigovideolab.jp/blog/2134141
          </Link>
        </p>
      </main>
    </div>
  );
}