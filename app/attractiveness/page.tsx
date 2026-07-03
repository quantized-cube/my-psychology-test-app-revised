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
  '嘘が多い',
  '感情が幼い',
  '性格が悪い',
];

const questions_1 = [
  "人の前だろうが、なんの抵抗もなく自由に感じたままを言うことができる。",
  "他人の話に疑問を感じたら、その気持ちをはっきり伝えられる。",
  "自分にとって嫌なことを理解しているため、不快なことを引き受けて後悔することはない。",
  "誰かに欠点を指摘されたり、親しい人と意見が異なったりしても、なかったことにはしない。",
  "自分の深いところにある考えや感情を、よく理解できている。",
  "本当は楽しくないのに、楽しいふりをしたりはしない。",
];

const questions_2 = [
  "色々と心配なことが頭に浮かんでも、会話から注意がそれることはない。",
  "嘲笑や軽口を受けても、不快さを調整できる。",
  "たくさんの人がいる部屋に入っても、他人の視線を感じて自意識過剰にはならない。",
  "その場に合わないことを言うことはほとんどない。",
  "まわりから下に見られていると思うことはない。",
  "会話の最中に頭が真っ白になることはほぼない。",
];

const questions_3 = [
  "不快な相手でも、皮肉を言ったり、馬鹿にすることはない。",
  "自分の欲求を満たすために、他の人を操ろうとまではしない。",
  "自分もあやまちがあれば簡単に認める。",
  "他の人から「緊張せずに話せる」と言われる。",
  "どちらかというと温厚で、人の気持ちを気にするほうだ。",
  "他の人からの注目や特別な好意は期待しない。",
];

const questionsGroups = [
  questions_1,
  questions_2,
  questions_3,
];
const questions = questionsGroups.flat();

const lengths = questionsGroups.map((question) => question.length)
const cumLengths = [0, ...lengths.map((sum => value => sum += value)(0))]

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton = scores.every((score) => score !== 0); // scoresに0が含まれていないかチェック
  const [sortAscending, setSortAscending] = useState(false); // スコアの昇順ソートトグル

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };

  const sumScores: number[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const start = cumLengths[i];
    const end = cumLengths[i + 1];
    const sumScore = scores.slice(start, end).reduce((acc, score) => acc + score, 0);
    sumScores.push(sumScore);
  }
  const pairLabelsSumScores = labels.map((label, index) => [label, sumScores[index]]);
  // 一旦オブジェクトに変換
  const objLabelsSumScores: { [key: string]: number } = Object.fromEntries(pairLabelsSumScores);
  // キーを含んだ配列に変換
  const array = Object.keys(objLabelsSumScores).map((k) => ({ key: k, value: objLabelsSumScores[k] }));
  // スコアの昇順
  array.sort((a, b) => a.value - b.value);
  // オブジェクトに戻す
  const sortedObjLabelsSumScores = Object.assign({}, ...array.map((item) => ({
    [item.key]: item.value,
  })));
  // スコアの昇順のラベル
  const sortedLabels = Object.keys(sortedObjLabelsSumScores);
  // スコアの昇順のスコア
  const sortedSumScores = Object.values(sortedObjLabelsSumScores);

  const resultMessages: string[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const resultMessage = `${labels[i]}: ${sumScores[i]}`;
    resultMessages.push(resultMessage);
  }

  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
  };

  const handleToggleSort = () => {
    // スコアのソート順を切り替える
    setSortAscending(!sortAscending);
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
        max: 30,
        ticks: {
          stepSize: 5,
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
        text: '魅力度のグラフ',
      },
    },
  };
  const barChartData = {
    labels: sortAscending ? sortedLabels : labels,
    datasets: [
      {
        label: 'スコア',
        data: sortAscending ? sortedSumScores : sumScores,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: (context: any) => {
          // context.dataIndex は各バーのインデックスを表します
          const score: any = sortAscending
            ? sortedSumScores[context.dataIndex]
            : sumScores[context.dataIndex];

          // スコアが15未満の場合に色を変える
          return score < 15 ? 'rgba(200, 55, 80, 0.8)' : 'rgba(255, 99, 132, 0.4)';
        },
        borderWidth: 3,
        hoverBackgroundColor: (context: any) => {
          // context.dataIndex は各バーのインデックスを表します
          const score: any = sortAscending
            ? sortedSumScores[context.dataIndex]
            : sumScores[context.dataIndex];

          // スコアが15未満の場合に色を変える
          return score < 15 ? 'rgba(60, 150, 150, 0.8)' : 'rgba(80, 200, 200, 0.8)';
        },
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>魅力度テスト</title>
        <meta name="description" content="魅力度テスト" />
      </Head>

      <main>
        <h1>魅力度テスト</h1>
        <p>
          以下の18問を読みながら、5点満点で採点してください。あまり深く考えずに、直感で採点するのがポイントです。
        </p>
        <p>
          1 = まったく当てはまらない
        </p>
        <p>
          2 = 当てはまらない
        </p>
        <p>
          3 = どちらとも言えない
        </p>
        <p>
          4 = 当てはまる
        </p>
        <p>
          5 = 完全に当てはまる
        </p>
        {questions.map((question, index) => (
          <div key={index}>
            {cumLengths.includes(index) && <hr style={{ margin: '30px' }} />}
            {cumLengths.includes(index) && <h2>{labels[cumLengths.indexOf(index)]}</h2>}
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
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={barChartData}
                // width={600}
                height={150}
                options={options}
              />
            </div>
            <button onClick={handleToggleSort}>{sortAscending ? '質問順に並べ替え' : '昇順に並べ替え'}</button>
            {labels.map((label, index) => (
              <div key={label}>
                <p>{resultMessages[index]}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          出典：<Link href="https://www.amazon.co.jp/dp/4594094279/" target="_blank">
            最強のコミュ力のつくりかた
          </Link>
        </p>
      </main>
    </div>
  );
}