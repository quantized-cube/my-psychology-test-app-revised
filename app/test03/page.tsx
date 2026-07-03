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
];

// 1-5: ED
const questions_1_ED = [
  "I haven\'t gotten enough love and attention.",
  "For the most part, I haven\'t had someone to depend on for advice and emotional support.",
  "For much of my life, I haven\'t had someone who wanted to get close to me and spend a lot of time with me.",
];

// 6-13: AB
const questions_2_AB = [
  "I worry that people I feel close to will leave me or abandon me.",
  "I don\'t feel that important relationships will last; I expect them to end.",
  "hogehoge",
];

// 14-18: MA
const questions_3_MA = [
  "fugafuga",
  "fugafuga",
  "fugafuga",
];

const a_questions = [
  questions_1_ED,
  questions_2_AB,
  questions_3_MA,
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
  // 以下は型がうまくいかない
  // const sortedPairLabelsAverageScores = [...pairLabelsAverageScores].sort(([al, as], [bl, bs]) => bs - as);
  // const sortedLabels = sortedPairLabelsAverageScores.map((pair, index) => `${pair[0]}`);
  // const sortedAverageScores = sortedPairLabelsAverageScores.map((pair, index) => `${pair[1]}`);
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
      }
    },
    plugins: {
      legend: {
        // position: 'right' as const,
        display: false,
      },
      title: {
        display: true,
        text: '結果のグラフ',
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
          // context.dataIndex は各バーのインデックスを表します
          const score: any = sortDescending
            ? sortedAverageScores[context.dataIndex]
            : averageScores[context.dataIndex];

          // スコアが4以上の場合に色を変える
          return score >= 4 ? 'rgba(200, 55, 80, 0.8)' : 'rgba(255, 99, 132, 0.4)';
        },
        borderWidth: 3,
        hoverBackgroundColor: (context: any) => {
          // context.dataIndex は各バーのインデックスを表します
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
        <meta name="description" content="心理テストのサンプル" />
      </Head>

      <main>
        <h1>YSQ-R</h1>
        <p>
          https://psychology-training.com.au/schema-therapy-training/resource-material-links/
        </p>
        <p>
          1 = まったく当てはまらない
          ……
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
                height={150}
                options={options}
              />
            </div>
            {labels.map((label, index) => (
              <div key={label}>
                <h3>結果{label}</h3>
                <p>{resultMessages[index]}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <div style={{ fontSize: '16px', margin: '30px' }}>
          <Link href="/">
            トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}