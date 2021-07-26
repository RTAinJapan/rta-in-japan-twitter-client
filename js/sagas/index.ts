import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { alertSaga, confirmSaga } from './dialog';
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

  yield takeEvery(actions.addReplyTweet, addReplyTweet);
  yield takeEvery(actions.addAttachUrl, addRetweet);

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
    if (result.status !== 'ok') {
      throw new Error('走者情報の取得に失敗');
    }
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

    const result: boolean = yield call(confirmSaga, 'ツイートを送信します。よろしいですか？', 'info', `${action.payload}`);
    if (!result) return;

    yield put(actions.updateStatus('posting'));
    yield put(actions.updateTweetText(action.payload));

    const mediaIds: string[] = state.reducer.post.media.map((media) => media.media_id_string);

    const in_reply_to_status_id = state.reducer.post.in_reply_to_status_id ? state.reducer.post.in_reply_to_status_id.id_str : null;
    let attachment_url = '';
    if (state.reducer.post.attachment_url) {
      const id = state.reducer.post.attachment_url.id_str;
      const screenName = state.reducer.post.attachment_url.user.screen_name;
      attachment_url = `https://twitter.com/${screenName}/status/${id}`;
    }

    const postResult: GeneratorType<typeof twitterApi.postStatusesUpdate> = yield call(
      twitterApi.postStatusesUpdate,
      state.reducer.config.api.twitterBase,
      action.payload,
      mediaIds,
      in_reply_to_status_id,
      attachment_url,
    );
    if (postResult.error) throw postResult.error;

    yield put(actions.updateTweetList(postResult.data, 'user'));

    // 各種初期化
    yield put(actions.storeMedia([]));
    yield put(actions.updateTweetText(''));
    yield put(actions.deleteAttachUrl());
    yield put(actions.deleteReplyTweet());
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
    const deleteTargetTweet = state.reducer.twitterTimeline.user.filter((tweet) => tweet.id_str === action.payload);

    if (state.reducer.config.twitter.isAllowDeleteTweet) {
      const isContinue: boolean = yield call(confirmSaga, 'ツイートを削除します。よろしいですか？', 'info', `${deleteTargetTweet[0].full_text}`);
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
    } else {
      const tweetText = deleteTargetTweet[0].full_text;
      const url = `https://twitter.com/${deleteTargetTweet[0].user.screen_name}/status/${deleteTargetTweet[0].id_str}`;
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
      const filename = nowMedia.name;
      yield put(actions.updateStatus('uploading'));
      yield put(actions.changeNotify(true, 'info', `ファイルアップロード中: ${filename}`, false));
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
    }

    yield put(actions.changeNotify(true, 'info', 'ファイルアップロード完了'));
    yield put(actions.updateStatus('ok'));
  } catch (error) {
    yield call(errorHandler, error);
  }
}

function* addReplyTweet() {
  yield put(actions.changeNotify(true, 'info', '返信先ツイートをセットしました'));
}

function* addRetweet() {
  yield put(actions.changeNotify(true, 'info', '引用RTをセットしました'));
}
