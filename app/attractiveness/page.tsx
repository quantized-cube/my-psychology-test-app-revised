'use client'

import Head from 'next/head';
import Link from 'next/link'
import { GroupedQuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questionGroups, questions, scoreOptions } from '@/app/data/attractiveness';
import { cumulativeLengths, sumGroups } from '@/app/lib/scoring';
import { BarChart, SortButton, barChartData, horizontalBarOptions, useSortedLabeledScores } from '@/app/components/charts';

const cumLengths = cumulativeLengths(questionGroups);

export default function Home() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });

  const sumScores = sumGroups(scores, questionGroups);
  const {
    isSorted: sortAscending,
    displayedLabels,
    displayedScores,
    toggleSort: handleToggleSort,
  } = useSortedLabeledScores({ labels, scores: sumScores, direction: 'asc' });

  const resultMessages: string[] = [];
  for (let i = 0; i < cumLengths.length - 1; i++) {
    const resultMessage = `${labels[i]}: ${sumScores[i]}`;
    resultMessages.push(resultMessage);
  }

  const options = horizontalBarOptions({
    title: '魅力度のグラフ',
    xMax: 30,
    xStepSize: 5,
  });
  const chartData = barChartData({
    labels: displayedLabels,
    data: displayedScores,
    backgroundColor: (context: any) => (
      displayedScores[context.dataIndex] < 15 ? 'rgba(200, 55, 80, 0.8)' : 'rgba(255, 99, 132, 0.4)'
    ),
    hoverBackgroundColor: (context: any) => (
      displayedScores[context.dataIndex] < 15 ? 'rgba(60, 150, 150, 0.8)' : 'rgba(80, 200, 200, 0.8)'
    ),
  });

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
        <GroupedQuestionList
          questions={questions}
          scores={scores}
          scoreOptions={scoreOptions}
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
          <div id="results" tabIndex={-1}>
            <h2>結果</h2>
            <BarChart data={chartData} height={150} options={options} />
            <SortButton
              isSorted={sortAscending}
              onToggle={handleToggleSort}
              defaultLabel="質問順に並べ替え"
              sortedLabel="昇順に並べ替え"
            />
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
