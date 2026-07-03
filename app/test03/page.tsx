'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { allAnswered, averageGroups, cumulativeLengths, sortLabeledScores } from '@/app/lib/scoring';
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

const cumLengths = cumulativeLengths(a_questions);

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton = allAnswered(scores); // scoresに0が含まれていないかチェック
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };

  const averageScores = averageGroups(scores, a_questions);
  const sortedScores = sortLabeledScores(labels, averageScores, 'desc');
  const sortedLabels = sortedScores.map((score) => score.label);
  const sortedAverageScores = sortedScores.map((score) => score.value);

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
