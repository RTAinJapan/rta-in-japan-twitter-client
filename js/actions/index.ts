import { createAction } from 'typesafe-actions';
import { Config } from '../types/global';
import { DialogState, RootState } from '../reducers';
import { Statuses, Game } from '../types/api';

const OPEN_NOTIFY = 'OPEN_NOTIFY';
const CLOSE_NOTIFY = 'CLOSE_NOTIFY';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const UPDATE_TWEET_LIST = 'UPDATE_TWEET_LIST';
const UPDATE_TWEET_TEXT = 'UPDATE_TWEET_TEXT';

const DIALOG_YES = 'DIALOG_YES';
const DIALOG_NO = 'DIALOG_NO';

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

/** ツイート取得結果更新 */
export const updateTweetList = createAction(UPDATE_TWEET_LIST, (action) => {
  return (list: Statuses[], type: 'user' | 'hash' | 'mention') => action({ list, type });
});

/** 投稿テキストの格納 */
export const updateTweetText = createAction(UPDATE_TWEET_TEXT, (action) => {
  return (text: string) => action(text);
});

// ゲーム情報
const UPDATE_GAME_LIST = 'UPDATE_GAME_LIST';
/** ゲーム情報更新 */
export const updateGameList = createAction(UPDATE_GAME_LIST, (action) => {
  return (game: Game[]) => action(game);
});
