# fetch, axios, useSWR の比較

- fetch は，`/app/fetch_hello/page.tsx`
- axios は，`/app/fetch_hello/page.tsx`
- useSWR は，`/app/fetch_hello/page.tsx`
- API は，`/app/api/hello/route.ts`

## fetch
- 標準機能: ライブラリの追加インストールが不要
- Promiseベース: fetch()はPromiseを返します。
- レスポンス: レスポンスオブジェクト（Response）を返し，.json()や.text()メソッドでデータを抽出する必要がある
- エラー処理: ネットワークエラー（通信失敗）のみをPromiseのreject（catch）で扱う．404や500などのHTTPステータスエラーは「成功」として扱われるため，response.okプロパティで別途チェックが必要．

## axios
- fetchをより使いやすく高機能にした，サードパーティ製のHTTPクライアントライブラリ
- 自動変換: デフォルトでJSONデータを自動的にJSON.stringify（リクエスト時）およびJSON.parse（レスポンス時）する
- エラー処理: 4xxや5xxのHTTPステータスエラーを自動的にcatchで捕捉できる
- インターセプター: リクエストやレスポンスをグローバルに傍受し，ヘッダーの共通設定（認証トークンなど）やエラーハンドリングを一元化できる
- その他: タイムアウト設定，リクエストのキャンセル，XSRF保護などの高度な機能を持つ

## useSWR
- データフェッチ「ライブラリ」ではない: useSWRはHTTPリクエストを直接行うものではなく，内部でfetch（またはaxiosなど）を使つ
- 状態管理: 主な目的は，フェッチしたデータのキャッシュ，再検証（Revalidation），状態管理
- SWR (Stale-While-Revalidate): まずキャッシュ（古いデータ）を返し，裏側で最新データをフェッチし，完了したらUIを更新する．これによりUIの応答性が向上する．
- 自動再検証: フォーカス時，ネットワーク再接続時，一定間隔（Interval）で自動的にデータを再検証する．
- React特化: Reactコンポーネント内で使用することを前提としている．

## 使い分けまとめ
### fetch
- ライブラリを追加したくない場合
- ごく単純なGETリクエストやPOSTリクエストのみの場合
- （Next.jsのサーバーコンポーネント内 → 後述）

### axios
- 認証トークンの付与など，リクエスト/レスポンスに共通処理（インターセプター）を挟みたい場合
- タイムアウトやキャンセル処理など，高度なリクエスト制御が必要な場合
- fetchのres.okチェックが面倒な場合。

### useSWR
- Reactコンポーネント内でデータをフェッチし，その状態（ローディング、エラー、データ）を管理したい場合
- データのキャッシュや，画面フォーカス時などの自動更新（再検証）を行いたい場合


### サーバーコンポーネント (RSC) での推奨: fetch
App Routerのサーバーコンポーネント（デフォルトのコンポーネント）では，Next.jsが拡張したfetch APIを使うことが強く推奨される．

自動デデュプリケーション (Deduplication): 同じレンダリングツリー内で同じURLへのfetchリクエストが複数あっても，自動的に1回のリクエストにまとめてくれる．

キャッシュ制御: Next.js独自のnext: { revalidate: ... }オプションやcache: 'no-store'などを使って、コンポーネントレベルで柔軟なキャッシュ戦略（ISR, SSR）を制御できる．
```javascript
// app/page.tsx (サーバーコンポーネント)
async function getData() {
  // Next.jsがこのfetchを拡張し、キャッシュ制御を行う
  const res = await fetch('https://api.example.com/...', { 
    next: { revalidate: 10 } // 10秒間キャッシュ
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  // ...
}
```
注意: サーバーコンポーネントでaxiosを使うこともできるが，上記のようなNext.jsの自動キャッシュやデデュプリケーションの恩恵は受けられない

### クライアントコンポーネントでの推奨: useSWR
'use client'ディレクティブを使ったクライアントコンポーネントで，インタラクティブなデータフェッチ（例: ユーザーの操作によるデータ取得，定期的なデータ更新）が必要な場合は，useSWRが最適．

useSWRはVercel製であり，Next.jsと非常に相性が良い．

クライアントサイドでの複雑な状態管理（ローディング，エラー，キャッシュ）をシンプルに記述できる．

### axios の出番は？
Next.js (App Router) 環境では，axiosが必須となる場面は減った．

ただし，もしRoute Handlers (API Routes) 内から外部APIを叩く際や，クライアントコンポーネントでuseSWRを使わない単純なPOST（例: フォーム送信）を行う際に，インターセプターなどの機能を使いたい場合には選択肢となる．
