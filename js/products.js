/* TaaraByHK — loads the product catalog from /data/products.csv
   To add or edit products: open data/products.csv in Excel/Google Sheets,
   add a row, and upload the matching photo to images/products/ in GitHub.
   No code changes needed. */

const IMAGE_BASE = "images/products/";
let __productsCache = null;

function getProducts() {
  if (__productsCache) return Promise.resolve(__productsCache);
  return fetch("data/products.csv", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error("Could not load product catalog");
      return r.text();
    })
    .then((csvText) => {
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const rows = parsed.data
        .filter((r) => r.id && r.name)
        .map((r) => ({
          id: String(r.id).trim(),
          name: (r.name || "").trim(),
          category: (r.category || "Jewellery").trim(),
          price: Number(r.price) || 0,
          image: IMAGE_BASE + (r.image || "").trim(),
          image2: IMAGE_BASE + (r.image2 || r.image || "").trim(),
          description: (r.description || "").trim(),
          badge: (r.badge || "").trim(),
          featured: String(r.featured).trim().toLowerCase() === "yes",
          inStock: String(r.in_stock).trim().toLowerCase() !== "no"
        }));
      __productsCache = rows;
      return rows;
    });
}

function getProductById(id) {
  return getProducts().then((list) => list.find((p) => p.id === String(id)));
}

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function productCardHTML(p, big = false) {
  return `
    <a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="card-media">
        ${p.badge ? `<span class="card-tag">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="card-quickadd" data-quickadd="${p.id}" title="Add to cart">${iconSVG("plus")}</span>
      </div>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <span class="card-name">${p.name}</span>
        <span class="card-price">${money(p.price)}</span>
      </div>
    </a>
  `;
}

function wireQuickAdd(container) {
  container.querySelectorAll("[data-quickadd]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.quickadd;
      getProductById(id).then((p) => {
        if (!p) return;
        addToCart(p, 1);
        toast(`Added "${p.name}" to your bag`);
      });
    });
  });
}
