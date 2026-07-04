'use client'

import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { interpretations, questions, reverseItems, scoreOptions } from '@/app/data/nature-connectedness';
import { adjustedScores, average, scoreByInterpretation } from '@/app/lib/scoring';
import { Bar, barChartData, singleValueBarOptions } from '@/app/components/charts';

export default function NatureConnectedness() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });

  const calculateFinalScore = () => average(adjustedScores(scores, reverseItems, 6));

  const finalScore = calculateFinalScore();

  const getInterpretation = (score: number) => scoreByInterpretation(
    score,
    interpretations,
    (interpretation) => {
      const [min, max] = interpretation.range.split(' - ').map(Number);
      return score >= min && score <= max;
    },
    2,
  );

  const chartData = barChartData({
    labels: ['あなたのスコア'],
    data: [finalScore],
    label: '自然とのつながり度',
    backgroundColor: ['rgba(34, 139, 34, 0.6)'],
    borderColor: ['rgba(34, 139, 34, 1)'],
    borderWidth: 2,
    withHoverColors: false,
  });
  const chartOptions = singleValueBarOptions({
    title: 'ネイチャー・コネクテッドネス・スコア',
    yMax: 5,
    yStepSize: 0.5,
  });

  return (
    <div>
      <Head>
        <title>ネイチャー・コネクテッドネス</title>
        <meta name="description" content="自然とのつながり度を測定する心理テスト" />
      </Head>

      <main>
        <h1>ネイチャー・コネクテッドネス診断</h1>
        <p>
          「自然とのつながり」を測定する心理テストです。
        </p>
        <p>
          心理学の世界でよく使われる「Connectedness to Nature Scale (CNS)」という指標をもとにしています。
        </p>
        <p>
          これは「自然と一体感を感じるかどうか」を1〜5段階で測るもので、このテストの数値が高い人ほど、幸福度スコアも高いことが知られています。
        </p>
        <p>
          以下の14の文章について、「まったくそう思わない（1）」〜「非常にそう思う（5）」の5段階で回答してください。
          直感的な回答でOKです。
        </p>

        <hr style={{ margin: '30px' }} />
        
        <h2>質問</h2>
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

        {showResults && (
          <div>
            <h2>診断結果</h2>
            
            <div className="mx-auto max-w-min">
              <Bar data={chartData} height={350} options={chartOptions} />
            </div>

            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              あなたのスコア: {finalScore.toFixed(2)}
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f0f8f0', borderRadius: '8px', marginBottom: '30px' }}>
              <h3>評価：{getInterpretation(finalScore).level}</h3>
              <p>{getInterpretation(finalScore).description}</p>
            </div>
          </div>
        )}

        <hr style={{ margin: '30px' }} />
        <p>
          出典：パレオな男 <Link href="https://yuchrszk.blogspot.com/2025/08/14.html" target="_blank">
            あなたの幸福感を高める「ネイチャー・コネクテッドネス」を判断する14問
          </Link>
        </p>
        
      </main>
    </div>
  );
}
