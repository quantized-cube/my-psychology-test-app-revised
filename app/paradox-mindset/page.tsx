'use client'

import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton } from '@/app/components/questionnaire';
import { useQuestionnaire } from '@/app/hooks/useQuestionnaire';
import { questionsParadox, questionsTension, scoreOptions } from '@/app/data/paradox-mindset';
import { average } from '@/app/lib/scoring';
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
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

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
  Legend,
  annotationPlugin,
);

export default function Home() {
  const tension = useQuestionnaire({ questionCount: questionsTension.length });
  const paradox = useQuestionnaire({ questionCount: questionsParadox.length });
  const showResults = tension.showResults || paradox.showResults;
  const shouldShowResultsButton = tension.canShowResults && paradox.canShowResults;

  const resultScoreTension = average(tension.scores)
  const resultScoreParadox = average(paradox.scores)
  const handleShowResults = () => {
    tension.show();
    paradox.show();
  };

  // グラフのデータ
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        min: 1,
        max: 7,
        title: {
          display: true,
          text: 'マインドセット',
        },
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        min: 1,
        max: 7,
        title: {
          display: true,
          text: '緊張関係の経験',
        },
        ticks: {
          stepSize: 1,
        }
      }
    },
    plugins: {
      legend: {
        // position: 'right' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'パラドックス・ナビゲーション（両立実践）マトリクス',
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line' as const,
            yMin: 4.38,
            yMax: 4.38,
            // borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
          },
          line2: {
            type: 'line' as const,
            xMin: 4.9,
            xMax: 4.9,
            borderWidth: 2,
          },
          label1: {
            type: 'label' as const,
            xValue: 6,
            yValue: 6,
            backgroundColor: 'rgba(245,245,245,0.5)',
            content: ['積極的実践', '（エンゲージング）', 'ゾーン'],
            font: {
              size: 11
            }
          },
          label2: {
            type: 'label' as const,
            xValue: 3,
            yValue: 6,
            backgroundColor: 'rgba(245,245,245,0.5)',
            content: ['解決／解消', 'ゾーン'],
            font: {
              size: 11
            }
          },
          label3: {
            type: 'label' as const,
            xValue: 6,
            yValue: 2.8,
            backgroundColor: 'rgba(245,245,245,0.5)',
            content: ['準備完了', 'ゾーン'],
            font: {
              size: 11
            }
          },
          label4: {
            type: 'label' as const,
            xValue: 3,
            yValue: 2.8,
            backgroundColor: 'rgba(245,245,245,0.5)',
            content: ['回避／逃避', 'ゾーン'],
            font: {
              size: 11
            }
          },
        },
      },
    },
  };
  const chartData = {
    datasets: [
      {
        label: 'スコア',
        data: [{ x: resultScoreParadox, y: resultScoreTension }],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 7,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <div>
      <Head>
        <title>パラドックス・マインドセット関連尺度</title>
        <meta name="description" content="パラドックス・マインドセット関連尺度" />
      </Head>

      <main>
        <h1>パラドックス・マインドセット関連尺度</h1>
        <p>
          実施する前に、皆さんが感じている、競合する要求についていくつか考えてみよう。これらの要求を検討し、以下に示すそれぞれの文が当てはまるかどうかを評価しよう。
        </p>
        <p>
          1 = まったく当てはまらない
        </p>
        <p>
          2 = 当てはまらない
        </p>
        <p>
          3 = やや当てはまらない
        </p>
        <p>
          4 = どちらでもない
        </p>
        <p>
          5 = やや当てはまる
        </p>
        <p>
          6 = 当てはまる
        </p>
        <p>
          7 = 非常に当てはまる
        </p>
        <hr style={{ margin: '30px' }} />
        <h2>緊張関係（テンション）の経験</h2>
        <QuestionList
          questions={questionsTension}
          scores={tension.scores}
          scoreOptions={scoreOptions}
          onAnswer={tension.answer}
          disabled={showResults}
        />
        <hr style={{ margin: '30px' }} />
        <h2>パラドックス・マインドセット</h2>
        <QuestionList
          questions={questionsParadox}
          scores={paradox.scores}
          scoreOptions={scoreOptions}
          onAnswer={paradox.answer}
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
            <div className="mx-auto max-w-min">
              <Scatter
                data={chartData}
                width={500}
                height={500}
                options={options}
              />
            </div>
            <div>
              <p>{`緊張関係の経験のスコア: ${resultScoreTension.toFixed(2)}`}</p>
              <p>{`パラドックス・マインドセットのスコア: ${resultScoreParadox.toFixed(2)}`}</p>
            </div>
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          出典：<Link href="https://www.amazon.co.jp/dp/4800591503/" target="_blank">
            両立思考　「二者択一」の思考を手放し、多様な価値を実現するパラドキシカルリーダーシップ
          </Link>
        </p>
      </main>
    </div>
  );
}
