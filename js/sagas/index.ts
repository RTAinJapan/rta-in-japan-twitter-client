import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { alertSaga, confirmSaga } from './dialog';
import { DialogState, RootState } from '../reducers';
import { PreviewFile, Config, GeneratorType, RunnersAPI } from '../types/global';
import { loginCheck, logoutDiscord, oauthDiscord } from './discord';
import { fetchJson, postJson } from './common';
import { twitterApi } from './twitterUtil';

export default function* rootSaga() {
  // テーマ設定
  yield call(setTheme);
  // 設定読み込み
  yield call(fetchConfig);

  yield takeEvery(actions.loginDiscord, oauthDiscord);
  yield takeEvery(actions.reloadTweetList, fetchTweetListAndApplyState);
  yield takeEvery(actions.submitTweet, submitTweet);
  yield takeEvery(actions.deleteTweet, deleteTweet);
  yield takeEvery(actions.uploadMedia, uploadMedia);
  yield takeEvery(actions.deleteMedia, deleteMedia);

  yield takeEvery(actions.addReplyTweet, addReplyTweet);
  yield takeEvery(actions.addAttachUrl, addRetweet);

  yield takeEvery(actions.logoutDiscord, logoutDiscord);

  yield call(loginCheck);
  // yield put(actions.storeDiscordUserName('テストユーザ'));

  // ゲーム情報
  yield call(fetchGameListAndApplyState);
  // ツイート情報
  yield call(fetchTweetListAndApplyState);
}

function* errorHandler(error: any) {
  try {
    const message = error ? (error.message as string) : '予期せぬエラーが発生しました。';
    yield put(actions.changeNotify(true, 'error', message));
    yield put(actions.updateStatus('error'));
  } catch (e) {
    console.error('★激辛だ★');
  }
}

function* setTheme() {
  try {
    const theme = localStorage.getItem('theme');
    if (!theme) {
      // まだテーマが設定されてない場合はOSのテーマ設定を取得して適用
      if (window.matchMedia('(prefers-color-scheme: dark)').matches == true) {
        console.log('ダークモードだ');
        yield put(actions.updateTheme('dark'));
      } else {
        console.log('ダークモードじゃない');
      }
    } else {
      if (['light', 'dark'].includes(theme)) {
        yield put(actions.updateTheme(theme as any));
      }
    }
  } catch (e) {
    //
  }
}

function* fetchConfig() {
  try {
    const time = new Date().getTime();
    const config: Config = yield call(fetchJson, `./config.json?t=${time}`);
    yield put(actions.storeConfig(config));

    // localstorageにあれば読み込む
    try {
      const localDataStr = localStorage.getItem('runners');
      if (localDataStr) {
        const localData: RunnersAPI = JSON.parse(localDataStr);
        yield put(actions.updateGameList(localData.data));
      }
    } catch (e) {
      //
    }
  } catch (error) {
    yield call(errorHandler, error);
  }
}

/**
 * 各種ツイートデータ取得
 */
function* fetchTweetListAndApplyState() {
  try {
    // ログイン状態でなければ終了
    const state: RootState = yield select();
    if (!state.reducer.discord.username) return;

    yield put(actions.changeNotify(true, 'info', 'ツイート取得中'));

    let error: any = null;

    const tweet: GeneratorType<typeof twitterApi.getStatusesUserTimeLine> = yield call(twitterApi.getStatusesUserTimeLine, state.reducer.config.api.twitterBase);
    if (tweet.code === 0) {
      yield put(actions.updateTweetList(tweet.data, 'user'));
    } else {
      error = tweet.error;
    }

    yield put(actions.changeNotify(true, 'info', 'ツイート取得完了'));
  } catch (error) {
    yield call(errorHandler, error);
  }
}

/**
 * ゲーム、走者データ取得
 */
function* fetchGameListAndApplyState() {
  try {
    // ログイン状態でなければ終了
    const state: RootState = yield select();
    if (!state.reducer.discord.username) return;
    console.log('走者データ取得');

    yield put(actions.changeNotify(true, 'info', '走者データ取得中'));

    const result: RunnersAPI = yield call(fetchJson, state.reducer.config.api.runner);
    // versionがlocalstorageと異なれば破棄
    try {
      const localDataStr = localStorage.getItem('runners');
      if (localDataStr) {
        const localData: RunnersAPI = JSON.parse(localDataStr);
        if (localData.version !== result.version) {
          localStorage.removeItem('runners');
        }
      }
    } catch (e) {
      //
    }

    if (result.status !== 'ok') {
      throw new Error('走者情報の取得に失敗');
    }

    // 走者名に@が含まれている場合はメンションにならないようにスペースを入れる
    result.data = result.data.map((item) => {
      const data = item;
      data.runner = data.runner.map((runner) => {
        return {
          ...runner,
          username: runner.username.replace(/(?<=^|[^a-zA-Z0-9_!#$%&*@＠]|(?:^|[^a-zA-Z0-9_+~.-])(?:rt|RT|rT|Rt):?)([@＠])(?=\w)/g, '$1 '),
        };
      });
      data.commentary = data.commentary.map((commentary) => {
        return {
          ...commentary,
          username: commentary.username.replace(/(?<=^|[^a-zA-Z0-9_!#$%&*@＠]|(?:^|[^a-zA-Z0-9_+~.-])(?:rt|RT|rT|Rt):?)([@＠])(?=\w)/g, '$1 '),
        };
      });
      return data;
    });

    localStorage.setItem('runners', JSON.stringify(result));
    yield put(actions.updateGameList(result.data));

    yield put(actions.changeNotify(true, 'info', '走者データ取得完了'));
  } catch (error) {
    yield call(errorHandler, error);
  }
}

/**
 * ツイート送信
 * @param action
 */
function* submitTweet(action: ReturnType<typeof actions.submitTweet>) {
  try {
    const state: RootState = yield select();

    const imageNum = state.reducer.post.media.filter((item) => item.file.type.includes('image')).length;
    const videoNum = state.reducer.post.media.filter((item) => item.file.type.includes('video')).length;
    const imageStr = imageNum === 0 ? '' : `画像${imageNum}ファイル`;
    const videoStr = videoNum === 0 ? '' : `動画${videoNum}ファイル`;
    let confirmText = imageNum > 0 || videoNum > 0 ? `以下のツイート、及び ${imageStr} ${videoStr} を送信します。` : '以下のツイートを送信します。';
    let type: DialogState['type'] = 'info';

    // なんかヤバそうな内容だったらテキストを追加する
    if (action.payload.length < 20) {
      confirmText += '極端にツイート文が短いようです。';
      type = 'warning';
    }
    if (action.payload.includes('xx:xx')) {
      confirmText += 'タイムがテンプレートのままだったりしませんか。';
      type = 'warning';
    }
    if (action.payload.includes('『』')) {
      confirmText += 'ゲーム名の入力を忘れてませんか。';
      type = 'warning';
    }
    confirmText += 'よろしいですか？';

    const result: boolean = yield call(confirmSaga, confirmText, type, `${action.payload}`);
    if (!result) return;

    yield put(actions.updateStatus('posting'));
    yield put(actions.updateTweetText(action.payload));

    const mediaIds: string[] = state.reducer.post.media.map((media) => media.media_id_string);

    const in_reply_to_status_id = state.reducer.post.in_reply_to_status_id ? state.reducer.post.in_reply_to_status_id.id : null;
    let quote_tweet_id: string | null = null;
    if (state.reducer.post.attachment_tweet) {
      const id = state.reducer.post.attachment_tweet.id;
      quote_tweet_id = id;
    }

    const postResult: GeneratorType<typeof twitterApi.postStatusesUpdate> = yield call(
      twitterApi.postStatusesUpdate,
      state.reducer.config.api.twitterBase,
      action.payload,
      mediaIds,
      in_reply_to_status_id,
      quote_tweet_id,
    );
    if (postResult.code !== 0) throw postResult.error;

    yield put(actions.updateTweetList(postResult.data, 'user'));

    // 各種初期化
    yield put(actions.storeMedia([]));
    yield put(actions.updateTweetText(''));
    yield put(actions.deleteAttachUrl());
    yield put(actions.deleteReplyTweet());
    // 完了通知
    yield put(actions.changeNotify(true, 'info', 'ツイートしました。'));
    yield put(actions.updateStatus('ok'));

    // Webhookに通知
    try {
      if (state.reducer.config.api.webhook) {
        const actionUsername = state.reducer.discord.username;
        const postId = postResult.data[0].id;
        const username = postResult.data[0].username;
        const url = `https://twitter.com/${username}/status/${postId}`;
        const body = {
          content: `${actionUsername} がツイートを実行\n\n ${action.payload} \n\nツイートURL: ${url}`,
        };
        yield call(postJson, state.reducer.config.api.webhook, body);
      }
    } catch (e) {
      //
    }
  } catch (error) {
    yield call(errorHandler, error);
  }
}

/**
 * ツイート削除
 * @param action
 */
function* deleteTweet(action: ReturnType<typeof actions.deleteTweet>) {
  try {
    const state: RootState = yield select();
    const deleteTargetTweet = state.reducer.twitterTimeline.user.filter((tweet) => tweet.id === action.payload);

    if (state.reducer.config.twitter.isAllowDeleteTweet) {
      const isContinue: boolean = yield call(confirmSaga, 'ツイートを削除します。よろしいですか？', 'info', `${deleteTargetTweet[0].text}`);
      if (!isContinue) return;
      yield put(actions.changeNotify(true, 'info', '削除要求中'));

      yield put(actions.updateStatus('posting'));
      // 削除実行
      const result: GeneratorType<typeof twitterApi.postStatusesDestroy> = yield call(twitterApi.postStatusesDestroy, state.reducer.config.api.twitterBase, action.payload);
      if (result.code !== 0) throw result.error;

      // 新しいリストを取得
      const newTweetList: GeneratorType<typeof twitterApi.getStatusesUserTimeLine> = yield call(twitterApi.getStatusesUserTimeLine, state.reducer.config.api.twitterBase);
      if (newTweetList.code !== 0) throw newTweetList.error;
      yield put(actions.updateTweetList(newTweetList.data, 'user'));

      yield put(actions.changeNotify(true, 'info', '削除完了'));
      yield put(actions.updateStatus('ok'));
    } else {
      const tweetText = deleteTargetTweet[0].text;
      const url = `https://twitter.com/${deleteTargetTweet[0].username}/status/${deleteTargetTweet[0].id}`;
      yield call(alertSaga, `このツイートを削除したい場合、以下を運営に連絡してください`, 'info', `${url}\n\n${tweetText}`);
    }
  } catch (error) {
    yield call(errorHandler, error);
  }
}

/**
 * 添付メディアの取消
 * @param action
 */
function* deleteMedia(action: ReturnType<typeof actions.deleteMedia>) {
  try {
    const state: RootState = yield select();
    const orgMedia = state.reducer.post.media;
    const newMedia = orgMedia.filter((media, index) => action.payload !== index);
    yield put(actions.storeMedia(newMedia));
  } catch (error) {
    yield call(errorHandler, error);
  }
}

/**
 * アップロード対象としてメディアが登録された時の処理
 * @param action
 */
function* uploadMedia(action: ReturnType<typeof actions.uploadMedia>) {
  try {
    const state: RootState = yield select();
    const orgMedia = state.reducer.post.media;
    // 何かやってる最中は処理終了
    if (['posting', 'uploading'].includes(state.reducer.status)) return;

    // チェック
    try {
      // 規定の種別以外のファイル
      if (action.payload.length === 0) throw new Error('不正な拡張子のファイルです。');

      const tempMedia: File[] = orgMedia.map((item) => item.file);

      for (const nowMedia of action.payload) {
        console.log(`file: ${nowMedia.name}`);
        // 同名のファイルは不可
        // ただしimage.pngはペーストできたやつなので、チェック対象から除外する
        console.log('ファイル名チェック');
        if ('image.png' !== nowMedia.name) {
          if (tempMedia.map((item) => item.name).includes(nowMedia.name)) throw new Error('同名のファイルは選択できません。');
        }

        // リストに登録できるのは、動画1 or 画像1～4
        console.log('整合性チェック1');
        // 動画があるのに何か指定された
        const isOrgMediaIncludeVideo = tempMedia.filter((media) => media.type.includes('video')).length > 0;
        if (isOrgMediaIncludeVideo) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

        // 何か登録されてるのに動画が指定された
        console.log('整合性チェック2');
        const isNowMediaIncludeVideo = nowMedia.type.includes('video');
        if (tempMedia.length > 0 && isNowMediaIncludeVideo) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

        // なんやかんやで合計が4つ以上になりそう
        console.log('整合性チェック3');
        if (tempMedia.length >= 4) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

        tempMedia.push(nowMedia);
      }
    } catch (e) {
      yield put(actions.changeNotify(true, 'warning', e.message));
      return;
    }

    // アップロード
    for (const nowMedia of action.payload) {
      const state: RootState = yield select();
      const orgMedia = state.reducer.post.media;

      (nowMedia as PreviewFile).preview = URL.createObjectURL(nowMedia);
      console.debug(nowMedia);

      // なんかアップロードする時に一部の文字列が入ってるとエラーになるので、時刻で上書きする
      const fileName = nowMedia.name;
      const fileExtention = fileName.substring(fileName.lastIndexOf('.') + 1);
      const blob = nowMedia.slice(0, nowMedia.size, nowMedia.type);
      const renamedFile = new File([blob], `${new Date().getTime()}${fileExtention}`, { type: nowMedia.type });

      yield put(actions.updateStatus('uploading'));
      yield put(actions.changeNotify(true, 'info', `ファイルアップロード中: ${fileName}`, false));
      const uploadResult: GeneratorType<typeof twitterApi.postMediaUpload> = yield call(twitterApi.postMediaUpload, state.reducer.config.api.twitterBase, renamedFile);
      if (uploadResult.code !== 0) throw uploadResult.error;

      yield put(
        actions.storeMedia([
          ...orgMedia,
          {
            file: { ...(nowMedia as PreviewFile), type: nowMedia.type } as PreviewFile,
            media_id_string: uploadResult.data.media_id_string,
          },
        ]),
      );
    }

    yield put(actions.changeNotify(true, 'info', 'ファイルアップロード完了'));
    yield put(actions.updateStatus('ok'));
  } catch (error) {
    yield call(errorHandler, { message: 'ファイルアップロードに失敗' });
    console.error(error);
  }
}

function* addReplyTweet() {
  yield put(actions.changeNotify(true, 'info', '返信先ツイートをセットしました'));
}

function* addRetweet() {
  yield put(actions.changeNotify(true, 'info', '引用RTをセットしました'));
}
