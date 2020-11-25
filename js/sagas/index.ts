import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { confirmSaga } from './dialog';
import { RootState } from '../reducers';
import { PreviewFile, Config, GeneratorType } from '../types/global';
import { loginCheck, logoutDiscord, oauthDiscord } from './discord';
import { fetchJson } from './common';
import { twitterApi } from './twitterUtil';
import { Game } from '../types/api';

export default function* rootSaga() {
  yield call(fetchConfig);
  yield takeEvery(actions.loginDiscord, oauthDiscord);
  yield takeEvery(actions.reloadTweetList, fetchTweetListAndApplyState);
  yield takeEvery(actions.submitTweet, submitTweet);
  yield takeEvery(actions.deleteTweet, deleteTweet);
  yield takeEvery(actions.uploadMedia, uploadMedia);
  yield takeEvery(actions.deleteMedia, deleteMedia);

  yield takeEvery(actions.logoutDiscord, logoutDiscord);
  yield call(loginCheck);
  // yield put(actions.storeDiscordUserName('テストユーザ'));
  yield call(fetchTweetListAndApplyState);
  yield call(fetchGameListAndApplyState);
}

function* errorHandler(error: any) {
  try {
    const message = (error.message as string) || '予期せぬエラーが発生しました。';
    yield put(actions.changeNotify(true, 'error', message));
    yield put(actions.updateStatus('error'));
  } catch (e) {
    console.error('★激辛だ★');
  }
}

function* fetchConfig() {
  try {
    const config: Config = yield call(fetchJson, './config.json');
    yield put(actions.storeConfig(config));
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

    let tweet: GeneratorType<typeof twitterApi.getStatusesUserTimeLine> = yield call(twitterApi.getStatusesUserTimeLine, state.reducer.config.api.twitterBase);
    if (tweet.error) throw tweet.error;
    yield put(actions.updateTweetList(tweet.data, 'user'));
    tweet = yield call(twitterApi.getStatusesMentionsTimeLine, state.reducer.config.api.twitterBase);
    if (tweet.error) throw tweet.error;
    yield put(actions.updateTweetList(tweet.data, 'mention'));
    tweet = yield call(twitterApi.getStatusesHash, state.reducer.config.api.twitterBase);
    if (tweet.error) throw tweet.error;
    yield put(actions.updateTweetList(tweet.data, 'hash'));

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

    const result: { status: string; data: Game[] } = yield call(fetchJson, state.reducer.config.api.runner);
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

    const result = yield call(confirmSaga, 'ツイートを送信します。よろしいですか？', 'info', `${action.payload}`);
    if (!result) return;

    yield put(actions.updateStatus('posting'));
    yield put(actions.updateTweetText(action.payload));

    const mediaIds: string[] = state.reducer.post.media.map(media => media.media_id_string);

    const postResult: GeneratorType<typeof twitterApi.postStatusesUpdate> = yield call(
      twitterApi.postStatusesUpdate,
      state.reducer.config.api.twitterBase,
      action.payload,
      mediaIds,
    );
    if (postResult.error) throw postResult.error;

    yield put(actions.updateTweetList(postResult.data, 'user'));

    // 各種初期化
    yield put(actions.storeMedia([]));
    yield put(actions.updateTweetText(''));
    // 完了通知
    yield put(actions.changeNotify(true, 'info', 'ツイートしました。'));
    yield put(actions.updateStatus('ok'));
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
    const deleteTargetTweet = state.reducer.twitterTimeline.user.filter(tweet => tweet.id_str === action.payload);

    const isContinue = yield call(confirmSaga, 'ツイートを削除します。よろしいですか？', 'info', `${deleteTargetTweet[0].text}`);
    if (!isContinue) return;
    yield put(actions.changeNotify(true, 'info', '削除要求中'));

    yield put(actions.updateStatus('posting'));
    // 削除実行
    const result: GeneratorType<typeof twitterApi.postStatusesDestroy> = yield call(twitterApi.postStatusesDestroy, state.reducer.config.api.twitterBase, action.payload);
    if (result.error) throw result.error;

    // 新しいリストを取得
    const newTweetList: GeneratorType<typeof twitterApi.getStatusesUserTimeLine> = yield call(twitterApi.getStatusesUserTimeLine, state.reducer.config.api.twitterBase);
    if (newTweetList.error) throw newTweetList.error;
    yield put(actions.updateTweetList(newTweetList.data, 'user'));

    yield put(actions.changeNotify(true, 'info', '削除完了'));
    yield put(actions.updateStatus('ok'));
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
    const nowMedia = action.payload[0];

    // 何かやってる最中は処理終了
    if (['posting', 'uploading'].includes(state.reducer.status)) return;

    // チェック
    try {
      // 規定の種別以外のファイル
      if (action.payload.length === 0) throw new Error('不正な拡張子のファイルです。');

      // 同名のファイルは不可
      for (const media of orgMedia) {
        if (media.file.name === nowMedia.name) throw new Error('同名のファイルは選択できません。');
      }

      // リストに登録できるのは、動画1 or 画像1～4
      // 動画があるのに何か指定された
      const isOrgMediaIncludeVideo = orgMedia.filter(media => media.file.type.includes('video')).length > 0;
      if (isOrgMediaIncludeVideo) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

      // 何か登録されてるのに動画が指定された
      const isNowMediaIncludeVideo = nowMedia.type.includes('video');
      if (orgMedia.length > 0 && isNowMediaIncludeVideo) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

      // なんやかんやで合計が4つ以上になりそう
      if (orgMedia.length === 4) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');
    } catch (e) {
      yield put(actions.changeNotify(true, 'warning', e.message));
      return;
    }

    (nowMedia as PreviewFile).preview = URL.createObjectURL(nowMedia);

    console.debug(nowMedia);
    yield put(actions.updateStatus('uploading'));
    yield put(actions.changeNotify(true, 'info', 'ファイルアップロード中', false));
    const uploadResult: GeneratorType<typeof twitterApi.postMediaUpload> = yield call(twitterApi.postMediaUpload, state.reducer.config.api.twitterBase, nowMedia);
    if (uploadResult.error) throw uploadResult.error;

    yield put(
      actions.storeMedia([
        ...orgMedia,
        {
          file: nowMedia as PreviewFile,
          media_id_string: uploadResult.data.media_id_string,
        },
      ]),
    );
    yield put(actions.changeNotify(true, 'info', 'ファイルアップロード完了'));
    yield put(actions.updateStatus('ok'));
  } catch (error) {
    yield call(errorHandler, error);
  }
}
