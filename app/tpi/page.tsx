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
  '過去肯定型',    // 2，7，11，15，20，25*，29，41*，49
  '過去否定型',    // 4，5，16，22，27，33，34，36，50，54
  '現在快楽型',    // 1，8，12，17，19，23，26，28，31，32，42，44，46，48，55
  '現在宿命論型',  // 3，14，35，37，38，39，47，52, 53
  '未来型',    // 6，9*，10，13，18，21，24*，30，40，43，45，51，56*
  '超越未来型'  // 56+1, ..., 56+5*, ..., 56+10
];

const questions = [
  "友だちとパーティーにでかけるのは、人生の重要な楽しみのひとつだ。",
  "子どもの頃に慣れ親しんだ光景、音、匂いにいざなわれ、すばらしい思い出にひたることがある。",
  "人生は往々にして運命に左右される。",
  "これまでの人生で違うことをすべきだったと、よく思う。",
  "決断を下そうとすると、周囲の人やものごとからたいてい影響を受ける。",
  "毎朝、あらかじめ計画を立ててから、1日を始めるべきだ。",
  "自分の過去について考えるのは楽しい。",
  "つい衝動に駆られて行動してしまう。",
  "ものごとが時間どおりにおこなわれなくても、別にかまわない。",
  "なにかを達成しようと思ったら、目標を立て、その目標を達成するにはどうすればいいか、方法を考える。",
  "過去を振り返ると、悪いことより、いいことのほうが多かった。",
  "好きな音楽を聴いていると、時のたつのを忘れてしまう。",
  "今夜の遊びより、締め切りや任務を優先する。",
  "どうせ、なるようにしかならないのだから、なにをしたところで、たいして変わらない。",
  "「古きよき時代」の話が好き。",
  "つらい過去の体験が、よく頭をよぎる。",
  "せいいっぱい人生を生きたい。1日1日を充実させたい。",
  "約束の時間に遅れそうになると、あわてる。",
  "毎日を人生最後の日であるかのように生きたい。",
  "友人との約束を守り、期日や期限もきちんと守る。",
  "よき時代の幸福な記憶が、すぐによみがえる。",
  "もう、一生ぶんの虐待や拒絶を味わった。",
  "思いつきで決断を下すことがある。",
  "あらかじめ計画を立てて毎日をすごすのではなく、行き当たりばったりにすごす。",
  "つらい記憶が多いので、過去についてはあまり考えたくない。",
  "人生には、興奮や刺激が欠かせない。",
  "過去のあやまちを後悔している。",
  "時間どおりに仕事を終えるより、いましていることを楽しみたい。",
  "子どもの頃を思い出すと、郷愁に駆られる。",
  "利益と費用をよく考慮してから、決断を下す。",
  "危険を冒すからこそ、人生は退屈せずにすむ。",
  "目的地に到達することよりも、人生という旅を楽しみたい。",
  "ものごとは、たいてい思うようにならない。",
  "若い頃に見た不快な光景が脳裏に焼きついている。",
  "目標や結果について考えると、なにをしていてもつまらなくなる。",
  "現在を楽しんでいても、似たような過去の体験とつい比較してしまう。",
  "ものごとは大きく変化するのだから、将来の計画など立てられない。",
  "人生は、自分ではどうすることもできない力に支配されている。",
  "未来のことを心配してもしかたがない。未来についてできることなどないのだから。",
  "着実に前進し、計画を時間どおりに実行する。",
  "家族が昔話を始めると、いつも聞き流す。",
  "人生に刺激をもたらすためなら、多少のリスクはいとわない。",
  "しなければならないことのリストをつくる。",
  "理性よりも本能に従って行動することが多い。",
  "自分には責任があると自覚し、誘惑に抵抗できる。",
  "一瞬の興奮に押し流されてしまうときがある。",
  "現在の生活は、あまりにも複雑だ。過去のもっとシンプルな生活のほうがいい。",
  "行動の予測がつく友人より、のびのびとした友人のほうが好き。",
  "家族の儀式や伝統など、定期的に繰り返されるものが好き。",
  "過去に起こった悪いことについて考える。",
  "自分が成長できるのなら、困難で面白味のない仕事も続けられる。",
  "時間は、今日の快楽のために使ってしまうより、明日の安全のためにとっておきたい。",
  "勤勉より幸運のほうがものを言う。",
  "これまでの人生で、体験する機会を逸してしまったよいことについて考える。",
  "情熱的に愛せる濃密な人間関係が好き。",
  "仕事の遅れなど、いつだって取り戻せる。",
  "死ぬのは、肉体だけだ。",
  "肉体は、本物の私にとって、仮の住まいにすぎない。",
  "死は新たな始まりにすぎない。",
  "奇跡を信じている。",
  "人類がどうしてこうなったのかという経緯は、進化論で十分に説明がつく。",
  "人には魂がある。",
  "科学の法則がすべてを説明できるわけではない。",
  "臨終を迎えたら、この世での自分の行動の意味がわかると思う。",
  "人には生きるべき神のおきてがある。",
  "霊魂を信じている。",
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
    (scores[2 - 1] + scores[7 - 1] + scores[11 - 1] + scores[15 - 1] + scores[20 - 1] + (6 - scores[25 - 1]) + scores[29 - 1] + (6 - scores[41 - 1]) + scores[49 - 1]) / 9,
    (scores[4 - 1] + scores[5 - 1] + scores[16 - 1] + scores[22 - 1] + (6 - scores[27 - 1]) + scores[33 - 1] + scores[34 - 1] + scores[36 - 1] + scores[50 - 1] + scores[54 - 1]) / 10,
    (scores[1 - 1] + scores[8 - 1] + scores[12 - 1] + scores[17 - 1] + scores[19 - 1] + scores[23 - 1] + scores[26 - 1] + scores[28 - 1] + scores[31 - 1] + scores[32 - 1] + scores[42 - 1] + scores[44 - 1] + scores[46 - 1] + scores[48 - 1] + scores[55 - 1]) / 15,
    (scores[3 - 1] + scores[14 - 1] + scores[35 - 1] + scores[37 - 1] + scores[38 - 1] + scores[39 - 1] + scores[47 - 1] + scores[52 - 1] + scores[53 - 1]) / 9,
    (scores[6 - 1] + (6 - scores[9 - 1]) + scores[10 - 1] + scores[13 - 1] + scores[18 - 1] + scores[21 - 1] + (6 - scores[24 - 1]) + scores[30 - 1] + scores[40 - 1] + scores[43 - 1] + scores[45 - 1] + scores[51 - 1] + (6 - scores[56 - 1])) / 13,
    (scores[56 + 1 - 1] + scores[56 + 2 - 1] + scores[56 + 3 - 1] + scores[56 + 4 - 1] + (6 - scores[56 + 5 - 1]) + scores[56 + 6 - 1] + scores[56 + 7 - 1] + scores[56 + 8 - 1] + scores[56 + 9 - 1] + scores[56 + 10 - 1]) / 10,
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
        <title>時間志向テスト</title>
        <meta name="description" content="時間志向テスト" />
      </Head>

      <main>
        <h1>ジンバルドーの時間志向テストと超越未来型テスト</h1>
        <p>
          それぞれの項目を読み、できるだけ正直に答えてください。各項目が「どれくらい自分の特徴をあらわし、真実をついているか？」と考え、すべてに、1から5の数字で答えてください。
        </p>
        <p>
          1. まったく当てはまらない<br />
          2. あまり当てはまらない<br />
          3. どちらともいえない<br />
          4. 当てはまる<br />
          5. とてもよく当てはまる
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
          出典：<Link href="https://www.amazon.co.jp/dp/4296125869" target="_blank">
            毎日をもっと大切にできるスタンフォードの時間心理学
          </Link>
        </p>
      </main>
    </div>
  );
}