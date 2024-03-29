import { createAction } from 'typesafe-actions';
import { PreviewFile, Config } from '../types/global';
import { DialogState, RootState } from '../reducers';
import { Statuses, Game, Media } from '../types/api';

const OPEN_NOTIFY = 'OPEN_NOTIFY';
const CLOSE_NOTIFY = 'CLOSE_NOTIFY';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const RELOAD_TWEET_LIST = 'RELOAD_TWEET_LIST';
const UPDATE_TWEET_LIST = 'UPDATE_TWEET_LIST';
const UPDATE_TWEET_TEXT = 'UPDATE_TWEET_TEXT';
const SUBMIT_TWEET = 'SUBMIT_TWEET';
const DELETE_TWEET = 'DELETE_TWEET';
const ADD_REPLY_TWEET = 'ADD_REPLY_TWEET';
const DELETE_REPLY_TWEET = 'DELETE_REPLY_TWEET';
const ADD_ATTACH_URL = 'ADD_ATTACH_URL';
const DELETE_ATTACH_URL = 'DELETE_ATTACH_URL';

const DIALOG_YES = 'DIALOG_YES';
const DIALOG_NO = 'DIALOG_NO';

const UPLOAD_MEDIA = 'UPLOAD_MEDIA';
const STORE_MEDIA = 'STORE_MEDIA';
const DELETE_MEDIA = 'DELETE_MEDIA';

const LOGIN_DISCORD = 'LOGIN_DISCORD';
const LOGOUT_DISCORD = 'LOGOUT_DISCORD';
const STORE_DISCORD_USER_NAME = 'STORE_DISCORD_USER_NAME';

const STORE_CONFIG = 'STORE_CONFIG';

const UPDATE_STATUS = 'UPDATE_STATUS';
export const updateStatus = createAction(UPDATE_STATUS, (action) => {
  return (status: RootState['reducer']['status']) => action(status);
});

export const storeConfig = createAction(STORE_CONFIG, (action) => {
  return (config: Config) => action(config);
});

/** 通知欄表示 */
export const changeNotify = createAction(OPEN_NOTIFY, (action) => {
  return (show: boolean, type: 'info' | 'warning' | 'error', message: string, closable?: boolean) => action({ show, type, message, closable: closable === false ? false : true });
});
/** 通知欄閉じる */
export const closeNotify = createAction(CLOSE_NOTIFY);

/** ダイアログ表示 */
export const changeDialog = createAction(OPEN_DIALOG, (action) => {
  return (args: Partial<DialogState>) => action(args);
});
/** ダイアログ閉じる */
export const closeDialog = createAction(CLOSE_DIALOG);

export const dialogYes = createAction(DIALOG_YES, (action) => {
  return (args: any) => action(args);
});
export const dialogNo = createAction(DIALOG_NO, (action) => {
  return (args: any) => action(args);
});

/** ツイートリロードボタン */
export const reloadTweetList = createAction(RELOAD_TWEET_LIST);

/** ツイート取得結果更新 */
export const updateTweetList = createAction(UPDATE_TWEET_LIST, (action) => {
  return (list: Statuses[], type: 'user' | 'hash' | 'mention') => action({ list, type });
});

/** 投稿テキストの格納 */
export const updateTweetText = createAction(UPDATE_TWEET_TEXT, (action) => {
  return (text: string) => action(text);
});

/** ツイート送信 */
export const submitTweet = createAction(SUBMIT_TWEET, (action) => {
  return (message: string) => action(message);
});

/** ツイート削除 */
export const deleteTweet = createAction(DELETE_TWEET, (action) => {
  return (id: string) => action(id);
});

/** 返信先設定 */
export const addReplyTweet = createAction(ADD_REPLY_TWEET, (action) => {
  return (tweet: Statuses) => action(tweet);
});

/** 返信先解除 */
export const deleteReplyTweet = createAction(DELETE_REPLY_TWEET, (action) => {
  return () => action();
});

/** 引用先設定 */
export const addAttachUrl = createAction(ADD_ATTACH_URL, (action) => {
  return (tweet: Statuses) => action(tweet);
});

/** 引用先解除 */
export const deleteAttachUrl = createAction(DELETE_ATTACH_URL, (action) => {
  return () => action();
});

/** アップロードするファイルを受け取ってチェックとか */
export const uploadMedia = createAction(UPLOAD_MEDIA, (action) => {
  return (file: File[]) => action(file);
});

/** アップロードするファイルをリストに登録 */
export const storeMedia = createAction(STORE_MEDIA, (action) => {
  return (medias: { file: PreviewFile; media_id_string: string }[]) => action(medias);
});

/** アップロードするファイルを取消 */
export const deleteMedia = createAction(DELETE_MEDIA, (action) => {
  return (index: number) => action(index);
});

// Discord
/** ログインする */
export const loginDiscord = createAction(LOGIN_DISCORD, (action) => {
  return () => action();
});

/** ログアウトする */
export const logoutDiscord = createAction(LOGOUT_DISCORD, (action) => {
  return () => action();
});

/** Discordのユーザ名を格納 */
export const storeDiscordUserName = createAction(STORE_DISCORD_USER_NAME, (action) => {
  return (username: string | null) => action(username);
});

// ゲーム情報
const UPDATE_GAME_LIST = 'UPDATE_GAME_LIST';
/** ゲーム情報更新 */
export const updateGameList = createAction(UPDATE_GAME_LIST, (action) => {
  return (game: Game[]) => action(game);
});

// テーマ設定
const UPDATE_THEME = 'UPDATE_THEME';
export const updateTheme = createAction(UPDATE_THEME, (action) => {
  return (mode: 'light' | 'dark') => action(mode);
});

// メディア
const SHOW_MEDIA = 'SHOW_MEDIA';
export const showMedia = createAction(SHOW_MEDIA, (action) => {
  return (obj: { media: Media[]; index: number }) => action(obj);
});

const CLOSE_MEDIA = 'CLOSE_MEDIA';
export const closeMedia = createAction(CLOSE_MEDIA, (action) => {
  return () => action();
});

const CHANGE_MEDIA_INDEX = 'CHANGE_MEDIA_INDEX';
export const changeMediaIndex = createAction(CHANGE_MEDIA_INDEX, (action) => {
  return (index: number) => action(index);
});
