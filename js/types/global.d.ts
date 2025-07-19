import { Game } from './api';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

export type ArrayItem<T extends any[]> = T extends (infer Titem)[] ? Titem : never;
export type ResolvedType<T> = T extends Promise<infer R> ? R : T;
export type GeneratorType<T extends (...args: any) => any> = ResolvedType<ReturnType<T>>;

export type PreviewFile = File & {
  /** アップロード元のファイルパス */
  path: string;
  /**
   * プレビュー用のblob URL
   * @example "blob:http://localhost:8080/94ec5c08-b859-4e01-9f85-f37b99ba2e9c"
   */
  preview: string;
  /**
   * ファイルタイプ
   * @example "video/mp4"
   */
  type: string;
};

export type RunnersAPI = { status: string; version: string; data: Game[] };

export type Config = {
  /** APIの設定 */
  api: {
    /** 走者情報APIのURL */
    runner: string;
  };
  tweetTemplate: {
    title: string;
    type: 'withCommentary' | 'withOutCommentary' | 'common';
    text: string;
    additional?: string;
  }[];
  tweetFooter: string;
};
