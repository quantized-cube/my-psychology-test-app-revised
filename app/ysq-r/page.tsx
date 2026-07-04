'use client'

import Head from 'next/head';
import Link from 'next/link'
import { GroupedQuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questionGroups, questions, schemaLabels, scoreOptions } from '@/app/data/ysq-r';
import { averageGroups, cumulativeLengths } from '@/app/lib/scoring';
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

  const averageScores = averageGroups(scores, questionGroups);
  const {
    isSorted: sortDescending,
    displayedLabels,
    displayedScores,
    toggleSort: handleToggleSort,
  } = useSortedLabeledScores({ labels, scores: averageScores, direction: 'desc' });
  const options = horizontalBarOptions({
    title: 'あなたのスキーマの得点',
    xMax: 7,
    xStepSize: 1,
    xGridLineWidth: (ctx: any) => [4].includes(ctx.tick.value) ? 4 : 2,
  });
  const chartData = barChartData({
    labels: displayedLabels,
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
        <meta name="description" content="Young Schema Questionnaire - Revised (YSQ-R)" />
      </Head>

      <main>
        <h1>YSQ-R</h1>
        <p>
          Young Schema Questionnaire - Revised
        </p>
        <p>
          以下に挙げるのは、誰かが自分自身を説明するために使いそうな文です。それぞれの文章を読んで、どの程度自分を表しているか判断してください。判断に迷う場合は、あなたが真実だと<strong>思う</strong>ことではなく、あなたが感情的に<strong>感じる</strong>ことを基にしてください。あなたを表す<strong>最も高い評価を1～6</strong>の中から選んでください。
        </p>
        <p>
          1 = まったく当てはまらない
        </p>
        <p>
          2 = ほとんど当てはまらない
        </p>
        <p>
          3 = どちらかと言えば当てはまる
        </p>
        <p>
          4 = まぁまぁ当てはまる
        </p>
        <p>
          5 = ほとんど当てはまる
        </p>
        <p>
          6 = 完璧に当てはまる
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
            <SortButton
              isSorted={sortDescending}
              onToggle={handleToggleSort}
              defaultLabel="質問順に並べ替え"
              sortedLabel="降順に並べ替え"
            />
            <BarChart data={chartData} height={500} options={options} />
            {schemaLabels.map((label, index) => (
              <div key={label.code}>
                <p>{label.code} {label.name}スキーマ：{averageScores[index].toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          出典：以下のサイト
        </p>
        <p>
          <Link href="https://psychology-training.com.au/schema-therapy-training/resource-material-links/" target="_blank">
            https://psychology-training.com.au/schema-therapy-training/resource-material-links/
          </Link>
        </p>
      </main>
    </div>
  );
}
