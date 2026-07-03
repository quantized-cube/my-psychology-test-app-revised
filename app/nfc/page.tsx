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
  '不確かな状況は好きではない。',
  '答えがいくつもあるような質問は嫌いだ。',
  '規則正しい生活が自分の性格に合っていると感じる。',
  'なぜ出来事が起きたのか理由がわからないと落ち着かない。',
  '集団の中で一人だけ違う意見を言う人を見るとイライラする。',
  '何が起こるかわからない状況に飛び込むのは好きではない。',
  '決断をすると安心する。',
  '問題に直面したとき、すぐに解決したくてたまらなくなる。',
  '問題にすぐ解決策が見つからないと、いらいらする。',
  '予測不能な行動をする人とは一緒にいたくない。',
  '解釈がいくつもできるような発言は好きではない。',
  '一貫したルーティンを作ると、生活がより楽しくなると感じる。',
  '明確で構造化された生活様式が好きだ。',
  '自分の意見を持つ前に多くの人の意見を聞くことはあまりない。',
  '予測不能な状況は嫌いだ。',
];

// 逆転項目のインデックス（0ベース）
const reverseItems: number[] = [];

const interpretations = [
  { range: '15 - 30', level: '「認知の複雑性」が高い', description: '曖昧さや不確実性を楽しむことができ、多様な視点を歓迎し、柔軟な思考もうまい。' },
  { range: '31 - 74', level: '「認知の複雑性」は中程度', description: '状況に応じて柔軟にも迅速にも対応できる。' },
  { range: '75 - 90', level: '「認知の複雑性」は低い', description: '曖昧さや変化を強く嫌い、決断を早く下したいという衝動が強い。' },
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
        return 7 - score; // 1→5, 2→4, 3→3, 4→2, 5→1
      }
      return score;
    });
    
    const total = adjustedScores.reduce((sum, score) => sum + score, 0);
    return total;
  };

  const finalScore = calculateFinalScore();

  const getInterpretation = (score: number) => {
    if (score >= 15 && score <= 30) return interpretations[0];
    if (score >= 31 && score <= 74) return interpretations[1];
    if (score >= 75 && score <= 90) return interpretations[2];
    return interpretations[1]; // デフォルト
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

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
            {[1, 2, 3, 4, 5, 6].map((score) => (
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
