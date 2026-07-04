'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { GroupedQuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questionGroups, questions, schemaLabels, scoreOptions } from '@/app/data/ysq-r';
import { averageGroups, cumulativeLengths, sortLabeledScores } from '@/app/lib/scoring';
import { Bar, barChartData, horizontalBarOptions } from '@/app/components/charts';

const cumLengths = cumulativeLengths(questionGroups);

export default function Home() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const averageScores = averageGroups(scores, questionGroups);
  const sortedScores = sortLabeledScores(labels, averageScores, 'desc');
  const sortedLabels = sortedScores.map((score) => score.label);
  const sortedAverageScores = sortedScores.map((score) => score.value);

  const handleToggleSort = () => {
    // スコアのソート順を切り替える
    setSortDescending(!sortDescending);
  };

  const displayedScores = sortDescending ? sortedAverageScores : averageScores;
  const options = horizontalBarOptions({
    title: 'あなたのスキーマの得点',
    xMax: 7,
    xStepSize: 1,
    xGridLineWidth: (ctx: any) => [4].includes(ctx.tick.value) ? 4 : 2,
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
          <div>
            <h2>結果</h2>
            <button onClick={handleToggleSort}>{sortDescending ? '質問順に並べ替え' : '降順に並べ替え'}</button>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={chartData}
                // width={600}
                height={500}
                options={options}
              />
            </div>
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
