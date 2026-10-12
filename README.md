# Lab Risk Scenario Explorer

左にシナリオ、中央に５主体の関係図、右に想定結果と成立条件を表示する議論用デモです。主体と二者間の接点を選べます。全シナリオは未実証の仮説で、実設備の脆弱性や生物学的影響を判定しません。

公開用ページはpublic/にあります。外部のJavaScript・CSS・アイコン配信サービスに依存しません。ブラウザから実験機器やAPIへ接続しません。個別の研究室の実プロトコル・秘密鍵・実配列・実験結果は含みません。

## ローカル確認

Node.js 22以上があれば、パッケージのインストールは不要です。ZIPを展開し、package.jsonとvercel.jsonがあるフォルダでPowerShellを開きます。

```powershell
npm run dev
```

http://127.0.0.1:4173 を開きます。停止はCtrl+Cです。別ポートを使う場合は `$env:LAB_RISK_PORT = "4174"` を設定してから起動します。

## Vercelに初回公開する

以下は2026-10-12に確認したCLI 63.1.2を使う手順です。GitHubへの登録は必要ありません。

```powershell
npx vercel@63.1.2 login
npx vercel@63.1.2 --prod
```

初回のCLI取得時は実行確認が表示されることがあります。loginの画面に従って自分のVercelアカウントで認証します。パスワードやトークンをチャットに貼る必要はありません。

デプロイの質問には、次のように回答してください。

| 質問 | 回答 |
|---|---|
| Set up and deploy? | Y |
| Which scope? | 公開先にしたい自分のアカウントまたはチーム |
| Link to existing project? | 新規ならN。以前作ったこのデモのプロジェクトがある場合はYで選択 |
| Project name | lab-risk-explorer（必要なら別名） |
| Directory containing code | ./ |
| Framework | Other / None |
| Build command | なし |
| Output directory | public |

vercel.jsonに静的サイトの設定を含めています。質問の名称・順序はCLIによって変わる場合があります。既存プロジェクトにリンクする場合は、別のサイトを上書きしないよう対象を確認してください。

処理が成功するとProduction URLが表示されます。そのURLを別ブラウザやログアウト状態で開き、相手が閲覧できることを確認します。認証画面が出る場合はVercelのDeployment Protection設定を確認してください。

## 更新

同じフォルダで public/app.js（シナリオ・操作）、public/style.css（表示）、public/index.html（ページ）を編集します。ローカル確認後に `npx vercel@63.1.2 --prod` を実行します。

## 参考

- https://vercel.com/docs/cli/login
- https://vercel.com/docs/cli/deploy
- https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2026.1832401/full
- https://biosecurityhandbook.com/

文献はリスク整理の参考です。このデモは、文献に掲載されたラボへの攻撃を再現したものではありません。
