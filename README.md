# TaaraByHK

A hand-built storefront for TaaraByHK — no page builder, no monthly platform fee. Products live in a spreadsheet, photos live in a folder, and the whole thing deploys as a static site with a small Supabase backend for orders.

---

## What's in here

```
index.html            Homepage
shop.html              Full catalog with category filters
product.html            Single product page (?id=...)
cart.html               Shopping bag
checkout.html            Delivery form + dynamic UPI QR payment
order-confirmed.html      Post-checkout confirmation
account.html            "Track your order" lookup
admin.html              Order dashboard (login required)
404.html
css/style.css            All styling — one file, the whole design system
js/                    All behaviour (see below)
data/products.csv          THE CATALOG — edit this to change what's for sale
images/products/           Product photos, referenced by filename from the CSV
images/brand/             Logo + favicon
supabase-schema.sql        Run once in Supabase to set up the orders table
```

## How to add or edit a product (no coding required)

1. Open `data/products.csv` in Excel or Google Sheets.
2. Add a new row (or edit an existing one). Columns:
   - `id` — any unique number
   - `name` — product title
   - `category` — must match one of: `Bracelets`, `Necklaces`, `Charms`, `Keychains` (or add a new category — it'll show up automatically in the filter bar and homepage "case strip" icons will just show a default icon for unrecognised categories)
   - `price` — number, no ₹ symbol (currently every product is priced at a placeholder ₹150 — change this column whenever real pricing is ready)
   - `image` / `image2` — the filename of the photo in `images/products/` (e.g. `my-new-bracelet.jpg`). `image2` is used as the second gallery thumbnail — reuse the same filename if you only have one photo.
   - `description` — a couple of sentences
   - `badge` — optional label like `New` or `Bestseller`, or leave blank
   - `featured` — `yes` to show it in the homepage "This week's edit", else `no`
   - `in_stock` — `yes` or `no`
3. Upload the actual photo file to `images/products/` in the GitHub repo (same filename as the `image` column).
4. Commit both changes. That's it — no rebuild step, the site reads the CSV live.

## Setting up the backend (Supabase)

Orders (name, address, payment status) are stored in Supabase, not the CSV — the CSV is only for the product catalog.

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in your Supabase project and run everything in `supabase-schema.sql`. This creates the `orders` table with proper privacy rules (customers can only look up their own order by its reference code — they can't browse other people's orders).
3. Go to **Project Settings → API** and copy the **Project URL** and **anon public** key.
4. Paste them into `js/supabase-config.js` (replacing the two `TODO` placeholders).
5. Go to **Authentication → Users** in Supabase and manually add yourself (and anyone else who should manage orders) with an email + password. There's no public sign-up — this is the login for `admin.html`.

Until you do this, the site still works end-to-end (browsing, cart, checkout) — orders are just saved to the visitor's own browser instead of your database, so you can test everything before wiring up Supabase.

## Setting up payments

Open `js/qr.js` and replace:
```js
const UPI_ID = "taarabyhk@okaxis"; // put your real UPI ID here
const MERCHANT_NAME = "TaaraByHK";
```
The QR code on the checkout page is generated live for the exact order total — there's no fixed QR image to regenerate.

Payments are **manually verified** — when a customer says they've paid, an order appears in `admin.html` as "Pending." You check your UPI app for a matching payment (order reference is shown on both the checkout page and in the admin table) and click **Verify**.

## Other things to personalize before launch

In `js/main.js`, update the `SITE` object at the top:
```js
whatsapp: "919999999999",   // real WhatsApp number, country code + number, no + or spaces
instagram: "https://instagram.com/taarabyhk",
email: "hello@taarabyhk.com"
```

## Deploying

This is a plain static site (HTML/CSS/JS, no build step), so it deploys anywhere for free:

**Vercel (recommended):**
1. Push this folder to a GitHub repo.
2. In Vercel, "Import Project" from that repo. Leave build settings blank (no framework, no build command) — it's a static site.
3. Deploy. Every future GitHub push (like editing the CSV) auto-deploys.

**GitHub Pages** works the same way if you'd rather not use Vercel — just enable Pages on the repo, pointing at the root.

## Responsiveness

The layout is built mobile-first with real breakpoints (not just a shrunk desktop layout) — the hero, product grid, category strip, cart, and checkout all restack for phones under ~860px wide. Test on your own phone after deploying; if anything looks cramped on a specific device, the breakpoints are all in `css/style.css` inside `@media` blocks near the section they affect.

## Design notes

Colors were pulled directly from the TAARA logo (deep teal `#123638`, antique gold `#c9a15a`) rather than a generic template palette. Type pairing is Fraunces (display) + Manrope (UI/body) — deliberately not Inter. The recurring "beaded thread" divider (small linked circles) between sections is a nod to the strung-bead bracelets themselves, not decoration for its own sake.
