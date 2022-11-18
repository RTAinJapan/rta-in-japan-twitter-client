import { fetchJson, postFile, postJson } from './common';
import { RequestUpdate, SstatusesResponse, Statuses } from '../types/api';

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
const getStatusesUserTimeLine = async (hostBase: string): Promise<SstatusesResponse<Statuses[]>> => {
  const url = `${hostBase}/statuses/user_timeline`;
  console.log(`Twitterデータ取得: ${url}`);
  const result = await fetchJson(url);
  return result as SstatusesResponse<Statuses[]>;
};

/**
 * メンションタイムライン取得
 * @param hostBase
 * @returns
 */
const getStatusesMentionsTimeLine = async (hostBase: string): Promise<SstatusesResponse<Statuses[]>> => {
  const url = `${hostBase}/statuses/mentions_timeline`;
  console.log(`Twitterデータ取得: ${url}`);
  const result = await fetchJson(url);
  return result as SstatusesResponse<Statuses[]>;
};

/**
 * ハッシュタグタイムライン取得
 * @param hostBase
 * @returns
 */
const getStatusesHash = async (hostBase: string): Promise<SstatusesResponse<Statuses[]>> => {
  const url = `${hostBase}/statuses/hash`;
  console.log(`Twitterデータ取得: ${url}`);
  const result = await fetchJson(url);
  return result as SstatusesResponse<Statuses[]>;
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
  in_reply_to_tweet_id: string | null,
  quote_tweet_id: string | null,
): Promise<SstatusesResponse<Statuses[]>> => {
  const url = `${hostBase}/statuses/update`;
  const postObject: RequestUpdate = {
    status: text,
    media_ids: mediaIds,
    in_reply_to_tweet_id: in_reply_to_tweet_id,
    quote_tweet_id: quote_tweet_id,
  };
  const result = await postJson(url, postObject);
  return result as SstatusesResponse<Statuses[]>;
};

/**
 * 画像、動画のアップロード
 * @param hostBase
 * @param file
 * @returns
 */
const postMediaUpload = async (hostBase: string, file: File): Promise<SstatusesResponse<{ media_iding: string }>> => {
  const url = `${hostBase}/media/upload`;
  const result = await postFile(url, file);
  return result as SstatusesResponse<{ media_iding: string }>;
};

/**
 * ツイート削除
 * @param hostBase
 * @param id
 * @returns
 */
const postStatusesDestroy = async (hostBase: string, id: string): Promise<SstatusesResponse<undefined>> => {
  const url = `${hostBase}/statuses/destroy/${id}`;
  const result = await postJson(url, {});
  return result as SstatusesResponse<undefined>;
};

export const tweetToUrl = (tweet: Statuses): string => {
  const url = `https://twitter.com/${tweet.user.username}/status/${tweet.id}`;

  return url;
};

export const tweetToReplyUrl = (tweet: Statuses): string => {
  const { in_reply_to_status } = tweet;
  if (in_reply_to_status) {
    return `https://twitter.com/${in_reply_to_status.user.username}/status/${in_reply_to_status.id}`;
  } else {
    return '';
  }
};

/**
 * ツイートのオブジェクトから、本文をいい感じに整形して出力する
 * @param tweet
 * @returns
 */
export const tweetTextUrlReplace = (tweet: Statuses): string => {
  let text = tweet.text;
  try {
    if (tweet.entities) {
      // メンション部分を削る
      if (tweet.entities.mentions.length > 0) {
        text = text.slice(tweet.entities.mentions[tweet.entities.mentions.length - 1].end);
      }

      // 謎の短縮URLを展開表示する
      for (const urlinfo of tweet.entities.urls) {
        const replaceTarget = urlinfo.url;
        const replaceUrl = urlinfo.expanded_url;
        text = text.replace(replaceTarget, replaceUrl);
      }
    }

    // なぜかくっついてくる画像・動画の短縮URLを削除する
    // if (tweet.media) {
    //   const mediaList = tweet.media;
    //   for (const media of mediaList) {
    //     text = text.replace(media.url, '');
    //   }
    // }
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
