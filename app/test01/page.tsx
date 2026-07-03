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


const questions = [
  '質問1: このテストは役に立つと思いますか？',
  '質問2: このテストは難しいと思いますか？',
  '質問3: このテストは楽しいと思いますか？',
  '質問4: このテストは悲しいと思いますか？',
];

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton = scores.every((score) => score !== 0); // scoresに0が含まれていないかチェック

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };

  // const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const totalScore_1 = scores.slice(0, 2).reduce((acc, score) => acc + score, 0);
  const totalScore_2 = scores.slice(2, 4).reduce((acc, score) => acc + score, 0);
  // const resultMessage = `合計スコア ${totalScore}`;
  const resultMessage1 = `1と2の合計スコア ${totalScore_1}`;
  const resultMessage2 = `3と4の合計スコア ${totalScore_2}`;

  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
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
        max: 12,
        ticks: {
          stepSize: 3,
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
  const labels = ['結果1', '結果2'];
  const barChartData = {
    labels: labels, // カテゴリーデータを設定
    datasets: [
      {
        label: 'スコア',
        data: [totalScore_1, totalScore_2],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 3,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>心理テスト01</title>
        <meta name="description" content="心理テストのサンプル" />
      </Head>

      <main>
        <h1>心理テスト01</h1>
        {questions.map((question, index) => (
          <div key={index}>
            <h2>{question}</h2>
            {[1, 2, 3, 4, 5, 6].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(index, score)}
                className={scores[index] === score ? 'selected' : ''}
              // disabled={showResults} // 結果表示中はボタンを無効化
              >
                {score}
              </button>
            ))}
          </div>
        ))}
        {shouldShowResultsButton && !showResults && (
          <div style={{ marginTop: '30px' }}>
            <button onClick={handleShowResults}>結果を表示</button>
          </div>
        )}
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <hr style={{ margin: '30px' }} />
            <h2>結果</h2>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={barChartData}
                // width={600}
                height={150}
                options={options}
              />
            </div>
            <h3>結果1</h3>
            <p>{resultMessage1}</p>
            <h3>結果2</h3>
            <p>{resultMessage2}</p>
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