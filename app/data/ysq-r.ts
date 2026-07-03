export const labels = [
  'ED',
  'AB',
  'MA',
  'SI',
  'DS',
  'FA',
  'DI',
  'VH',
  'EM',
  'SB',
  'SS',
  'FLC',
  'EC',
  'US',
  'ET',
  'IS',
  'AS',
  'NP',
  'PUS',
  'PUO',
];

export const dictLabels: { [key: string]: string } = {
  'ED': '愛情剥奪',
  'AB': '見捨てられ',
  'MA': '不信・虐待',
  'SI': '孤立',
  'DS': '欠陥・恥',
  'FA': '失敗',
  'DI': '無能・依存',
  'VH': 'すべてが怖い',
  'EM': '巻き込まれ',
  'SB': '服従',
  'SS': '自己犠牲',
  'FLC': '自己規制の失敗',
  'EC': '感情抑制',
  'US': '完璧主義',
  'ET': '俺様',
  'IS': 'コントロール不可能',
  'AS': 'ほめられたい',
  'NP': 'ネガティブ注意',
  'PUS': '罰するべき（自分）',
  'PUO': '罰するべき（他人）',
};

export const scoreOptions = [1, 2, 3, 4, 5, 6];

export { questionGroups, questions } from './generated/ysq-r';
