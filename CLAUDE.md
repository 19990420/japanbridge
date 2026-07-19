# japanbridge

ARKLinks（ark-links.com）のランディングページ（静的HTML、`index.html`）。2026-07 のEC先行再編に伴い、茶の海外EC（シングルオリジン煎茶・抹茶、受注生産・DDP）向けの構成。旧・紹介制プライベートツアー版は `legacy/tour-index_2026-07.html` に保全（冬のL2再起動時に再利用）。

- `#farm` アンカーは店頭QRカードの着地点。`vercel.json` で `/farm` → `/#farm` にリダイレクト（QR印刷後は差し替え不能のため恒久維持）
- Foundingフォームは暫定でFormspree送信。9月のIG発信開始前にESP（Klaviyo/Shopify Email）直結へ差し替える
- 茶畑画像は代表撮影の実写に差し替え済み（2026-07-19）: Hero/OG=`hero_tea_hills`（7/18和束撮影）、`farm_shizuoka`（7/12森内訪問）、`sencha_fields`・`tea_rows_sky`（7/12静岡）。マスターは同名`.jpg`。旧ストック画像（`tea_fields`・`tea`等）はHTML未参照だがマスターとして残置。農園名と人物写真は8月末の森内面談（覚書）後に掲載

## 起動方法
`index.html` をブラウザで直接開くか、簡易サーバーで確認する（例: `python3 -m http.server`）。

## 画像命名規則
新規に追加する画像は英語のスネークケース（例: `sake_brewery.jpg`）で統一する。日本語ファイル名（`お米.jpg` 等）と英語ファイル名の重複が既存であるため、新規追加時は増やさない。

## 画像最適化ルール
サイトで表示する画像は WebP に変換して使う（ヒーロー: 幅2000px/品質72、本文: 幅1400px/品質75目安、Pillowで変換）。元のjpg/pngはマスターとしてリポジトリに残すが、HTMLからは参照しない。OG画像（`og_image.jpg`）のみ互換性のためJPEGを維持する。ファーストビュー外の`<img>`には `loading="lazy" decoding="async"` を付ける。

## デプロイ先
Vercel（GitHub連携）。`origin`（github.com/19990420/japanbridge）への push で自動デプロイされる。**push は代表の明示的な承認を得てから行うこと（本番サイトが即時更新されるため）。**
