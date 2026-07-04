'use client'

import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questions, questionRows, reverseMax, scoreOptions } from '@/app/data/tpi';
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
          出典：<Link href="https://www.amazon.co.jp/dp/4296125869" target="_blank">
            毎日をもっと大切にできるスタンフォードの時間心理学
          </Link>
        </p>
      </main>
    </div>
  );
}
