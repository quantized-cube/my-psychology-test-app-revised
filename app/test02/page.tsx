'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { ScoreButtons, ShowResultsButton } from '@/app/components/questionnaire';
import { allAnswered, sum } from '@/app/lib/scoring';

const questions = [
  '質問1: このテストは役に立つと思いますか？',
  '質問2: このテストは簡単だと思いますか？',
  '質問3: このテストは嬉しいと思いますか？',
  '質問4: このテストは無意味だと思いますか？',
];

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton = allAnswered(scores); // scoresに0が含まれていないかチェック

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };

  const totalScore = sum(scores);
  const totalScore_1 = sum(scores.slice(0, 2));
  const totalScore_2 = sum(scores.slice(2, 4));
  const resultMessage = `合計スコア ${totalScore}`;
  const resultMessage1 = `1と2の合計スコア ${totalScore_1}`;
  const resultMessage2 = `3と4の合計スコア ${totalScore_2}`;

  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
  };

  return (
    <div>
      <Head>
        <title>心理テスト02</title>
        <meta name="description" content="心理テストのサンプル" />
      </Head>

      <main>
        <h1>心理テスト02</h1>
        {questions.map((question, index) => (
          <div key={index}>
            <h2>{question}</h2>
            <ScoreButtons
              options={[1, 2, 3, 4, 5, 6]}
              selectedScore={scores[index]}
              onSelect={(score) => handleAnswer(index, score)}
            />
          </div>
        ))}
        <ShowResultsButton
          canShow={shouldShowResultsButton}
          showResults={showResults}
          onShow={handleShowResults}
          withDivider={false}
        />
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <hr style={{ margin: '30px' }} />
            <h2>結果</h2>
            <p>テスト結果：{resultMessage}</p>
            <h3>結果1</h3>
            <p>{resultMessage1}</p>
            <h3>結果2</h3>
            <p>{resultMessage2}</p>
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <div style={{ fontSize: '16px', margin: '30px' }}>
          <Link href="/">
            トップページに戻る
          </Link>
        </div>
      </main >
    </div >
  );
}
