'use client'

import Head from 'next/head';
import Link from 'next/link'
import { ScoreButtons, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { interpretations, questions, reverseItems, scoreOptions } from '@/app/data/nfc';
import { adjustedScores, scoreByInterpretation, sum } from '@/app/lib/scoring';
import { Bar } from 'react-chartjs-2';
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

  // 棒グラフのデータ
  const barChartData = {
    labels: ['あなたのスコア'],
    datasets: [
      {
        label: '合計点',
        data: [finalScore],
        backgroundColor: ['rgba(34, 139, 34, 0.6)'],
        borderColor: ['rgba(34, 139, 34, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 90,
        ticks: {
          stepSize: 5,
        },
        grid: {
          lineWidth: 2,
        },
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '認知の複雑さ（の低さ）',
      },
    },
  };

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
        {questions.map((question, index) => (
          <div key={index}>
            <h3>
              {question}
            </h3>
            <ScoreButtons
              options={scoreOptions}
              selectedScore={scores[index]}
              onSelect={(score) => handleAnswer(index, score)}
              disabled={showResults}
            />
          </div>
        ))}

        <ShowResultsButton
          canShow={shouldShowResultsButton}
          showResults={showResults}
          onShow={handleShowResults}
        />

        {showResults && (
          <div>
            <h2>診断結果</h2>
            
            <div className="mx-auto max-w-min">
              <Bar data={barChartData} height={350} options={chartOptions} />
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
