export type TwitterAPI<T> = {
  code: number;
  data: T;
  error?: {
    message: string;
  };
};

export type Tweets = {
  /** ツイートID */
  id_str: string;
  /** 本文 */
  full_text: string;
  /** 投稿日時 */
  created_at: string;
  display_text_range: [number, number];
  entities?: {
    hashtags: object[];
    symbols: object[];
    urls: {
      display_url: string;
      expanded_url: string;
      indices: [number, number];
      url: string;
      user_mentions: object[];
    }[];
  };
  /** 添付画像とか */
  extended_entities?: {
    media: {
      display_url: string;
      expanded_url: string;
      id_str: string;
      indices: [number, number];
      /** 画像のURL。動画のときも画像 */
      media_url_http: string;
      /** 画像のURL。動画のときも画像 */
      media_url_https: string;
      sizes: {
        large: MediaSize;
        medium: MediaSize;
        small: MediaSize;
        thumb: MediaSize;
      };
      type: 'photo' | 'video';
      /** mediaのURL。ブラウザで開くときのURLで短縮URL形式。textにも含まれてる。 */
      url: string;
    }[];
  };
  /** 返信先のscreen_name */
  in_reply_to_screen_name?: string;
  /** 返信先のツイートID */
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;

  /** 引用RTの内容 */
  quoted_status?: Tweets;

  /** ユーザ情報 */
  user: {
    created_at: string;
    id_str: string;
    name: string;
    screen_name: string;
    profile_image_url_https: string;
  };
};

type MediaSize = {
  w: number;
  h: number;
  resize: 'fit' | 'crop';
};

type Runner = {
  username: string;
  twitterid: string;
};
type Commentary = Runner;

/** GASから取得するAPI */
export type Game = {
  id: number;
  gamename: string;
  category: string;
  gameAndCategory: string;
  runner: Runner[];
  commentary: Commentary[];
};
