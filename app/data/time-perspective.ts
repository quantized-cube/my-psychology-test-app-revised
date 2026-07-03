import type { ScoreTerm } from '@/app/lib/scoring';

export const labels = [
  '過去肯定型',    // 2，7，11，15，20，25，29，41，49
  '過去否定型',    // 4，5，16，22，27，33，34，36，50，54
  '現在快楽型',    // 1，8，12，17，19，23，26，28，31，32，42，44，46，48，52, 55
  '現在宿命論型',  // 3，14，35，37，38，39，47，53
  '未来志向型',    // 6，9，10，13，18，21，24，30，40，43，45，51，56
];

export const scoreScales: ScoreTerm[][] = [
  [2, 7, { item: 11, reverseMax: 6 }, 15, 20, { item: 25, reverseMax: 6 }, 29, { item: 41, reverseMax: 6 }, 49],
  [4, 5, 16, 22, { item: 27, reverseMax: 6 }, 33, 34, 36, 50, 54],
  [1, 8, 12, 17, 19, 23, 26, 28, 31, 32, 42, 44, 46, 48, { item: 52, reverseMax: 6 }, 55],
  [3, 14, 35, 37, 38, 39, 47, 53],
  [6, { item: 9, reverseMax: 6 }, 10, 13, 18, 21, { item: 24, reverseMax: 6 }, 30, 40, 43, 45, 51, { item: 56, reverseMax: 6 }],
];

export { questions } from './generated/time-perspective';
