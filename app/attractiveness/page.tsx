'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { ScoreButtons, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questionGroups, questions, scoreOptions } from '@/app/data/attractiveness';
import { cumulativeLengths, sortLabeledScores, sumGroups } from '@/app/lib/scoring';
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

const cumLengths = cumulativeLengths(questionGroups);

export default function Home() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });
  const [sortAscending, setSortAscending] = useState(false); // スコアの昇順ソートトグル

  const sumScores = sumGroups(scores, questionGroups);
  const sortedScores = sortLabeledScores(labels, sumScores, 'asc');
  const sortedLabels = sortedScores.map((score) => score.label);
  const sortedSumScores = sortedScores.map((score) => score.value);

  const resultMessages: string[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const resultMessage = `${labels[i]}: ${sumScores[i]}`;
    resultMessages.push(resultMessage);
  }

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
            <ScoreButtons
              options={scoreOptions}
              selectedScore={scores[index]}
              onSelect={(score) => handleAnswer(index, score)}
              disabled={showResults}
            />
          </div>
        ))}
        <ShowResultsButton
          canShow={shouldShowResultsButton}
          showResults={showResults}
          onShow={handleShowResults}
        />
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
