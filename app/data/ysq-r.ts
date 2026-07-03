export const schemaLabels = [
  { code: 'ED', name: '愛情剥奪' },
  { code: 'AB', name: '見捨てられ' },
  { code: 'MA', name: '不信・虐待' },
  { code: 'SI', name: '孤立' },
  { code: 'DS', name: '欠陥・恥' },
  { code: 'FA', name: '失敗' },
  { code: 'DI', name: '無能・依存' },
  { code: 'VH', name: 'すべてが怖い' },
  { code: 'EM', name: '巻き込まれ' },
  { code: 'SB', name: '服従' },
  { code: 'SS', name: '自己犠牲' },
  { code: 'FLC', name: '自己規制の失敗' },
  { code: 'EC', name: '感情抑制' },
  { code: 'US', name: '完璧主義' },
  { code: 'ET', name: '俺様' },
  { code: 'IS', name: 'コントロール不可能' },
  { code: 'AS', name: 'ほめられたい' },
  { code: 'NP', name: 'ネガティブ注意' },
  { code: 'PUS', name: '罰するべき（自分）' },
  { code: 'PUO', name: '罰するべき（他人）' },
];

export const labels = schemaLabels.map((label) => label.code);

export const scoreOptions = [1, 2, 3, 4, 5, 6];

export { questionGroups, questions } from './generated/ysq-r';
