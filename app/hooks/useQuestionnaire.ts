import { useState } from 'react';
import { allAnswered } from '@/app/lib/scoring';

type UseQuestionnaireOptions = {
  questionCount: number;
};

export function useQuestionnaire({ questionCount }: UseQuestionnaireOptions) {
  const [scores, setScores] = useState<number[]>(Array(questionCount).fill(0));
  const [showResults, setShowResults] = useState(false);

  const answer = (index: number, score: number) => {
    setScores((currentScores) => {
      const newScores = [...currentScores];
      newScores[index] = score;
      return newScores;
    });
  };

  const show = () => {
    setShowResults(true);
  };

  return {
    scores,
    showResults,
    canShowResults: allAnswered(scores),
    answer,
    show,
  };
}
