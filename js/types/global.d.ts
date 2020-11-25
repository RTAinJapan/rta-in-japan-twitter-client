declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

export type ArrayItem<T extends any[]> = T extends (infer Titem)[] ? Titem : never;
export type ResolvedType<T> = T extends Promise<infer R> ? R : T;
export type GeneratorType<T extends (...args: any) => any> = ResolvedType<ReturnType<T>>;

export type PreviewFile = File & {
  preview: any;
};

export type Config = {
  /** APIの設定 */
  api: {
    /** TwitterAPIのURL */
    twitterBase: string;
    /** 走者情報APIのURL */
    runner: string;
  };
  /** Discordの設定 */
  discord: {
    config: {
      baseUrl: string;
      clientId: string;
      clientSecret: string;
      redirectUrl: string;
      scope: string;
    };
    /** サーバID */
    guild: string;
    /** 権限ID */
    roles: string[];
    /** この画面を操作できるユーザID。 */
    users: string[];
  };
  tweetTemplate: {
    withCommentary: string[];
    withOutCommentary: string[];
    common: string[];
    footer: string;
  };
  link: {
    name: string;
    url: string;
    iconUrl: string;
  }[];
};
