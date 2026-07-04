'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questions, questionRows, reverseMax, scoreOptions } from '@/app/data/time-perspective';
import { averageQuestionRowGroups, sortLabeledScores } from '@/app/lib/scoring';
import { Bar, barChartData, horizontalBarOptions } from '@/app/components/charts';

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

  const options = horizontalBarOptions({
    title: 'あなたの時間志向',
    xMax: 6,
    xStepSize: 1,
    xGridLineWidth: 2,
  });
  const chartData = barChartData({
    labels: sortDescending ? sortedLabels : labels,
    data: sortDescending ? sortedAverageScores : averageScores,
  });

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
                data={chartData}
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
