export type SstatusesResponse<T> = {
  code: number;
  data: T;
  error?: {
    message: string;
  };
};

export type Statuses = {
  /** ツイートID */
  id: string;
  /** 本文 */
  text: string;
  // /** ユーザ情報 */
  username: string;
  // user: User;
  /** 投稿日時 */
  created_at: string;
  // /** ハッシュとかいろいろ */
  // entities?: StatusesEntities;
  // /** 画像とか動画 */
  // media?: Media[];
  // /** 返信先のツイートID */
  // in_reply_to_status?: Statuses;
  // /** 引用RTの内容 */
  // quoted_status?: Statuses;
};

// export type User = {
//   created_at: string;
//   id: string;
//   name: string;
//   username: string;
//   profile_image_url: string;
// };

export type StatusesEntities = {
  annotations: [];
  urls: {
    /** @example 10 */
    start: number;
    /** @example 33 */
    end: number;
    /** @example https://t.co/9BbWekeWq2 */
    url: string;
    /** @example https://twitter.com/TwitterDev/status/1374104599456534531 */
    expanded_url: string;
    /** @example twitter.com/TwitterDev/sta… */
    display_url: string;

    /** mediaを一意に特定するkey。メディアに関するURLの時だけある */
    media_key?: string;
  }[];

  hashtags: object[];

  mentions: {
    /** @example 0 */
    start: number;
    /** @example 11 */
    end: number;
    /** @example '2244994945' */
    id: string;
    /** @example 'TwitterDev' */
    username: string;
  }[];

  cashtags: object[];
};

export type Media = {
  /** @example '13_1263145212760805376' */
  media_key: string;
  /** @example  */
  type: 'animated_gif' | 'photo' | 'video';
  /**
   * photoの時だけある
   * @example 'https://pbs.twimg.com/media/FfU1mugVUAA4yum.jpg'
   */
  url?: string;
  /**
   * videoの時だけある
   * @example 'https://pbs.twimg.com/ext_tw_video_thumb/1582229783521288194/pu/img/E63l4dXvk1wL6EJm.jpg'
   */
  preview_image_url?: string;
  /** @example 1920 */
  width: number;
  /** @example 1080 */
  height: number;

  /** Each media object may have multiple display or playback variants, with different resolutions or formats */
  variants?: {
    bit_rate: number;
    content_type: string;
    url: string;
  }[];
};

// export type Media = {
//   display_url: string;
//   expanded_url: string;
//   id: string;
//   indices: [number, number];
//   /** 画像のURL。動画のときも画像 */
//   media_url_http: string;
//   /** 画像のURL。動画のときも画像 */
//   media_url_https: string;
//   sizes: {
//     large: MediaSize;
//     medium: MediaSize;
//     small: MediaSize;
//     thumb: MediaSize;
//   };
//   type: 'photo' | 'video';
//   /** mediaのURL。ブラウザで開くときのURLで短縮URL形式。textにも含まれてる。 */
//   url: string;
//   /** 動画情報。type:videoの時だけkeyがある */
//   video_info?: {
//     /** 16, 9みたいなの */
//     aspect_ratio: [number, number];
//     /** 動画の長さ(ミリ秒) */
//     duration_millis: number;
//     variants: {
//       /** ビットレート */
//       bitrate: number;
//       /** @example "video/mp4" */
//       content_type: string;
//       /** mp4とかのURL */
//       url: string;
//     }[];
//   };
// };

// type MediaSize = {
//   w: number;
//   h: number;
//   resize: 'fit' | 'crop';
// };

export type RequestUpdate = {
  /**
   * ツイート本文
   * @example "走者乙ｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗｗ"
   */
  status: string;
  /**
   * 事前にアップロードした画像・動画のID
   * @example ['710511363345354753']
   */
  media_ids: string[];
  /**
   * リプライ先のツイートID
   */
  in_reply_to_tweet_id: string | null;
  /**
   * 引用RTの引用元ツイートID
   */
  quote_tweet_id: string | null;
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
