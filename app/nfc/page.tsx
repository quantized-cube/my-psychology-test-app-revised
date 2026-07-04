'use client'

import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { interpretations, questions, reverseItems, scoreOptions } from '@/app/data/nfc';
import { adjustedScores, scoreByInterpretation, sum } from '@/app/lib/scoring';
import { Bar, barChartData, singleValueBarOptions } from '@/app/components/charts';

export default function NatureConnectedness() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });

  const calculateFinalScore = () => sum(adjustedScores(scores, reverseItems, 7));

  const finalScore = calculateFinalScore();

  const getInterpretation = (score: number) => scoreByInterpretation(
    score,
    interpretations,
    (interpretation) => {
      const [min, max] = interpretation.range.split(' - ').map(Number);
      return score >= min && score <= max;
    },
    1,
  );

  const chartData = barChartData({
    labels: ['あなたのスコア'],
    data: [finalScore],
    label: '合計点',
    backgroundColor: ['rgba(34, 139, 34, 0.6)'],
    borderColor: ['rgba(34, 139, 34, 1)'],
    borderWidth: 2,
    withHoverColors: false,
  });
  const chartOptions = singleValueBarOptions({
    title: '認知の複雑さ（の低さ）',
    yMax: 90,
    yStepSize: 5,
  });

  return (
    <div>
      <Head>
        <title>NFCテスト</title>
        <meta name="description" content="認知の複雑さを判断するテスト" />
      </Head>

      <main>
        <h1>NFCテスト</h1>
        <p>
          NFCテストは、「曖昧さや不確実性を避けて、早く明確な結論にたどり着きたい」という心理傾向を測定するために開発された尺度だ。
        </p>
        <p>
          判断を行う際は、以下の15の文章を読み、それぞれが自分にどれだけ当てはまるかどうかを考えて6段階で点数をつける。
        </p>
        <p>
          1=まったくそう思わない
        </p>
        <p>
          2=あまりそう思わない
        </p>
        <p>
          3=少しそう思わない
        </p>
        <p>
          4=少しそう思う
        </p>
        <p>
          5=まあまあそう思う
        </p>
        <p>
          6=強くそう思う
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
              あなたのスコア: {finalScore.toFixed(0)}
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f0f8f0', borderRadius: '8px', marginBottom: '30px' }}>
              <h3>{getInterpretation(finalScore).level}</h3>
              <p>{getInterpretation(finalScore).description}</p>
            </div>
          </div>
        )}

        <hr style={{ margin: '30px' }} />
        <p>
          出典：<Link href="https://www.shogakukan-cr.co.jp/book/b10140145.html" target="_blank">
            『社会は、静かにあなたを「呪う」』
          </Link>、鈴木 祐、小学館クリエイティブ、2025年
        </p>
        
      </main>
    </div>
  );
}
