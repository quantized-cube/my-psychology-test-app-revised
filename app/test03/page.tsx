'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { GroupedQuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { averageGroups, cumulativeLengths, sortLabeledScores } from '@/app/lib/scoring';
import { Bar, barChartData, horizontalBarOptions } from '@/app/components/charts';

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
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const averageScores = averageGroups(scores, a_questions);
  const sortedScores = sortLabeledScores(labels, averageScores, 'desc');
  const sortedLabels = sortedScores.map((score) => score.label);
  const sortedAverageScores = sortedScores.map((score) => score.value);

  const resultMessages: string[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const resultMessage = `${labels[i]}のスコア ${averageScores[i].toFixed(2)}`;
    resultMessages.push(resultMessage);
  }

  const handleToggleSort = () => {
    // スコアのソート順を切り替える
    setSortDescending(!sortDescending);
  };

  const displayedScores = sortDescending ? sortedAverageScores : averageScores;
  const options = horizontalBarOptions({
    title: '結果のグラフ',
    xMax: 7,
    xStepSize: 1,
  });
  const chartData = barChartData({
    labels: sortDescending ? sortedLabels : labels,
    data: displayedScores,
    backgroundColor: (context: any) => (
      displayedScores[context.dataIndex] >= 4 ? 'rgba(200, 55, 80, 0.8)' : 'rgba(255, 99, 132, 0.4)'
    ),
    hoverBackgroundColor: (context: any) => (
      displayedScores[context.dataIndex] >= 4 ? 'rgba(60, 150, 150, 0.8)' : 'rgba(80, 200, 200, 0.8)'
    ),
  });

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

        <GroupedQuestionList
          questions={questions}
          scores={scores}
          scoreOptions={[1, 2, 3, 4, 5, 6]}
          onAnswer={handleAnswer}
          disabled={showResults}
          groupStarts={cumLengths}
          groupLabels={labels}
        />
        <ShowResultsButton
          canShow={shouldShowResultsButton}
          showResults={showResults}
          onShow={handleShowResults}
        />
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <h2>結果</h2>
            <button onClick={handleToggleSort}>{sortDescending ? '質問順に並べ替え' : '降順に並べ替え'}</button>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={chartData}
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
