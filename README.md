# RTA in Japan Twitter Client

## 概要
ツイート投稿、ツイートの削除、メンションの確認に機能を絞ったWebサーバー上で動作するTwitterクライアントです。
[RTA in Japan](https://rtain.jp "RTA in Japan")というイベントで、ボランティアスタッフが運営スタッフの代わりにTwitter投稿を行う目的で開発されました。

## 使い方
1. APIを別途用意する
1. Configを適切に設定する
1. Webサーバに本クライアントを配置する

## Config
* `api` _Object_ RTA in Japan用APIに関する設定
    * `twitterBase` _String_ TwitterAPIのURL
    * `runner` _String_ 走者情報APIのURL
* `discord` _Object_
    * `config` _Object_ DiscordAPI認証設定
      * `clientId` _String_  DiscordAPIのクライアントID
      * `clientSecret` _String_ (使わない)
      * `redirectUrl` _String_ リダイレクトURL。リリース先のURLに合わせて修正。
      * `scope` _String_ Scope
    * `guild` _String_ サーバID
    * `roles` _String[]_ 権限ID
    * `users` _String[]_ この画面を操作できるユーザID
* `tweetTemplate` _Object_ テンプレート
  * `text` _String[]_ 
  * `footer` _String_ 
* `link` _Object[]_ クライアントから見れるリンクの一覧。
  * `name` _String_ リンクの表示名
  * `url` _String_ リンクのURL
  * `iconUrl` _String_ アイコン画像のURL

## RTA in Japan用API
### TwitterAPI
* 別のリポジトリで管理

### 走者情報API
* JSONP型で、データ部分は以下。

#### API
* `status` _String_ okかerror
* `data` _Object[]_
    * `id` _Number_ ゲームID
    * `gamename` _String_ ゲーム名
    * `category` _String_ RTAのカテゴリ
    * `runner` _Object[]_ 走者情報
        * `username` _String_ 名前
        * `twitterid` _String_ TwitterのScreen Name。@は無し。
    * `commentary` _Object[]_ 解説情報。走者情報と型は同じ。

## Todo
* 不要コードの削除
* TwitterTLに時刻を表示
* PWA化