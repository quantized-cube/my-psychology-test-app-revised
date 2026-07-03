'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questions, questionRows, reverseMax, scoreOptions } from '@/app/data/time-perspective';
import { averageQuestionRowGroups, sortLabeledScores } from '@/app/lib/scoring';
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



export default function Home() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const averageScores = averageQuestionRowGroups(scores, questionRows, labels, reverseMax);
  const sortedScores = sortLabeledScores(labels, averageScores, 'desc');
  const sortedLabels = sortedScores.map((score) => score.label);
  const sortedAverageScores = sortedScores.map((score) => score.value);

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

        <QuestionList
          questions={questions}
          scores={scores}
          scoreOptions={scoreOptions}
          onAnswer={handleAnswer}
          disabled={showResults}
        />
        <ShowResultsButton
          canShow={shouldShowResultsButton}
          showResults={showResults}
          onShow={handleShowResults}
        />
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
