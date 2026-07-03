'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
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

const questionsTension = [
  '時として、同時に現れたら矛盾しているように見える2つの考えを、心に抱くことがある',
  '相反する要求の両方を同時に対処しなければならないことがよくある',
  '相互に矛盾する目標を持つことがよくある',
  '矛盾する要求の両方に応えなければいけない場面にたびたび遭遇する',
  '私の仕事は緊張と矛盾に満ちている',
  '対立する選択肢のどちらかに決めなければならないことがよくある',
  '私の考える問題の解決策は、たいてい矛盾しているように見える',
];
const questionsParadox = [
  '相いれない複数の視点を持った方が、物事をよく理解できると思う',
  '相いれない要求に同時に応えることは苦にならない',
  '矛盾を受け入れることは、私が成功するのに必要なことだ',
  '矛盾したアイデアに遭遇することは、自身の活力になる',
  '相互に矛盾する複数の目標をなんとかやり遂げようとしている時に楽しさを感じる',
  '相いれない要求の両方を同時に受け入れることは、私自身よく経験している',
  '相互に矛盾するような仕事に取り組むことに抵抗がない',
  '相反する2つのことが両立できると感じると気分が高まる',
  '矛盾する問題をなんとか対処できた時に活力を感じる',
];

export default function Home() {
  const [scoresTension, setScoresTension] = useState<number[]>(Array(questionsTension.length).fill(0));
  const [scoresParadox, setScoresParadox] = useState<number[]>(Array(questionsParadox.length).fill(0));
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  // scoresTensionとscoresParadoxに0が含まれていないかチェック
  const shouldShowResultsButton = scoresTension.every((score) => score !== 0) && scoresParadox.every((score) => score !== 0);

  const handleAnswerTension = (index: number, score: number) => {
    const newScoresTension = [...scoresTension];
    newScoresTension[index] = score;
    setScoresTension(newScoresTension);
  };
  const handleAnswerParadox = (index: number, score: number) => {
    const newScoresParadox = [...scoresParadox];
    newScoresParadox[index] = score;
    setScoresParadox(newScoresParadox);
  };

  // 平均を計算する
  const average = (numbers: number[]) => numbers.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    0
  ) / numbers.length
  const resultScoreTension = average(scoresTension)
  const resultScoreParadox = average(scoresParadox)
  const isTensionHigh = resultScoreTension > 4.38
  const isParadoxHigh = resultScoreParadox > 4.9
  const calcZone = (isTensionHigh: boolean, isParadoxHigh: boolean) => {
    // 等号になることはない
    if (isTensionHigh && isParadoxHigh) {
      return "積極的実践（エンゲージング）ゾーン";
    } else if (isTensionHigh && !isParadoxHigh) {
      return "解決／解消ゾーン";
    } else if (!isTensionHigh && isParadoxHigh) {
      return "準備完了ゾーン";
    } else {
      return "回避／逃避ゾーン";
    }
  }
  const zone = calcZone(isTensionHigh, isParadoxHigh)
  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
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
        {questionsTension.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            {[1, 2, 3, 4, 5, 6, 7].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswerTension(index, score)}
                className={scoresTension[index] === score ? 'selected' : ''}
                disabled={showResults} // 結果表示中はボタンを無効化
              >
                {score}
              </button>
            ))}
          </div>
        ))}
        <hr style={{ margin: '30px' }} />
        <h2>パラドックス・マインドセット</h2>
        {questionsParadox.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            {[1, 2, 3, 4, 5, 6, 7].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswerParadox(index, score)}
                className={scoresParadox[index] === score ? 'selected' : ''}
                disabled={showResults} // 結果表示中はボタンを無効化
              >
                {score}
              </button>
            ))}
          </div>
        ))}
        {shouldShowResultsButton && <hr style={{ margin: '30px' }} />}
        {shouldShowResultsButton && !showResults && (
          <div style={{ marginTop: '30px' }}>
            <button onClick={handleShowResults}>結果を表示</button>
          </div>
        )}
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