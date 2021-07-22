import { fetchJson, postFile, postJson } from './common';
import { TwitterAPI, Tweets } from '../types/api';

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

/**
 * ユーザータイムライン取得
 * @param hostBase
 * @returns
 */
const getStatusesUserTimeLine = async (hostBase: string): Promise<TwitterAPI<Tweets[]>> => {
  const url = `${hostBase}statuses/user_timeline`;
  console.log(`Twitterデータ取得: ${url}`);
  const result = await fetchJson(url);
  return result as TwitterAPI<Tweets[]>;
};

/**
 * メンションタイムライン取得
 * @param hostBase
 * @returns
 */
const getStatusesMentionsTimeLine = async (hostBase: string): Promise<TwitterAPI<Tweets[]>> => {
  const url = `${hostBase}statuses/mentions_timeline`;
  console.log(`Twitterデータ取得: ${url}`);
  const result = await fetchJson(url);
  return result as TwitterAPI<Tweets[]>;
};

/**
 * ハッシュタグタイムライン取得
 * @param hostBase
 * @returns
 */
const getStatusesHash = async (hostBase: string): Promise<TwitterAPI<Tweets[]>> => {
  const url = `${hostBase}statuses/hash`;
  console.log(`Twitterデータ取得: ${url}`);
  const result = await fetchJson(url);
  return result as TwitterAPI<Tweets[]>;
};

/**
 * ツイート実行
 * @param hostBase
 * @param text ツイートテキスト
 * @param mediaIds
 * @param in_reply_to_status_id 返信先のID
 * @param attachment_url 引用RTの時に指定するURL(IDではなく、フルのURL)
 * @returns
 */
const postStatusesUpdate = async (
  hostBase: string,
  text: string,
  mediaIds: string[],
  in_reply_to_status_id: string | null,
  attachment_url: string | null,
): Promise<TwitterAPI<Tweets[]>> => {
  const url = `${hostBase}statuses/update`;
  const postObject = {
    status: text,
    media_ids: mediaIds,
    in_reply_to_status_id: in_reply_to_status_id,
    attachment_url: attachment_url,
  };
  const result = await postJson(url, postObject);
  return result as TwitterAPI<Tweets[]>;
};

/**
 * 画像、動画のアップロード
 * @param hostBase
 * @param file
 * @returns
 */
const postMediaUpload = async (hostBase: string, file: File): Promise<TwitterAPI<{ media_id_string: string }>> => {
  const url = `${hostBase}media/upload`;
  const result = await postFile(url, file);
  return result as TwitterAPI<{ media_id_string: string }>;
};

/**
 * ツイート削除
 * @param hostBase
 * @param id
 * @returns
 */
const postStatusesDestroy = async (hostBase: string, id: string): Promise<TwitterAPI<undefined>> => {
  const url = `${hostBase}statuses/destroy/${id}`;
  const result = await postJson(url, {});
  return result as TwitterAPI<undefined>;
};

export const tweetToUrl = (tweet: Tweets): string => {
  const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

  return url;
};

export const tweetToReplyUrl = (tweet: Tweets): string => {
  if (tweet.in_reply_to_screen_name) {
    return `https://twitter.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;
  } else {
    return '';
  }
};

export const tweetTextUrlReplace = (tweet: Tweets): string => {
  let text = tweet.text;
  try {
    if (tweet.entities) {
      for (const urlinfo of tweet.entities.urls) {
        const replaceTarget = urlinfo.url;
        const replaceUrl = urlinfo.expanded_url;
        text = text.replace(replaceTarget, replaceUrl);
      }
    }
  } catch (e) {
    // 何かあったらしい
  }

  return text;
};

export const twitterApi = {
  getStatusesUserTimeLine,
  getStatusesMentionsTimeLine,
  getStatusesHash,
  postStatusesUpdate,
  postMediaUpload,
  postStatusesDestroy,
};
