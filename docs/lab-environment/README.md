# 想定ラボの装置・能力・人の介在

調査日：2026-10-13。既存のデモとは別の説明資料です。

- **[REPORT.md](REPORT.md)**：GitHubで読む本文。実在例と今回の仮定を区別。
- **[report.html](report.html)**：ブラウザで読む写真付き版。開いて印刷すればPDFにもできます。
- **[sources.json](sources.json)**：出典、確認日、根拠の範囲を管理。
- **[PHOTOS.md](PHOTOS.md)**：写真・装置画像の出典と種類。
- **[build.py](build.py)**：本文からHTMLを再生成するスクリプト。

本文を修正したら、このフォルダで次を実行します。

```powershell
python -m pip install -r requirements.txt
python build.py
```

report.htmlは実行コードを持たない閲覧用資料です。写真は公式公開URLを参照するため、表示にはインターネット接続が必要です。出典ページへのリンクも本文に残しています。画像のバイナリはGitに含めていません。

資料はdocs/配下に追加し、ルートREADMEに案内リンクを置いています。デモのpublic/やVercel設定は変更しません。
