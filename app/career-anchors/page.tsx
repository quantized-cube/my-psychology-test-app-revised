'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { Bar } from 'react-chartjs-2'; // react-chartjs-2をインポート
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

const labels = [
  '専門・職能別コンピタンス',
  '全般管理コンピタンス',
  '自律・独立',
  '保障・安定',
  '起業家的創造性',
  '奉仕・社会貢献',
  '純粋な挑戦',
  '生活様式',
];

const labelsShort = [
  'TF',
  'GM',
  'AU',
  'SE',
  'EC',
  'SV',
  'CH',
  'LS',
];

const questions = [
  // 1
  '「このことならあのひとに聞け」と絶えず専門家としてのアドバイスを求められる分野でうまくやっていくことをめざす。',
  '他の人びとのやる気をまとめあげ、チームをマネジメントすることによって大きな成果を上げることができたときに、最も大きな充実感を仕事に感じる。',
  '自分のやり方、自分のスケジュールどおりに、自由に仕事ができるようなキャリアをめざす。',
  '自由や自律を勝ち取るよりも、将来の保障や安定を得ることが、自分にとってはより重要なことだ。',
  '常に自分の事業を起こすことができそうなアイデアを探している。',
  '社会に本当に貢献できていると感じられるときにこそ、キャリアがうまくいきそうだと感じる。',
  '難題を解決したり、とてつもない挑戦課題にみまわれた状況を打破したりできるようなキャリアをめざす。',
  '家族とともに楽しみにしていることが犠牲になってしまう仕事に異動させられるぐらいなら、その組織をやめた方がましだ。',
  // 9
  'キャリアを通じて専門技能や職能分野の技能をすごく高度に磨き上げることができるならキャリアがうまくいきそうだと感じる。',
  '複雑な組織を率い、大勢の人びとを左右する意思決定を自分で下すような立場をめざす。',
  'どのような課題をどのような日程と手順でおこなうのか、について自分の思いどおりになるとき、最も大きな充実感を仕事に感じる。',
  '安定した職務保障もなしに仕事に配属させられるくらいなら、すっぱりとその組織を離れるだろう。',
  '他人の経営する組織でマネジャーとして高い職位につくよりも、むしろ自分の事業を起こすことを重視する。',
  'キャリアを通じて、他の人びとのために自分の才能を役立てることができたときに、最も大きな充実感を自分のキャリアに感じる。',
  '非常に難しい挑戦課題に直面し、それを克服できたときにこそ、キャリアがうまくいきそうだと感じる。',
  '自分が家族がらみで望んでいることと、仕事から要請されることとがうまく両立できるキャリアをめざす。',
  // 17
  'ゼネラル・マネジャー（部門長）になるよりも、自分の専門職能分野で上級マネジャーになる方が、より魅力的に感じられる。',
  '何らかの組織でゼネラル・マネジャー（部門長）の立場で仕事をするときにこそ、キャリアがうまくいきそうだと感じる。',
  '完全な自律や自由を獲得したときにこそ、キャリアがうまくいきそうだと感じる。',
  '将来が安定していて安心感のもてる会社での仕事を求めている。',
  '自分自身のアイデアと努力だけによって何かを創り上げたときに、最も大きな充実感を自分のキャリアに感じる。',
  'マネジャーとして高い職位につくことよりも、自分の技能を生かして少しでも世の中を住みやすく働きやすくする方が、もっと大切だと思う。',
  '一見解決不可能と思われた問題を解決したり、どうにもならないような局面を打開したとき、最も大きな充実感を自分のキャリアに感じる。',
  '自分の個人的な要望、家族からの要望、キャリアに求められることをうまくバランスさせることができたときにこそ、キャリアがうまくいきそうだと感じる。',
  // 25
  '自分の専門領域からはずれてしまうような人事異動をローテーションとして受入れるくらいなら、むしろその組織をやめる。',
  '今の自分の専門職能領域で上級マネジャーになるよりも、ゼネラル・マネジャー（部門長）として仕事をするほうが魅力的だと思う。',
  '将来が保障された安心なことよりも、規則や規制にしばられず、自分のやりたいように仕事できるチャンスが大切だと思う。',
  '収入面、雇用面で完全に保障されていると感じられるときに、最も大きな充実感を仕事に感じる。',
  '自分自身の生み出した製品やアイデアで何かを創り出し、軌道にのせたときこそ、キャリアがうまくいきそうだと感じる。',
  '人類や社会にほんとうの貢献ができるキャリアをめざす。',
  '自分の問題解決能力、競争に打ち勝つ能力をフルに生かせる挑戦機会を求めている。',
  'マネジャーとして高い地位につくことよりも、自分の個人的な生活と仕事生活の両方をうまくバランスさせるほうが大切だと思う。',
  // 33
  '自分独特の技能や才能を活用できたときに、最も大きな充実感を仕事に感じる。',
  'ゼネラル・マネジャー（部門長）になるコースから外れてしまいそうな仕事をやらされるぐらいなら、そんな組織はやめてしまう。',
  '自律して自由に行動できないような仕事につくくらいなら、そんな組織はやめてしまう。',
  '将来が保障され安心感をもって仕事に取り組めるようなキャリアをめざす。',
  '自分自身の事業を起こし、それを軌道にのせることをめざす。',
  '他の人びとの役に立つために能力を発揮することができないような配属を拝受するぐらいなら、その組織をやめたいと思う。',
  'ほとんど解決できそうもない問題に挑戦できるということは、マネジャーとして高い地位につくことよりももっと大切である。',
  '自分個人や家族の関心事にあまりマイナスの影響がないような仕事の機会をいつも求めている。',
];

export default function Home() {
  const [scores, setScores] = useState<number[]>(Array(questions.length).fill(0));
  const [additionalScores, setAdditionalScores] = useState<number[]>(Array(questions.length).fill(0));
  const trueScores = scores.map((score, index) => score + additionalScores[index]);
  const [showResults, setShowResults] = useState(false); // 結果を表示するための状態
  const shouldShowResultsButton1 = scores.every((score) => score !== 0); // scoresに0が含まれていないかチェック
  const shouldShowResultsButton2 = (additionalScores.reduce((a, b) => a + b, 0) === 12);
  const shouldShowResultsButton = shouldShowResultsButton1 && shouldShowResultsButton2;
  const [sortDescending, setSortDescending] = useState(false); // スコアの降順ソートトグル

  const handleAnswer = (index: number, score: number) => {
    const newScores = [...scores];
    newScores[index] = score;
    setScores(newScores);
  };
  const handleAdditionalAnswer = (index: number, score: string) => {
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

  const pairLabelsAverageScores = labels.map((label, index) => [label, resultScores[index]]);
  // 一旦オブジェクトに変換
  const objLabelsAverageScores: { [key: string]: number } = Object.fromEntries(pairLabelsAverageScores);
  // キーを含んだ配列に変換
  const array = Object.keys(objLabelsAverageScores).map((k) => ({ key: k, value: objLabelsAverageScores[k] }));
  // スコアの降順
  array.sort((a, b) => b.value - a.value);
  // オブジェクトに戻す
  const sortedObjLabelsAverageScores = Object.assign({}, ...array.map((item) => ({
    [item.key]: item.value,
  })));
  // スコアの降順のラベル
  const sortedLabels = Object.keys(sortedObjLabelsAverageScores);
  // スコアの降順のスコア
  const sortedResultScores: number[] = Object.values(sortedObjLabelsAverageScores);

  const resultMessages: string[] = [];
  for (let i = 0; i < 5; i++) {
    const resultMessage = `${labels[i]}のスコア ${resultScores[i]}`;
    resultMessages.push(resultMessage);
  }

  const handleShowResults = () => {
    // 結果を表示するボタンをクリックしたら結果を表示
    setShowResults(true);
  };

  const handleToggleSort = () => {
    // スコアのソート順を切り替える
    setSortDescending(!sortDescending);
  };

  // 棒グラフのデータ
  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 5,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 9,
        ticks: {
          stepSize: 1,
        },
        grid: {
          lineWidth: 2,
        },
      }
    },
    plugins: {
      legend: {
        // position: 'right' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'あなたのキャリア・アンカー',
      },
    },
  };
  const barChartData = {
    labels: sortDescending ? sortedLabels : labels,
    datasets: [
      {
        label: 'スコア',
        data: sortDescending ? sortedResultScores : resultScores,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderWidth: 3,
        hoverBackgroundColor: 'rgba(80, 200, 200, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

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

        {questions.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            {[1, 2, 3, 4, 5, 6].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(index, score)}
                className={scores[index] === score ? 'selected' : ''}
                disabled={showResults} // 結果表示中はボタンを無効化
              >
                {score}
              </button>
            ))}
            &ensp;
            {['☆'].map((score) => (
              <button
                key={score}
                onClick={() => handleAdditionalAnswer(index, score)}
                className={additionalScores[index] === 4 ? 'selected' : ''}
                disabled={showResults} // 結果表示中はボタンを無効化
              >
                {score}
              </button>
            ))}
          </div>
        ))}
        <hr style={{ margin: '30px' }} />
        <p>
          ひとたび回答し終わりましたら、自分の回答全体をながめ最も高い点数をつけた項目がどこにあるかチェックしてください。<br />さらに、そのなかから自分にいちばんピッタリする項目を<b>3つ</b>選んでください。
        </p>
        {shouldShowResultsButton && <hr style={{ margin: '30px' }} />}
        {shouldShowResultsButton && !showResults && (
          <div style={{ marginTop: '30px' }}>
            <button onClick={handleShowResults}>結果を表示</button>
          </div>
        )}
        {showResults && ( // 結果を表示する場合に表示
          <div>
            <h2>結果</h2>
            <button onClick={handleToggleSort}>{sortDescending ? 'デフォルト順に並べ替え' : '降順に並べ替え'}</button>
            <div className="mx-auto max-w-min">
              <Bar // 棒グラフを表示
                data={barChartData}
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