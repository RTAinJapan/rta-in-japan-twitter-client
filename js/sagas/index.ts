import { select, call, put } from 'redux-saga/effects';
import * as actions from '../actions';
import { RootState } from '../reducers';
import { Config, RunnersAPI } from '../types/global';
import { fetchJson } from './common';

export default function* rootSaga() {
  // 設定読み込み
  yield call(fetchConfig);
  // ゲーム情報
  yield call(fetchGameListAndApplyState);
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
 * ゲーム、走者データ取得
 */
function* fetchGameListAndApplyState() {
  try {
    // ログイン状態でなければ終了
    const state: RootState = yield select();
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
