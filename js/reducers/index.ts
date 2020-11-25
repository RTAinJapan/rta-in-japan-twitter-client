import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import { PreviewFile, Config } from '../types/global';
import { Tweets, Game } from '../types/api';
type Action = ActionType<typeof actions>;

export type DialogState = {
  /** ダイアログ表示 */
  show: boolean;
  /** 確認ダイアログか否か */
  confirm: boolean;
  /** ダイアログ種別 */
  type: 'info' | 'warning' | 'error';
  /** 簡潔に表すメッセージ */
  message: string;
  /** テキストボックスとかで表示したい詳細 */
  detail: string;
};

export type GlobalState = {
  status: 'initialzing' | 'uploading' | 'posting' | 'ok' | 'error';
  /** 通知欄 */
  notify: {
    /** 表示可否 */
    show: boolean;
    /** 色 */
    type: 'info' | 'warning' | 'error';
    /** メッセージ */
    message: string;
    /** 手動で閉じられるか */
    closable: boolean;
  };
  /** Discord */
  discord: {
    username: string | null;
    token: string | null;
  };
  /** ダイアログ */
  dialog: DialogState;
  /** ツイート一覧 */
  twitterTimeline: {
    /** 自分の結果 */
    user: Tweets[];
    /** メンションの結果 */
    mention: Tweets[];
    /** ハッシュタグで検索した結果 */
    hash: Tweets[];
  };
  /** Twitterに投稿する内容 */
  post: {
    text: string;
    media: {
      media_id_string: string;
      file: PreviewFile;
    }[];
  };
  /** ゲーム情報 */
  game: Game[];
  /** 設定ファイルの内容 */
  config: Config;
};

export type RootState = {
  reducer: GlobalState;
};

const initial: GlobalState = {
  status: 'ok',
  // 通知欄
  notify: {
    show: false,
    type: 'info',
    message: '',
    closable: true,
  },
  dialog: {
    show: false,
    confirm: false,
    type: 'info',
    message: '',
    detail: '',
  },
  discord: {
    username: null,
    token: null,
  },
  twitterTimeline: {
    user: [],
    mention: [],
    hash: [],
  },
  post: {
    text: '',
    media: [],
  },
  game: [],
  config: {
    api: {
      twitterBase: '',
      runner: '',
    },
    discord: {
      config: {
        baseUrl: '',
        clientId: '',
        clientSecret: '',
        redirectUrl: '',
        scope: '',
      },
      guild: '',
      roles: [],
      users: [],
    },
    tweetTemplate: {
      withCommentary: [],
      withOutCommentary: [],
      common: [],
      footer: '',
    },
    link: [],
  },
};

const reducer = (state: GlobalState = initial, action: Action): GlobalState => {
  switch (action.type) {
    case getType(actions.updateStatus): {
      return { ...state, status: action.payload };
    }
    case getType(actions.storeConfig): {
      return { ...state, config: action.payload };
    }
    case getType(actions.changeNotify): {
      return { ...state, notify: { ...action.payload } };
    }
    case getType(actions.closeNotify): {
      return { ...state, notify: { ...state.notify, show: false } };
    }
    case getType(actions.changeDialog): {
      if (action.payload.show === false) {
        return { ...state, dialog: initial.dialog };
      } else {
        return { ...state, dialog: { ...state.dialog, ...action.payload } };
      }
    }
    case getType(actions.closeDialog): {
      return { ...state, dialog: { ...initial.dialog } };
    }
    // ツイートを取得
    case getType(actions.updateTweetList): {
      return {
        ...state,
        twitterTimeline: {
          ...state.twitterTimeline,
          [action.payload.type]: action.payload.list,
        },
      };
    }
    case getType(actions.updateTweetText): {
      return {
        ...state,
        post: {
          ...state.post,
          text: action.payload,
        },
      };
    }
    case getType(actions.storeMedia): {
      return {
        ...state,
        post: {
          ...state.post,
          media: action.payload,
        },
      };
    }
    case getType(actions.storeDiscordUserName): {
      return {
        ...state,
        discord: {
          ...state.discord,
          username: action.payload,
        },
      };
    }
    case getType(actions.updateGameList): {
      return {
        ...state,
        game: action.payload,
      };
    }
    default:
      return state;
  }
};

export default combineReducers({ reducer });
