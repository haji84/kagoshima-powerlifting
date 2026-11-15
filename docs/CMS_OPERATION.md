# 鹿児島県パワーリフティング協会：複数人管理（C方式）

更新日：2026-11-16。正本：このGitHubリポジトリ。
現在の公開環境：GitHub Pages / main。サイトの公開設定自体はこのPRで変更しない。

## 結論
既存HTMLを生かしつつ、Sveltia CMSを管理UIとして追加。サイトはGitHub Pagesで継続公開する。
- 即公開（CMSの simple）：お知らせ、クラブ・練習施設紹介
- 承認後公開（CMSの editorial_workflow）：大会日程、大会結果、県記録
- 例外：大会中止・締切変更など、重要で緊急の連絡は「お知らせ」に再掲する場合も大会情報と同じ確認を必須とする。未確認情報を公開しない。

## 保存データ
- `content/news.json`: items[{date,category,title,body,url}]
- `content/clubs.json`: items[{name,area,description,url}]
- `content/events.json`: items[{date,title,venue,description,url}]
- `content/results.json`: items[{date,title,url}]
- `content/records.json`: items[{category,equipment,ageGroup,weightClass,lift,athlete,weightKg,date,sourceUrl}]
空配列の部門は従来の「準備中」を保持。既存の告知2件と2024年大会結果リンクは元サイトの内容を移植しただけで、新たな認定・事実確認ではない。

## 管理画面の操作（このPRがmainへ統合された後）
1. `https://haji84.github.io/kagoshima-powerlifting/admin/` を開く。
2. Phase 1 は本人のGitHub個人トークンで試験する（GitHubでリポジトリContents書込み権限、承認系はPull requests書込み権限も必要）。トークンを共有しない。
3. 「お知らせ」「クラブ・練習施設」は保存するとmainへコミットされ、GitHub Pages再公開後に反映される。**秒単位の即時反映を保証する意味ではない。**
4. 「大会日程」「大会結果」「県記録」は保存するとレビュー用PRを作る。管理者が元資料と変更差分を確認し、GitHubのPRを統合するまで公開サイトに反映しない。
5. 誤掲載はGitHubのコミット履歴を確認し、修正PRまたは適切なrevertで戻す。

## 権限・認証（未完）
- Phase 1 の試験用CMSはGitHubトークン方式。一般の協会員に正式展開する前に、各人のGitHub IDまたは招待IDを確定し、GitHub OAuthの認証サーバ（例：Sveltia CMS Authenticator + Cloudflare Workers）を設置する。トークンやOAuthシークレットをGitHub PagesのHTML、JS、公開リポジトリに書かない。
- 現行GitHubはユーザー個人所有の公開repo。確認時にrulesetは0件。GitHub Pages単体には安全なサーバ側RBACはない。
- CMSの `publish_mode` と `publish:false` は**画面上の運用フロー**。GitHubへ直接書込・PR統合できる権限者には回避経路が残る。従って「編集者には即公開のみ、県記録は管理者以外絶対公開不可」という強制的権限制御は **まだできていない**。
- 真のRBAC強制が必要なら、協会員にrepo書込みを付与せず、サーバ側認証+役割チェック+最小権限GitHub Appで書き込む設計を追加する。あるいは重要情報の承認を優先してmain全体をPR必須保護する場合、速報も即時コミットできなくなるため別系統の更新処理が必要。
- `CODEOWNERS` はレビュー依頼の補助。rulesetなしで本人承認を強制するものではない。プロトタイプを正式運用と呼ばない。

## 完成までの順序と受入証拠
1. このPRで構造化データ、CMS画面設定、表示スクリプト、CIを追加。既存サイト・見た目を維持。 `node scripts/validate-content.mjs` 通過と、Chrome/Safariスマホで表示検査。
2. OAuth認証とメンバー招待、退会後のアクセス遮断を試験。パスワード共有禁止。
3. 管理者・編集者2アカウントで実際の一連を検証：速報は保存→サイト反映、県記録は申請→公開されない→管理者レビュー→統合→反映。編集者によるGitHub直編集・直マージで承認を回避できないことを検証。
4. 不正URL/危険なHTML、誤記録、同時編集衝突、公開取消し、個人情報の漏出、スマホの更新操作を検査。
5. サイト上で実表示と原本URLを照合し、運営者が承認してから本番利用開始。

## 留意事項
- 公式情報は認定済み原本で検証。大会日程と結果の出典・確認日時を更新担当が残す。
- 公開repoに未公表の個人情報・会員名簿・生年月日・連絡先などを置かない（レビューPRも公開される）。
- 静的ページはGitHub PagesのCDNが配信。変更反映には時間差がある。
- GitHub Pagesはサーバ処理を持たず、管理画面を隠しても認証にはならない。
