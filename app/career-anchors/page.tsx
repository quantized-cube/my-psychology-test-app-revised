'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { QuestionList, ShowResultsButton, ToggleButton } from '@/app/components/questionnaire';
import { labels, questions, scoreOptions } from '@/app/data/career-anchors';
import { addScores, allAnswered, sortLabeledScores, sum } from '@/app/lib/scoring';
import { Bar, barChartData, horizontalBarOptions } from '@/app/components/charts';

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [additionalScores, setAdditionalScores] = useState<number[]>(Array(questions.length).fill(0));
  const trueScores = addScores(scores, additionalScores);
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton1 = allAnswered(scores); // scoresに0が含まれていないかチェック
  const shouldShowResultsButton2 = (sum(additionalScores) === 12);
  const shouldShowResultsButton = shouldShowResultsButton1 && shouldShowResultsButton2;
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };
  const handleAdditionalAnswer = (index: number) => {
    const newAdditionalScores = [...additionalScores];
    if (newAdditionalScores[index] === 4) {
      newAdditionalScores[index] = 0;
    } else {
      newAdditionalScores[index] = 4;
    }
    setAdditionalScores(newAdditionalScores);
  };

  const resultScores: number[] = Array(8).fill(0).map((_, i) =>
    (trueScores[i] + trueScores[i + 8] + trueScores[i + 16] + trueScores[i + 24] + trueScores[i + 32]) / 5
  );

  const sortedScores = sortLabeledScores(labels, resultScores, 'desc');
  const sortedLabels = sortedScores.map((score) => score.label);
  const sortedResultScores = sortedScores.map((score) => score.value);

  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
  };

  const handleToggleSort = () => {
    // スコアのソート順を切り替える
    setSortDescending(!sortDescending);
  };

  const options = horizontalBarOptions({
    title: 'あなたのキャリア・アンカー',
    xMax: 9,
    xStepSize: 1,
    xGridLineWidth: 2,
  });
  const chartData = barChartData({
    labels: sortDescending ? sortedLabels : labels,
    data: sortDescending ? sortedResultScores : resultScores,
  });

  return (
    <div>
      <Head>
        <title>キャリア・アンカー</title>
        <meta name="description" content="キャリア・アンカー診断" />
      </Head>

      <main>
        <h1>キャリア・アンカー</h1>
        <p>
          自己診断用キャリア指向質問票
        </p>
        <p>
          質問にはできるだけ正直に、また素早く答えるようにしてください。どちらかの極に近いと強く感じる場合以外は、あまり極端な点数をつけない方がよいでしょう。
        </p>
        <p>
          以下の40項目ひとつひとつについて、その項目が自分自身にとってどの程度ぴったりあてはまるかを、1から6の間の数字で選択していってください。<br />点数が高いほど、その項目が、自分にそのとおりよくあてはまるということを意味します。
        </p>
        <p>
          1 = 全然そう思わない
        </p>
        <p>
          2, 3 = そう思うこともたまにはある
        </p>
        <p>
          4, 5 = よくそう思う
        </p>
        <p>
          6 = いつもそう思う
        </p>
        <hr style={{ margin: '30px' }} />
        <h2>質問票</h2>
        <p>
          各項目があなたに対してどのくらいぴったりあてはまるのかについて、1から6の数字で点数をつけてください。
        </p>
        <p>
          ☆については、最後に説明があります。
        </p>

        <QuestionList
          questions={questions}
          scores={scores}
          scoreOptions={scoreOptions}
          onAnswer={handleAnswer}
          disabled={showResults}
          renderAfterScoreButtons={(index) => (
            <>
              &ensp;
              <ToggleButton
                label="☆"
                onClick={() => handleAdditionalAnswer(index)}
                selected={additionalScores[index] === 4}
                disabled={showResults}
              />
            </>
          )}
        />
        <hr style={{ margin: '30px' }} />
        <p>
          ひとたび回答し終わりましたら、自分の回答全体をながめ最も高い点数をつけた項目がどこにあるかチェックしてください。<br />さらに、そのなかから自分にいちばんピッタリする項目を<b>3つ</b>選んでください。
        </p>
        <ShowResultsButton
          canShow={shouldShowResultsButton}
          showResults={showResults}
          onShow={handleShowResults}
        />
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <h2>結果</h2>
            <button onClick={handleToggleSort}>{sortDescending ? 'デフォルト順に並べ替え' : '降順に並べ替え'}</button>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={chartData}
                height={350}
                options={options}
              />
            </div>
            {(sortDescending ? sortedLabels : labels).map((label, index) => (
              <div key={label}>
                <p>{label}：{(sortDescending ? sortedResultScores : resultScores)[index].toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{ margin: '30px' }} />
        <p>
          出典：<Link href="https://www.amazon.co.jp/dp/product/4561233857" target="_blank">
            キャリア・アンカー―自分のほんとうの価値を発見しよう
          </Link>
        </p>
      </main>
    </div>
  );
}
