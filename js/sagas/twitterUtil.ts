import { Statuses } from '../types/api';

/**
 * Twitterのルールに則り、文字数カウントを行う
 * @param baseStr カウント対象の文字
 */
export const countStr = (baseStr: string): number => {
  if (baseStr.length === 0) return 0;

  // 文字数カウントのルール
  // アジア圏の表記だとMax140文字。(英語圏だと280文字で、要は280Byte相当)
  //
  // 半角：0.5文字。@hogehogeとかも同様のカウント。
  // 全角：1文字
  // URL：11.5文字
  // 改行: 0.5文字

  // URLを含んでいる数
  const urls = baseStr.match(/https?:\/\/[^\s]+/g);
  const urlNum = urls ? urls.length : 0;

  // URLの部分を除外して文字数カウントする
  const pureStr = baseStr.replace(/https?:\/\/[^\s]+/g, '');

  // 半角文字
  const halfStrMatch = pureStr.match(/[ -~]+/g);
  const halfStr = halfStrMatch ? halfStrMatch.join('') : '';

  // 全角文字
  let fullStr = pureStr.replace(/[ -~]+/g, ''); // 半角を全部除くと全角と改行が残る
  // 改行
  const returMatch = fullStr.match(/\s/g);
  const returnNum = returMatch ? returMatch.length * 0.5 : 0;
  fullStr = fullStr.replace(/\s/g, ''); // 全角だけにする

  // 合計文字数
  const strLen = urlNum * 11.5 + halfStr.length * 0.5 + fullStr.length + returnNum;

  return strLen;
};

export const tweetToUrl = (tweet: Statuses): string => {
  const url = `https://twitter.com/${tweet.username}/status/${tweet.id}`;

  return url;
};
