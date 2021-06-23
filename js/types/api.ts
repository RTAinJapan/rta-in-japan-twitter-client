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
  text: string;
  created_at: string;
  user: {
    created_at: string;
    id_str: string;
    name: string;
    screen_name: string;
    profile_image_url_https: string;
  };
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
