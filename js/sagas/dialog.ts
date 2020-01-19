import { put, take, race } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { DialogState } from '../reducers';

/**
 * 確認ダイアログの処理
 * @param message 確認ダイアログのメッセージ
 * @param type 表示種別
 */
export function* confirmSaga(message: string, type: DialogState['type'], detail?: string) {
  // 確認用モーダルを表示する
  yield put(
    actions.changeDialog({
      detail,
      message,
      type,
      show: true,
      confirm: true,
    }),
  );

  // raceでどちらが選ばれたか取得する
  const { yes } = yield race({
    yes: take(getType(actions.dialogYes)),
    no: take(getType(actions.dialogNo)),
  });
  // モーダルを隠す
  yield put(actions.changeDialog({ show: false }));
  // boolean型に変換して返却する
  return !!yes;
}
