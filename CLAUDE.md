# japanbridge

ARKLinks（ark-links.com）のランディングページ（静的HTML、`index.html`）。2026-07 のEC先行再編に伴い、茶の海外EC（シングルオリジン煎茶・抹茶、受注生産・DDP）向けの構成。旧・紹介制プライベートツアー版は `legacy/tour-index_2026-07.html` に保全（冬のL2再起動時に再利用）。

- 農園カードの着地点は `/farms/moriuchi/`（2026-08-01に `/farm` から移設。カードは未印刷だったため変更可能だった）。`vercel.json` で `/farm`・`/farm/` → `/farms/moriuchi/` を301で永久に維持する。QRに刷る文字列は `https://ark-links.com/farms/moriuchi/?c=m1`（`c` はカードの版数。ページ側のJSで `utm_source=farm_card` 等にマップし、明示的なUTMがあればそちらを優先）
- **`/farms/moriuchi/` は覚書が交わされるまで noindex で保留中。** 覚書（8月末の森内面談）後に公開するには3箇所: ①同ファイルの `robots` を `index, follow` に ②`sitemap.xml` にURLを追加 ③`index.html` の `#farm` セクションのCTAを「Meet the growers →」リンクに差し替え（該当箇所にHTMLコメントあり）
- `#farm` アンカーはトップページ内の農園セクション。旧QRの着地点だったため、アンカー名は変更しない
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
