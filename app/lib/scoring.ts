export type ScoreTerm =
  | number
  | {
      item: number;
      reverseMax: number;
    };

export type LabeledScore = {
  label: string;
  value: number;
};

export function allAnswered(scores: number[]) {
  return scores.every((score) => score !== 0);
}

export function sum(scores: number[]) {
  return scores.reduce((total, score) => total + score, 0);
}

export function average(scores: number[]) {
  return scores.length === 0 ? 0 : sum(scores) / scores.length;
}

export function reverseScore(score: number, reverseMax: number) {
  return reverseMax - score;
}

export function scoreTerm(scores: number[], term: ScoreTerm) {
  if (typeof term === 'number') {
    return scores[term - 1];
  }

  return reverseScore(scores[term.item - 1], term.reverseMax);
}

export function sumTerms(scores: number[], terms: ScoreTerm[]) {
  return sum(terms.map((term) => scoreTerm(scores, term)));
}

export function averageTerms(scores: number[], terms: ScoreTerm[]) {
  return terms.length === 0 ? 0 : sumTerms(scores, terms) / terms.length;
}

export function cumulativeLengths(groups: readonly unknown[][]) {
  const lengths = groups.map((group) => group.length);
  let total = 0;

  return [0, ...lengths.map((length) => {
    total += length;
    return total;
  })];
}

export function sumGroups(scores: number[], groups: readonly unknown[][]) {
  const boundaries = cumulativeLengths(groups);

  return groups.map((group, index) => {
    const start = boundaries[index];
    const end = boundaries[index + 1];

    return sum(scores.slice(start, end));
  });
}

export function averageGroups(scores: number[], groups: readonly unknown[][]) {
  return sumGroups(scores, groups).map((score, index) => (
    groups[index].length === 0 ? 0 : score / groups[index].length
  ));
}

export function labelScores(labels: readonly string[], scores: readonly number[]): LabeledScore[] {
  return labels.map((label, index) => ({
    label,
    value: scores[index],
  }));
}

export function sortLabeledScores(
  labels: readonly string[],
  scores: readonly number[],
  direction: 'asc' | 'desc',
) {
  return labelScores(labels, scores).sort((a, b) => (
    direction === 'asc' ? a.value - b.value : b.value - a.value
  ));
}

export function addScores(scores: number[], additionalScores: number[]) {
  return scores.map((score, index) => score + additionalScores[index]);
}

export function adjustedScores(
  scores: number[],
  reverseItemIndexes: readonly number[],
  reverseMax: number,
) {
  return scores.map((score, index) => (
    reverseItemIndexes.includes(index) ? reverseScore(score, reverseMax) : score
  ));
}

export function scoreByInterpretation<T>(
  score: number,
  interpretations: readonly T[],
  isMatch: (interpretation: T, score: number) => boolean,
  fallbackIndex: number,
) {
  return interpretations.find((interpretation) => isMatch(interpretation, score))
    ?? interpretations[fallbackIndex];
}
