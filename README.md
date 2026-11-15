# 鹿児島県パワーリフティング協会ウェブサイト

GitHub Pagesで無料公開できる静的サイトです。ビルド作業は不要です。

## 更新する場所

- 文章やリンク: `index.html`
- 色・文字サイズ・配置: `assets/style.css`
- メイン写真: `assets/hero-lifter.png`
- 桜島の画像: `assets/sakurajima-hero.png`

## GitHub Pagesの公開設定

1. リポジトリの `Settings` を開く
2. 左側の `Pages` を開く
3. `Build and deployment` の `Source` は `Deploy from a branch`
4. `Branch` は `main`、フォルダーは `/(root)` を選び `Save`

公開URLは通常 `https://haji84.github.io/kagoshima-powerlifting/` です。


## 複数人更新管理（開発中）

重要情報はレビューPR、お知らせとクラブ紹介は直接保存するC方式を設計中です。
導入と権限設定、未完成条件は [docs/CMS_OPERATION.md](docs/CMS_OPERATION.md) を参照してください。
CMSの試験用画面は `/admin/` です。正式な複数人運用には認証・権限設定と本番検証が必要です。
