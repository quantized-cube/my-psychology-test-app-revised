'use client'

import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questions, questionRows, reverseMax, scoreOptions } from '@/app/data/time-perspective';
import { averageQuestionRowGroups } from '@/app/lib/scoring';
import { BarChart, SortButton, barChartData, horizontalBarOptions, useSortedLabeledScores } from '@/app/components/charts';

export default function Home() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });

  const averageScores = averageQuestionRowGroups(scores, questionRows, labels, reverseMax);
  const {
    isSorted: sortDescending,
    displayedLabels,
    displayedScores,
    toggleSort: handleToggleSort,
  } = useSortedLabeledScores({ labels, scores: averageScores, direction: 'desc' });

  const options = horizontalBarOptions({
    title: 'あなたの時間志向',
    xMax: 6,
    xStepSize: 1,
    xGridLineWidth: 2,
  });
  const chartData = barChartData({
    labels: displayedLabels,
    data: displayedScores,
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
          <div id="results" tabIndex={-1}>
            <h2>結果</h2>
            <SortButton
              isSorted={sortDescending}
              onToggle={handleToggleSort}
              defaultLabel="デフォルト順に並べ替え"
              sortedLabel="降順に並べ替え"
            />
            <BarChart data={chartData} height={350} options={options} />
            {displayedLabels.map((label, index) => (
              <div key={label}>
                <p>{label}：{displayedScores[index].toFixed(2)}</p>
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
