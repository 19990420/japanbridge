# japanbridge

ARKLinks（ark-links.com）のランディングページ（静的HTML、`index.html`）。2026-07 のEC先行再編に伴い、茶の海外EC（シングルオリジン煎茶・抹茶、受注生産・DDP）向けの構成。旧・紹介制プライベートツアー版は `legacy/tour-index_2026-07.html` に保全（冬のL2再起動時に再利用）。

- 農園カードの着地点は `/farms/moriuchi/`（2026-08-01に `/farm` から移設。カードは未印刷だったため変更可能だった）。`vercel.json` で `/farm`・`/farm/` → `/farms/moriuchi/` を301で永久に維持する。QRに刷る文字列は `https://ark-links.com/farms/moriuchi/?c=m1`（`c` はカードの版数。ページ側のJSで `utm_source=farm_card` 等にマップし、明示的なUTMがあればそちらを優先）
- **`/farms/moriuchi/` は覚書が交わされるまで noindex で保留中。** 覚書（8月末の森内面談）後に公開するには3箇所: ①同ファイルの `robots` を `index, follow` に ②`sitemap.xml` にURLを追加 ③`index.html` の `#farm` セクションのCTAを「Meet the growers →」リンクに差し替え（該当箇所にHTMLコメントあり）
- `#farm` アンカーはトップページ内の農園セクション。旧QRの着地点だったため、アンカー名は変更しない
- Foundingフォームは暫定でFormspree送信。9月のIG発信開始前にESP（Klaviyo/Shopify Email）直結へ差し替える
- **`#fields`（The Fields）は2026-08-24追加。** 8/23の森内訪問で代表が撮影した4枚（`fields_valley`＝谷の全景／`fields_returning`＝刈るのをやめた境目／`fields_kept_apart`＝覆いのある畑と日向の畑／`fields_two_pickings`＝隣り合う畝の緑の差）。⚠️ **本文は「安全版」**——斜面の地形と山間茶業の一般的な衰退（いずれも公知）だけを書き、**近隣の特定の農家について一切言及していない**。「隣人が辞めると土地が売れないので、まだ働いている人に回る」という直接的な版は `admin/ARKLinks_経営目標.md` §v5.0(2) に保管してあり、**同じ谷の他の家の話であるため、森内さんの明示的な同意を得るまで公開してはならない**（該当箇所にHTMLコメントあり）
- ⚠️ **2026-08-25：サイト上の茶畑写真をすべて森内茶農園（2026-08-23撮影）に統一した。** それ以前の写真は和束（京都）や静岡の**別の農園**であり、「静岡の一軒の農園から」という本文と矛盾していたためリポジトリから削除済み（`tea_rows_sky` `tea-fields` `茶畑` `お茶` `tea.jpg` ほかストック画像）。**今後、森内茶農園以外で撮影した茶畑写真をこのサイトに置かないこと。**
  - Hero=`hero_tea_hills`（斜面いっぱいの茶畑。日本語H1「あなたの一杯が育った斜面まで」と画が一致する）／OG=`og_image.jpg`（谷の全景）／`farm_shizuoka`（覆いの棚＝かぶせ栽培）／`sencha_fields`（茶葉の接写）／`fields_*` 4枚は `#fields` 用
  - ⚠️ `legacy/tour-index_2026-07.html` が参照する `tea_fields.webp` `tea.webp` `rice.webp` `winery.webp` `sake_brewery.webp` は**他所の写真だが、アーカイブを壊さないため残置**。L2は畳む決定済みなので、legacy を破棄する際に併せて削除してよい
  - マスターは同名`.jpg`。農園名と人物写真は覚書後に掲載

## 起動方法
`index.html` をブラウザで直接開くか、簡易サーバーで確認する（例: `python3 -m http.server`）。

## 画像命名規則
新規に追加する画像は英語のスネークケース（例: `sake_brewery.jpg`）で統一する。日本語ファイル名（`お米.jpg` 等）と英語ファイル名の重複が既存であるため、新規追加時は増やさない。

## 画像最適化ルール
サイトで表示する画像は WebP に変換して使う（ヒーロー: 幅2000px/品質72、本文: 幅1400px/品質75目安、Pillowで変換）。元のjpg/pngはマスターとしてリポジトリに残すが、HTMLからは参照しない。OG画像（`og_image.jpg`）のみ互換性のためJPEGを維持する。ファーストビュー外の`<img>`には `loading="lazy" decoding="async"` を付ける。

## デプロイ先
Vercel（GitHub連携）。`origin`（github.com/19990420/japanbridge）への push で自動デプロイされる。**push は代表の明示的な承認を得てから行うこと（本番サイトが即時更新されるため）。**
