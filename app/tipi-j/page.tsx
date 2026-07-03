'use client'

import Head from 'next/head';
import Link from 'next/link'
import { ScoreButtons, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { labels, questions, questionRows, reverseMax } from '@/app/data/tipi-j';
import { sumQuestionRowGroups } from '@/app/lib/scoring';
import { Radar } from 'react-chartjs-2'; // react-chartjs-2をインポート
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PolarAreaController,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PolarAreaController,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const {
    scores,
    showResults,
    canShowResults: shouldShowResultsButton,
    answer: handleAnswer,
    show: handleShowResults,
  } = useQuestionnaire({ questionCount: questions.length });

  const resultScores = sumQuestionRowGroups(scores, questionRows, labels, reverseMax);

  // 棒グラフのデータ
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        min: 0,
        max: 14,
        ticks: {
          stepSize: 2
        },
        grid: {
          lineWidth: (ctx: any) => [2, 8, 14].includes(ctx.tick.value) ? 4 : 2,
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        // position: 'right' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'あなたのビッグファイブ',
      },
    },
  };
  const radarChartData = {
    labels: labels,
    datasets: [
      {
        label: 'スコア',
        data: resultScores,
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>TIPI-J</title>
        <meta name="description" content="日本語版 Ten Item Personality Inventory (TIPI-J)" />
      </Head>

      <main>
        <h1>TIPI-J</h1>
        <p>
          日本語版 Ten Item Personality Inventory (TIPI-J)
        </p>
        <p>
          以下のことばがあなた自身についてどのくらい当てはまるかについて、1から7までの数字のうちもっとも適切なものを選んでください。文章全体を総合的に見て、自分にどれだけ当てはまるかを評価してください。
        </p>
        <p>
          1 = 全く違うと思う
        </p>
        <p>
          2 = おおよそ違うと思う
        </p>
        <p>
          3 = 少し違うと思う
        </p>
        <p>
          4 = どちらでもない
        </p>
        <p>
          5 = 少しそう思う
        </p>
        <p>
          6 = まあまあそう思う
        </p>
        <p>
          7 = 強くそう思う
        </p>
        <hr style={{ margin: '30px' }} />
        <h2>設問</h2>
        <p>
          私は自分自身のことを……
        </p>

        {questions.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            <ScoreButtons
              options={[1, 2, 3, 4, 5, 6, 7]}
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
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <h2>結果</h2>
            <div className="mx-auto max-w-min">
              <Radar
                data={radarChartData}
                // width={400}
                height={400}
                options={options}
              />
            </div>
            {labels.map((label, index) => (
              <div key={label}>
                <p>{label}: {resultScores[index]}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          出典：日本語版 Ten Item Personality Inventory (TIPI-J) 作成の試み
        </p>
        <p>
          <Link href="https://gosling.psy.utexas.edu/wp-content/uploads/2014/09/2012TIPI_J.pdf" target="_blank">
            https://gosling.psy.utexas.edu/wp-content/uploads/2014/09/2012TIPI_J.pdf
          </Link>
        </p>
      </main>
    </div>
  );
}
