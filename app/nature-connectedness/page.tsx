'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
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

const questions = [
  '私はしばしば、周囲の自然界との一体感を感じることがあります。',
  '私は自然界を、自分が属しているコミュニティとして考えています。',
  '私は他の生き物たちの知性を認識し、尊重しています。',
  '私はしばしば、自然から切り離されているように感じます。', // 逆転項目
  '自分の人生について考えるとき、私はより大きな「生の循環プロセス」の一部だと感じます。',
  '私はしばしば、動物や植物と親しみを感じます。',
  '私は地球が私に属するのと同じように、私も地球に属していると感じます。',
  '自分の行動が自然界にどのような影響を与えるかについて、深い理解があります。',
  '私はしばしば、生命のネットワークの一部であると感じます。',
  '私は、人間もそうでない存在も、すべての地球上の生命が共通の「生命力」を共有していると感じます。',
  '木が森の一部であるように、私は広い自然界の中に埋め込まれていると感じます。',
  '地球上の自分の位置を考えると、私は自然の中で最上位にいる存在だと思います。', // 逆転項目
  '私はしばしば、自分が周囲の自然界の中でほんの小さな存在であり、地面の草や木の上の鳥と同じように重要なのだと感じます。',
  '私自身の幸福は、自然界の幸福とは関係がないと思います。', // 逆転項目
];

// 逆転項目のインデックス（0ベース）
const reverseItems = [3, 11, 13];

const interpretations = [
  { range: '1.0 - 1.4', level: '非常に低い（切断的）', description: '自然との関係性がほとんど意識されておらず、環境への関心も乏しい可能性があります。' },
  { range: '1.5 - 2.4', level: 'やや低い', description: '自然との心理的距離があり、意識的に関わろうとしない傾向があります。' },
  { range: '2.5 - 3.4', level: '中程度（平均的）', description: '自然を感じることはありますが、都市的な生活が中心でつながりがやや希薄な状態です。' },
  { range: '3.5 - 4.4', level: 'やや高い', description: '日常的に自然を身近に感じており、心の安定や幸福感との結びつきも見られます。' },
  { range: '4.5 - 5.0', level: '非常に高い', description: '自然との一体感が強く、自然保護への関心も高い状態です。環境への行動も積極的である傾向があります。' },
];

export default function NatureConnectedness() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false);
  
  const shouldShowResultsButton = scores.every((score) => score !== 0);

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };

  const calculateFinalScore = () => {
    const adjustedScores = scores.map((score, index) => {
      // 逆転項目の場合はスコアを反転
      if (reverseItems.includes(index)) {
        return 6 - score; // 1→5, 2→4, 3→3, 4→2, 5→1
      }
      return score;
    });
    
    const total = adjustedScores.reduce((sum, score) => sum + score, 0);
    return total / questions.length;
  };

  const finalScore = calculateFinalScore();

  const getInterpretation = (score: number) => {
    if (score >= 1.0 && score <= 1.4) return interpretations[0];
    if (score >= 1.5 && score <= 2.4) return interpretations[1];
    if (score >= 2.5 && score <= 3.4) return interpretations[2];
    if (score >= 3.5 && score <= 4.4) return interpretations[3];
    if (score >= 4.5 && score <= 5.0) return interpretations[4];
    return interpretations[2]; // デフォルト
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  // 棒グラフのデータ
  const barChartData = {
    labels: ['あなたのスコア'],
    datasets: [
      {
        label: '自然とのつながり度',
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
        max: 5,
        ticks: {
          stepSize: 0.5,
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
        text: 'ネイチャー・コネクテッドネス・スコア',
      },
    },
  };

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
        {questions.map((question, index) => (
          <div key={index}>
            <h3>
              {question}
            </h3>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(index, score)}
                className={scores[index] === score ? 'selected' : ''}
                disabled={showResults}
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

        {showResults && (
          <div>
            <h2>診断結果</h2>
            
            <div className="mx-auto max-w-min">
              <Bar data={barChartData} height={350} options={chartOptions} />
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
